import { useEffect, useMemo, useRef } from "react";
import { statesData } from "@/lib/mockData";
import { MALAYSIA_STATES } from "@/lib/malaysiaPaths";

type WebGLCivicLayerProps = {
  hoveredState: string | null;
};

type CivicPoint = {
  id: string;
  x: number;
  y: number;
  size: number;
  intensity: number;
  color: [number, number, number];
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute vec3 a_color;
  attribute float a_intensity;

  uniform float u_time;

  varying vec3 v_color;
  varying float v_intensity;

  void main() {
    float pulse = sin(u_time * 2.2 + a_intensity * 6.28318) * 0.18 + 1.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = a_size * pulse;
    v_color = a_color;
    v_intensity = a_intensity;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec3 v_color;
  varying float v_intensity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(center);
    float core = smoothstep(0.22, 0.0, distanceFromCenter);
    float glow = smoothstep(0.5, 0.12, distanceFromCenter) * 0.42;
    float alpha = (core + glow) * (0.42 + v_intensity * 0.58);

    if (alpha <= 0.01) discard;
    gl_FragColor = vec4(v_color, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("WebGL shader error", gl.getShaderInfoLog(shader));
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
    console.error("WebGL program error", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

function toClipX(x: number) {
  return (x / 900) * 2 - 1;
}

function toClipY(y: number) {
  return 1 - (y / 500) * 2;
}

export default function WebGLCivicLayer({ hoveredState }: WebGLCivicLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoveredStateRef = useRef(hoveredState);

  const points = useMemo<CivicPoint[]>(() => {
    const maxReports = Math.max(...Object.values(statesData).map((state) => state.stats.citizenReports));
    const maxAllocation = Math.max(...Object.values(statesData).map((state) => state.totalAllocation));

    return MALAYSIA_STATES.map((shape) => {
      const data = statesData[shape.id];
      const reportRatio = data ? data.stats.citizenReports / maxReports : 0.35;
      const allocationRatio = data ? data.totalAllocation / maxAllocation : 0.35;
      const size = 10 + reportRatio * 18;
      const color = hexToRgb(allocationRatio > 0.72 ? "#FACC15" : allocationRatio > 0.48 ? "#0EA5E9" : "#22C55E");

      return {
        id: shape.id,
        x: toClipX(shape.cx),
        y: toClipY(shape.cy),
        size,
        intensity: Math.max(0.2, reportRatio),
        color,
      };
    });
  }, []);

  useEffect(() => {
    hoveredStateRef.current = hoveredState;
  }, [hoveredState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    if (!buffer) return;

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const sizeLocation = gl.getAttribLocation(program, "a_size");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const intensityLocation = gl.getAttribLocation(program, "a_intensity");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
    let animationFrame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const buildPointData = () => {
      const hovered = hoveredStateRef.current;
      const values: number[] = [];

      points.forEach((point) => {
        const isHovered = hovered === point.id;
        const size = isHovered ? point.size * 1.55 : point.size;
        const intensity = isHovered ? 1 : point.intensity;

        values.push(point.x, point.y, size, point.color[0], point.color[1], point.color[2], intensity);
      });

      return new Float32Array(values);
    };

    const render = (time: number) => {
      resize();

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, buildPointData(), gl.DYNAMIC_DRAW);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, 0);

      gl.enableVertexAttribArray(sizeLocation);
      gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(intensityLocation);
      gl.vertexAttribPointer(intensityLocation, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);

      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.POINTS, 0, points.length);

      animationFrame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    animationFrame = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="WebGL civic activity visualization layer"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
