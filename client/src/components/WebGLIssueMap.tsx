import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Droplets,
  Eye,
  Layers,
  MapPin,
  MessageSquare,
  Minus,
  Plus,
  Route,
  Trash2,
  Zap,
} from "lucide-react";
import { citizenReports, type CitizenReport } from "@/lib/mockData";
import { fetchReports } from "@/lib/govlensData";

type ReportCategory = CitizenReport["category"];
type Severity = "Critical" | "High" | "Medium" | "Low";

type ReportMarker = {
  id: string;
  report: CitizenReport;
  lat: number;
  lon: number;
  category: ReportCategory;
  severity: Severity;
  color: string;
};

const TILE_SIZE = 256;
const DEFAULT_CENTER = { lat: 4.2105, lon: 101.9758 };
const DEFAULT_ZOOM = 6;

const categoryItems: { label: ReportCategory | "all"; name: string; icon: typeof Route }[] = [
  { label: "all", name: "All reports", icon: AlertTriangle },
  { label: "pothole", name: "Potholes", icon: Route },
  { label: "road", name: "Road", icon: Route },
  { label: "streetlight", name: "Streetlights", icon: Zap },
  { label: "flooding", name: "Flooding", icon: Droplets },
  { label: "sanitation", name: "Sanitation", icon: Trash2 },
  { label: "other", name: "Other", icon: AlertTriangle },
];

const categoryColors: Record<ReportCategory, string> = {
  pothole: "#EF4444",
  road: "#F97316",
  streetlight: "#FACC15",
  flooding: "#38BDF8",
  sanitation: "#22C55E",
  other: "#8B5CF6",
};

const stateCenters: Record<string, { lat: number; lon: number }> = {
  selangor: { lat: 3.0738, lon: 101.5183 },
  johor: { lat: 1.4927, lon: 103.7414 },
  penang: { lat: 5.4141, lon: 100.3288 },
  "pulau pinang": { lat: 5.4141, lon: 100.3288 },
  perak: { lat: 4.5975, lon: 101.0901 },
  sabah: { lat: 5.9804, lon: 116.0735 },
  sarawak: { lat: 1.5533, lon: 110.3592 },
  kedah: { lat: 6.1184, lon: 100.3685 },
  kelantan: { lat: 6.1254, lon: 102.2381 },
  pahang: { lat: 3.8126, lon: 103.3256 },
  terengganu: { lat: 5.3296, lon: 103.1370 },
  "negeri sembilan": { lat: 2.7258, lon: 101.9424 },
  malacca: { lat: 2.1896, lon: 102.2501 },
  melaka: { lat: 2.1896, lon: 102.2501 },
  perlis: { lat: 6.4449, lon: 100.2048 },
  "kuala lumpur": { lat: 3.1390, lon: 101.6869 },
  putrajaya: { lat: 2.9264, lon: 101.6964 },
  labuan: { lat: 5.2831, lon: 115.2308 },
};

