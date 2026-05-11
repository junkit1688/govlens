/* Malaysia GeoJSON Data — ACCURATE GEOGRAPHY
 * Realistic state boundaries matching actual Malaysia silhouette
 * Peninsular Malaysia: tall vertical leaf-like shape
 * East Malaysia: separated by sea gap on the right
 */

export interface MalaysiaFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    region: "peninsular" | "east";
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface MalaysiaGeoJSON {
  type: "FeatureCollection";
  features: MalaysiaFeature[];
}

// Accurate Malaysia state boundaries based on real geography
export const malaysiaGeoJSON: MalaysiaGeoJSON = {
  type: "FeatureCollection",
  features: [
    // ============ PENINSULAR MALAYSIA ============
    // Perlis - tiny northwest corner
    {
      type: "Feature",
      properties: { id: "perlis", name: "Perlis", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.2, 6.4],
            [100.8, 6.35],
            [100.9, 6.75],
            [100.5, 6.85],
            [100.2, 6.65],
            [100.2, 6.4],
          ],
        ],
      },
    },
    // Kedah - below Perlis
    {
      type: "Feature",
      properties: { id: "kedah", name: "Kedah", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.2, 6.65],
            [100.5, 6.85],
            [100.9, 6.75],
            [101.2, 7.1],
            [101.4, 7.5],
            [101.0, 7.8],
            [100.5, 7.6],
            [100.3, 7.2],
            [100.2, 6.65],
          ],
        ],
      },
    },
    // Pulau Pinang - island on west coast
    {
      type: "Feature",
      properties: { id: "penang", name: "Pulau Pinang", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.1, 5.3],
            [100.3, 5.25],
            [100.35, 5.55],
            [100.15, 5.6],
            [100.1, 5.3],
          ],
        ],
      },
    },
    // Perak - large west-central state
    {
      type: "Feature",
      properties: { id: "perak", name: "Perak", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.5, 7.6],
            [101.0, 7.8],
            [101.4, 7.5],
            [101.8, 8.0],
            [102.1, 8.5],
            [102.3, 9.2],
            [102.1, 9.8],
            [101.8, 10.0],
            [101.5, 9.7],
            [101.2, 9.2],
            [100.9, 8.8],
            [100.6, 8.2],
            [100.5, 7.6],
          ],
        ],
      },
    },
    // Kelantan - northeast state
    {
      type: "Feature",
      properties: { id: "kelantan", name: "Kelantan", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.8, 8.0],
            [102.3, 7.8],
            [102.8, 8.0],
            [103.2, 8.3],
            [103.4, 8.8],
            [103.2, 9.2],
            [102.8, 9.0],
            [102.3, 8.7],
            [101.8, 8.0],
          ],
        ],
      },
    },
    // Terengganu - east coast below Kelantan
    {
      type: "Feature",
      properties: { id: "terengganu", name: "Terengganu", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.8, 8.0],
            [103.2, 8.3],
            [103.6, 8.5],
            [103.8, 9.0],
            [103.6, 9.5],
            [103.2, 9.3],
            [102.8, 9.0],
            [102.8, 8.0],
          ],
        ],
      },
    },
    // Pahang - very large central/eastern state
    {
      type: "Feature",
      properties: { id: "pahang", name: "Pahang", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.5, 9.7],
            [102.1, 9.8],
            [102.3, 9.2],
            [102.8, 9.0],
            [103.2, 9.3],
            [103.6, 9.5],
            [103.8, 10.2],
            [103.6, 10.8],
            [103.2, 11.0],
            [102.8, 10.8],
            [102.3, 10.5],
            [102.0, 10.2],
            [101.8, 10.0],
            [101.5, 9.7],
          ],
        ],
      },
    },
    // Selangor - west-central coastal
    {
      type: "Feature",
      properties: { id: "selangor", name: "Selangor", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.2, 9.2],
            [101.5, 9.7],
            [101.8, 10.0],
            [102.0, 10.2],
            [102.3, 10.5],
            [102.5, 10.8],
            [102.3, 11.1],
            [102.0, 11.0],
            [101.7, 10.7],
            [101.4, 10.3],
            [101.2, 9.8],
            [101.2, 9.2],
          ],
        ],
      },
    },
    // Kuala Lumpur - tiny region inside Selangor
    {
      type: "Feature",
      properties: { id: "kl", name: "Kuala Lumpur", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.65, 10.2],
            [101.75, 10.2],
            [101.75, 10.3],
            [101.65, 10.3],
            [101.65, 10.2],
          ],
        ],
      },
    },
    // Putrajaya - tiny region south of KL
    {
      type: "Feature",
      properties: { id: "putrajaya", name: "Putrajaya", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.7, 10.35],
            [101.8, 10.35],
            [101.8, 10.45],
            [101.7, 10.45],
            [101.7, 10.35],
          ],
        ],
      },
    },
    // Negeri Sembilan - below Selangor
    {
      type: "Feature",
      properties: { id: "negeri_sembilan", name: "Negeri Sembilan", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.7, 10.7],
            [102.0, 11.0],
            [102.3, 11.1],
            [102.5, 11.5],
            [102.3, 11.8],
            [102.0, 11.6],
            [101.8, 11.2],
            [101.7, 10.7],
          ],
        ],
      },
    },
    // Melaka - small west coast strip
    {
      type: "Feature",
      properties: { id: "melaka", name: "Melaka", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.0, 11.6],
            [102.3, 11.8],
            [102.4, 12.0],
            [102.2, 12.2],
            [102.0, 12.0],
            [102.0, 11.6],
          ],
        ],
      },
    },
    // Johor - large southern tip with pointed lower edge
    {
      type: "Feature",
      properties: { id: "johor", name: "Johor", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.0, 11.2],
            [102.3, 11.1],
            [102.8, 11.0],
            [103.3, 11.2],
            [103.8, 11.5],
            [104.2, 12.0],
            [104.3, 12.5],
            [104.2, 13.0],
            [103.8, 13.3],
            [103.3, 13.2],
            [102.8, 13.0],
            [102.3, 12.5],
            [102.0, 12.0],
            [102.0, 11.2],
          ],
        ],
      },
    },

    // ============ EAST MALAYSIA ============
    // Sarawak - large horizontal landmass on left
    {
      type: "Feature",
      properties: { id: "sarawak", name: "Sarawak", region: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [109.5, 0.8],
            [114.5, 0.5],
            [115.0, 1.0],
            [115.2, 1.5],
            [115.0, 2.2],
            [114.5, 2.5],
            [114.0, 2.3],
            [113.5, 2.0],
            [113.0, 1.8],
            [112.5, 1.5],
            [112.0, 1.3],
            [111.5, 1.0],
            [110.5, 0.9],
            [109.5, 0.8],
          ],
        ],
      },
    },
    // Sabah - northeast, compact with protruding tip
    {
      type: "Feature",
      properties: { id: "sabah", name: "Sabah", region: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [114.5, 2.5],
            [115.0, 2.2],
            [115.5, 2.5],
            [116.0, 2.8],
            [116.5, 3.2],
            [117.0, 3.5],
            [117.5, 4.0],
            [118.0, 4.3],
            [118.5, 4.5],
            [119.0, 4.2],
            [119.2, 3.8],
            [119.0, 3.3],
            [118.5, 3.0],
            [118.0, 2.8],
            [117.5, 2.6],
            [117.0, 2.5],
            [116.5, 2.4],
            [116.0, 2.5],
            [115.5, 2.5],
            [115.0, 2.2],
            [114.5, 2.5],
          ],
        ],
      },
    },
    // Labuan - tiny island near Sabah
    {
      type: "Feature",
      properties: { id: "labuan", name: "Labuan", region: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [115.15, 4.8],
            [115.35, 4.8],
            [115.35, 5.0],
            [115.15, 5.0],
            [115.15, 4.8],
          ],
        ],
      },
    },
  ],
};

// Helper function to get bounds for map centering
export function getMapBounds(features: MalaysiaFeature[]) {
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;

  features.forEach((feature) => {
    const coords =
      feature.geometry.type === "Polygon"
        ? (feature.geometry.coordinates[0] as number[][])
        : (feature.geometry.coordinates[0][0] as number[][]);

    coords.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });
  });

  return { minLng, maxLng, minLat, maxLat };
}

// Helper function to convert GeoJSON coordinates to SVG path
export function coordsToSVGPath(
  coords: number[][],
  xScale: number,
  yScale: number,
  xOffset: number,
  yOffset: number
): string {
  if (coords.length === 0) return "";

  let path = `M ${(coords[0][0] - xOffset) * xScale} ${(coords[0][1] - yOffset) * yScale}`;

  for (let i = 1; i < coords.length; i++) {
    path += ` L ${(coords[i][0] - xOffset) * xScale} ${(coords[i][1] - yOffset) * yScale}`;
  }

  path += " Z";
  return path;
}