const knownLocations: { match: string; lat: number; lon: number }[] = [
  { match: "jalan ampang", lat: 3.1587, lon: 101.7202 },
  { match: "jalan tun razak", lat: 3.1645, lon: 101.7185 },
  { match: "taman desa", lat: 3.1036, lon: 101.6841 },
  { match: "ss2", lat: 3.1186, lon: 101.6227 },
  { match: "petaling jaya", lat: 3.1073, lon: 101.6067 },
  { match: "jalan ipoh", lat: 4.5975, lon: 101.0901 },
  { match: "ipoh", lat: 4.5975, lon: 101.0901 },
  { match: "taman melawati", lat: 3.2122, lon: 101.7476 },
  { match: "likas", lat: 5.9963, lon: 116.1040 },
  { match: "kota kinabalu", lat: 5.9804, lon: 116.0735 },
];

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute vec3 a_color;
  attribute float a_active;
  uniform float u_time;
  varying vec3 v_color;
  varying float v_active;

  void main() {
    float pulse = 1.0 + sin(u_time * 2.8 + a_position.x * 5.0) * 0.12;
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = a_size * pulse * mix(0.9, 1.25, a_active);
    v_color = a_color;
    v_active = a_active;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_active;

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = length(p);
    float halo = smoothstep(0.50, 0.08, d) * 0.42;
    float core = smoothstep(0.20, 0.0, d);
    if (halo + core <= 0.02) discard;
    gl_FragColor = vec4(v_color, halo + core + v_active * 0.14);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("WebGL report map shader error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("WebGL report map program error", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function lonLatToWorld(lon: number, lat: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const limitedLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const sin = Math.sin((limitedLat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function worldToLonLat(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lon = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lon };
}

function toScreen(lat: number, lon: number, center: { lat: number; lon: number }, zoom: number, size: { width: number; height: number }) {
  const centerWorld = lonLatToWorld(center.lon, center.lat, zoom);
  const pointWorld = lonLatToWorld(lon, lat, zoom);
  return {
    x: pointWorld.x - centerWorld.x + size.width / 2,
    y: pointWorld.y - centerWorld.y + size.height / 2,
  };
}

function reportSeverity(report: CitizenReport): Severity {
  if (report.status === "investigating" || report.upvotes >= 90) return "Critical";
  if (report.upvotes >= 45) return "High";
  if (report.status === "pending") return "Medium";
  return "Low";
}

function knownCoordinateForReport(report: CitizenReport) {
  const text = `${report.location} ${report.title} ${report.state}`.toLowerCase();
  const known = knownLocations.find((item) => text.includes(item.match));
  if (known) return { lat: known.lat, lon: known.lon, source: "known" as const };
  return null;
}

function locateReport(report: CitizenReport, geocoded?: { lat: number; lon: number }) {
  if (geocoded) return geocoded;
  const known = knownCoordinateForReport(report);
  if (known) return { lat: known.lat, lon: known.lon };
  return stateCenters[report.state.toLowerCase()] || DEFAULT_CENTER;
}

function reportToMarker(report: CitizenReport, geocoded?: { lat: number; lon: number }): ReportMarker {
  const point = locateReport(report, geocoded);
  const severity = reportSeverity(report);
  return {
    id: report.id,
    report,
    category: report.category,
    severity,
    color: categoryColors[report.category],
    ...point,
  };
}

function buildTiles(center: { lat: number; lon: number }, zoom: number, size: { width: number; height: number }) {
  const centerWorld = lonLatToWorld(center.lon, center.lat, zoom);
  const startX = centerWorld.x - size.width / 2;
  const startY = centerWorld.y - size.height / 2;
  const endX = centerWorld.x + size.width / 2;
  const endY = centerWorld.y + size.height / 2;
  const minTileX = Math.floor(startX / TILE_SIZE);
  const maxTileX = Math.floor(endX / TILE_SIZE);
  const minTileY = Math.floor(startY / TILE_SIZE);
  const maxTileY = Math.floor(endY / TILE_SIZE);
  const tileLimit = 2 ** zoom;
  const tiles: { key: string; x: number; y: number; srcX: number; srcY: number; left: number; top: number }[] = [];

  for (let y = minTileY; y <= maxTileY; y += 1) {
    if (y < 0 || y >= tileLimit) continue;
    for (let x = minTileX; x <= maxTileX; x += 1) {
      const wrappedX = ((x % tileLimit) + tileLimit) % tileLimit;
      tiles.push({
        key: `${zoom}-${wrappedX}-${y}-${x}`,
        x: wrappedX,
        y,
        srcX: wrappedX,
        srcY: y,
        left: x * TILE_SIZE - startX,
        top: y * TILE_SIZE - startY,
      });
    }
  }

  return tiles;
}

function visibleMarker(marker: ReportMarker, center: { lat: number; lon: number }, zoom: number, size: { width: number; height: number }) {
  const point = toScreen(marker.lat, marker.lon, center, zoom, size);
  return {
    ...marker,
    screenX: point.x,
    screenY: point.y,
    visible: point.x > -48 && point.x < size.width + 48 && point.y > -48 && point.y < size.height + 48,
  };
}

export default function WebGLIssueMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<string | null>(null);
  const markerRef = useRef<ReturnType<typeof visibleMarker>[]>([]);
  const dragRef = useRef<{ x: number; y: number; center: { lat: number; lon: number } } | null>(null);
  const wheelDeltaRef = useRef(0);
  const [reports, setReports] = useState<CitizenReport[]>(citizenReports);
  const [geocodedReports, setGeocodedReports] = useState<Record<string, { lat: number; lon: number }>>({});
  const [activeCategory, setActiveCategory] = useState<ReportCategory | "all">("all");
  const [selectedId, setSelectedId] = useState(citizenReports[0]?.id || "");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [size, setSize] = useState({ width: 900, height: 560 });
  const [darkMap, setDarkMap] = useState(true);

  const markers = useMemo(() => reports.map((report) => reportToMarker(report, geocodedReports[report.id])), [geocodedReports, reports]);
  const filteredMarkers = useMemo(() => {
    return activeCategory === "all" ? markers : markers.filter((marker) => marker.category === activeCategory);
  }, [activeCategory, markers]);
  const screenMarkers = useMemo(() => {
    return filteredMarkers.map((marker) => visibleMarker(marker, center, zoom, size));
  }, [center, filteredMarkers, size, zoom]);
  const selectedMarker = markers.find((marker) => marker.id === selectedId) || markers[0];
  const mapTiles = useMemo(() => buildTiles(center, zoom, size), [center, size, zoom]);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    markerRef.current = screenMarkers;
  }, [screenMarkers]);

  useEffect(() => {
    fetchReports()
      .then((remoteReports) => {
        if (remoteReports.length) {
          setReports([...remoteReports, ...citizenReports]);
          setSelectedId(remoteReports[0].id);
          const point = locateReport(remoteReports[0]);
          setCenter(point);
          setZoom(12);
        }
      })
      .catch(() => setReports(citizenReports));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const ungeocoded = reports
      .filter((report) => !geocodedReports[report.id] && !knownCoordinateForReport(report))
      .slice(0, 10);

    if (!ungeocoded.length) return () => controller.abort();

    const run = async () => {
      const updates: Record<string, { lat: number; lon: number }> = {};

      for (const report of ungeocoded) {
        const query = encodeURIComponent(`${report.location}, ${report.state}, Malaysia`);
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=my&q=${query}`, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          });
          if (!response.ok) continue;
          const data = await response.json();
          const first = Array.isArray(data) ? data[0] : null;
          if (first?.lat && first?.lon) {
            updates[report.id] = { lat: Number(first.lat), lon: Number(first.lon) };
          }
        } catch {
          if (controller.signal.aborted) return;
        }
      }

      if (Object.keys(updates).length) {
        setGeocodedReports((current) => ({ ...current, ...updates }));
      }
    };

    run();
    return () => controller.abort();
  }, [geocodedReports, reports]);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const resize = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: Math.max(320, rect.width), height: Math.max(420, rect.height) });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const program = createProgram(gl);
    const buffer = gl.createBuffer();
    if (!program || !buffer) return;

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const sizeLocation = gl.getAttribLocation(program, "a_size");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const activeLocation = gl.getAttribLocation(program, "a_active");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const buildData = () => {
      const values: number[] = [];
      markerRef.current.forEach((marker) => {
        if (!marker.visible) return;
        const color = hexToRgb(marker.color);
        const active = marker.id === selectedRef.current ? 1 : 0;
        const clipX = (marker.screenX / size.width) * 2 - 1;
        const clipY = 1 - (marker.screenY / size.height) * 2;
        values.push(clipX, clipY, 42 + Math.sqrt(marker.report.upvotes || 1) * 6, color[0], color[1], color[2], active);
      });
      return new Float32Array(values);
    };

    const render = (time: number) => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const data = buildData();
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(sizeLocation);
      gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(activeLocation);
      gl.vertexAttribPointer(activeLocation, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.POINTS, 0, Math.floor(data.length / 7));
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [size]);

  useEffect(() => {
    if (!filteredMarkers.some((marker) => marker.id === selectedId)) {
      const next = filteredMarkers[0];
      if (next) {
        setSelectedId(next.id);
        setCenter({ lat: next.lat, lon: next.lon });
      }
    }
  }, [filteredMarkers, selectedId]);

  const zoomToMarker = (marker: ReportMarker) => {
    setSelectedId(marker.id);
    setCenter({ lat: marker.lat, lon: marker.lon });
    setZoom((value) => Math.max(value, 13));
  };

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.max(5, Math.min(16, nextZoom)));
  };

  const zoomAroundPoint = (nextZoom: number, pointX: number, pointY: number) => {
    const boundedZoom = Math.max(5, Math.min(16, nextZoom));
    if (boundedZoom === zoom) return;

    const currentCenterWorld = lonLatToWorld(center.lon, center.lat, zoom);
    const pointerWorld = {
      x: currentCenterWorld.x + pointX - size.width / 2,
      y: currentCenterWorld.y + pointY - size.height / 2,
    };
    const pointerLocation = worldToLonLat(pointerWorld.x, pointerWorld.y, zoom);
    const nextPointerWorld = lonLatToWorld(pointerLocation.lon, pointerLocation.lat, boundedZoom);
    const nextCenterWorld = {
      x: nextPointerWorld.x - pointX + size.width / 2,
      y: nextPointerWorld.y - pointY + size.height / 2,
    };

    setCenter(worldToLonLat(nextCenterWorld.x, nextCenterWorld.y, boundedZoom));
    setZoom(boundedZoom);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    wheelDeltaRef.current += event.deltaY;
    const zoomThreshold = event.ctrlKey ? 180 : 320;
    if (Math.abs(wheelDeltaRef.current) < zoomThreshold) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const pointX = event.clientX - rect.left;
    const pointY = event.clientY - rect.top;
    const direction = wheelDeltaRef.current < 0 ? 1 : -1;
    wheelDeltaRef.current = 0;

    zoomAroundPoint(zoom + direction, pointX, pointY);
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY, center };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const start = dragRef.current;
    const startWorld = lonLatToWorld(start.center.lon, start.center.lat, zoom);
    const nextWorld = {
      x: startWorld.x - (event.clientX - start.x),
      y: startWorld.y - (event.clientY - start.y),
    };
    setCenter(worldToLonLat(nextWorld.x, nextWorld.y, zoom));
  };

  const stopDrag = () => {
    dragRef.current = null;
  };

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[230px_minmax(0,1fr)_280px] gap-4">
      <div className="space-y-4">
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 12px rgba(34,197,94,0.65)" }} />
            Citizen reports
          </div>
          <div className="py-3 border-t-0">
            <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{reports.length}</div>
            <div className="text-xs mt-1" style={{ color: "#22C55E" }}>Loaded from report page data</div>
          </div>
          <div className="py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{filteredMarkers.length}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Visible filter results</div>
          </div>
        </div>

        <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-sm font-bold text-white px-1 mb-3">Report categories</h3>
          <div className="space-y-1">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveCategory(item.label)}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? "rgba(37,99,235,0.28)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(59,130,246,0.48)" : "transparent"}`,
                    color: isActive ? "#93C5FD" : "rgba(255,255,255,0.58)",
                  }}
                >
                  <Icon size={14} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative rounded-2xl overflow-hidden touch-none cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: "4 / 3", minHeight: 500, background: "#071221", border: "1px solid rgba(59,130,246,0.16)" }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={handleWheel}
      >
        {mapTiles.map((tile) => (
          <img
            key={tile.key}
            src={`https://tile.openstreetmap.org/${zoom}/${tile.srcX}/${tile.srcY}.png`}
            alt=""
            draggable={false}
            className="absolute select-none"
            style={{
              left: tile.left,
              top: tile.top,
              width: TILE_SIZE,
              height: TILE_SIZE,
              filter: darkMap ? "grayscale(0.24) invert(0.92) hue-rotate(178deg) saturate(1.6) brightness(0.6) contrast(1.18)" : "saturate(0.95) brightness(0.9)",
            }}
          />
        ))}

        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.04), rgba(2,6,23,0.36))" }} />
        <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none" />

        <div className="absolute left-4 top-4 z-20 flex gap-2 flex-wrap">
          <span className="rounded-xl px-3 py-2 text-xs font-semibold text-white" style={{ background: "rgba(2,6,23,0.82)", border: "1px solid rgba(255,255,255,0.1)" }}>
            OpenStreetMap + WebGL API
          </span>
          <span className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "rgba(2,6,23,0.72)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.72)" }}>
            Zoom {zoom}
          </span>
        </div>

        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          {[
            { icon: Plus, label: "Zoom in", onClick: () => updateZoom(zoom + 1) },
            { icon: Minus, label: "Zoom out", onClick: () => updateZoom(zoom - 1) },
            { icon: Layers, label: "Toggle map style", onClick: () => setDarkMap((value) => !value) },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onClick}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "rgba(2,6,23,0.82)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {screenMarkers.map((marker) => (
          marker.visible && (
            <button
              key={marker.id}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => zoomToMarker(marker)}
              className="absolute z-20 rounded-full text-xs font-extrabold text-white flex items-center justify-center transition-transform hover:scale-110"
              style={{
                left: marker.screenX,
                top: marker.screenY,
                width: selectedId === marker.id ? 42 : 34,
                height: selectedId === marker.id ? 42 : 34,
                transform: "translate(-50%, -50%)",
                background: marker.color,
                boxShadow: `0 0 28px ${marker.color}`,
                border: selectedId === marker.id ? "2px solid white" : "1px solid rgba(255,255,255,0.62)",
              }}
              title={marker.report.location}
            >
              {Math.max(1, marker.report.upvotes)}
            </button>
          )
        ))}

        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl px-4 py-3 pointer-events-none" style={{ background: "rgba(2,6,23,0.82)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(categoryColors).map(([category, color]) => (
              <span key={category} className="flex items-center gap-1.5 text-xs capitalize" style={{ color: "rgba(255,255,255,0.72)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {category}
              </span>
            ))}
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Showing {filteredMarkers.length} reports</span>
        </div>
      </div>

      <div className="space-y-4">
        {selectedMarker && (
          <motion.div
            key={selectedMarker.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedMarker.report.title}</h3>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <MapPin size={12} />
                  {selectedMarker.report.location}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg font-bold" style={{ color: selectedMarker.color, background: `${selectedMarker.color}22`, border: `1px solid ${selectedMarker.color}55` }}>
                {selectedMarker.severity}
              </span>
            </div>
            <div className="my-4 h-28 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.8)" }}>
              {selectedMarker.report.imageUrl ? (
                <img src={selectedMarker.report.imageUrl} alt={selectedMarker.report.imageAlt} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>{selectedMarker.report.description}</p>
            <div className="mt-4 inline-flex rounded-lg px-3 py-1.5 text-xs font-bold capitalize" style={{ background: "rgba(37,99,235,0.2)", color: "#93C5FD" }}>
              {selectedMarker.report.category}
            </div>
            <div className="mt-5 flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.52)" }}>
              <span className="flex items-center gap-1"><Eye size={13} /> {selectedMarker.report.status}</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} /> {selectedMarker.report.reportedAt}</span>
              <span>{selectedMarker.report.upvotes} upvotes</span>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-base font-bold text-white mb-3">Report list</h3>
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {filteredMarkers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => zoomToMarker(marker)}
                className="w-full rounded-xl p-3 text-left"
                style={{
                  background: selectedId === marker.id ? "rgba(37,99,235,0.18)" : "rgba(255,255,255,0.035)",
                  border: `1px solid ${selectedId === marker.id ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div className="text-xs font-bold text-white">{marker.report.title}</div>
                <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.48)" }}>{marker.report.location}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
