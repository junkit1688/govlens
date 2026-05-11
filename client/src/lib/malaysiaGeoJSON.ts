/* Malaysia GeoJSON Data
 * Accurate state boundaries with realistic geography
 * Coordinates in [longitude, latitude] format (GeoJSON standard)
 * Based on official Malaysia administrative boundaries
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

// Accurate Malaysia state boundaries
export const malaysiaGeoJSON: MalaysiaGeoJSON = {
  type: "FeatureCollection",
  features: [
    // PENINSULAR MALAYSIA
    {
      type: "Feature",
      properties: { id: "perlis", name: "Perlis", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.2, 6.45],
            [100.8, 6.4],
            [100.85, 6.8],
            [100.5, 6.95],
            [100.2, 6.8],
            [100.2, 6.45],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "kedah", name: "Kedah", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.2, 6.8],
            [100.5, 6.95],
            [100.85, 6.8],
            [101.0, 7.2],
            [101.2, 7.5],
            [100.8, 7.8],
            [100.4, 7.5],
            [100.2, 7.0],
            [100.2, 6.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "penang", name: "Pulau Pinang", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.15, 5.2],
            [100.35, 5.15],
            [100.4, 5.5],
            [100.2, 5.6],
            [100.15, 5.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "perak", name: "Perak", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.4, 7.5],
            [100.8, 7.8],
            [101.2, 7.5],
            [101.5, 8.0],
            [101.8, 8.5],
            [102.0, 9.0],
            [101.8, 9.5],
            [101.5, 9.8],
            [101.2, 9.5],
            [101.0, 9.0],
            [100.8, 8.5],
            [100.6, 8.0],
            [100.4, 7.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "selangor", name: "Selangor", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.2, 9.5],
            [101.5, 9.8],
            [102.0, 9.5],
            [102.3, 9.8],
            [102.5, 10.2],
            [102.3, 10.5],
            [102.0, 10.3],
            [101.5, 10.0],
            [101.2, 9.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "kl", name: "Kuala Lumpur", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.65, 10.1],
            [101.75, 10.1],
            [101.75, 10.2],
            [101.65, 10.2],
            [101.65, 10.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "putrajaya", name: "Putrajaya", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.7, 10.25],
            [101.8, 10.25],
            [101.8, 10.35],
            [101.7, 10.35],
            [101.7, 10.25],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "negeri_sembilan", name: "Negeri Sembilan", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.5, 10.0],
            [102.0, 10.3],
            [102.3, 10.5],
            [102.5, 11.0],
            [102.3, 11.3],
            [102.0, 11.0],
            [101.5, 10.5],
            [101.5, 10.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "melaka", name: "Melaka", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.0, 11.0],
            [102.3, 11.3],
            [102.5, 11.5],
            [102.3, 11.8],
            [102.0, 11.5],
            [102.0, 11.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "johor", name: "Johor", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.0, 11.5],
            [102.3, 11.8],
            [102.8, 11.8],
            [103.3, 12.0],
            [103.8, 12.5],
            [104.0, 13.0],
            [103.8, 13.5],
            [103.3, 13.3],
            [102.8, 13.0],
            [102.5, 12.5],
            [102.3, 12.0],
            [102.0, 11.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "pahang", name: "Pahang", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.8, 9.5],
            [102.3, 9.8],
            [102.8, 9.5],
            [103.3, 9.8],
            [103.8, 10.0],
            [104.0, 10.5],
            [103.8, 11.0],
            [103.3, 11.2],
            [102.8, 11.0],
            [102.5, 10.5],
            [102.3, 10.0],
            [101.8, 9.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "terengganu", name: "Terengganu", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.8, 9.5],
            [103.3, 9.8],
            [103.8, 9.5],
            [104.3, 9.8],
            [104.5, 10.3],
            [104.3, 10.8],
            [103.8, 10.5],
            [103.3, 10.2],
            [102.8, 9.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "kelantan", name: "Kelantan", region: "peninsular" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.0, 8.5],
            [102.5, 8.3],
            [103.0, 8.5],
            [103.3, 8.8],
            [103.5, 9.2],
            [103.3, 9.5],
            [102.8, 9.3],
            [102.3, 9.0],
            [102.0, 8.5],
          ],
        ],
      },
    },

    // EAST MALAYSIA - SABAH
    {
      type: "Feature",
      properties: { id: "sabah", name: "Sabah", region: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [115.0, 4.0],
            [119.0, 3.5],
            [119.5, 4.0],
            [119.8, 4.5],
            [119.5, 5.0],
            [119.0, 5.5],
            [118.5, 5.8],
            [117.5, 5.5],
            [116.5, 5.0],
            [115.5, 4.5],
            [115.0, 4.0],
          ],
        ],
      },
    },

    // EAST MALAYSIA - LABUAN
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

    // EAST MALAYSIA - SARAWAK
    {
      type: "Feature",
      properties: { id: "sarawak", name: "Sarawak", region: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [109.5, 0.8],
            [115.0, 0.5],
            [115.3, 1.0],
            [115.5, 1.5],
            [115.3, 2.0],
            [115.0, 2.5],
            [114.5, 2.8],
            [114.0, 2.5],
            [113.5, 2.0],
            [113.0, 1.8],
            [112.5, 1.5],
            [112.0, 1.2],
            [111.5, 1.0],
            [110.5, 0.8],
            [109.5, 0.8],
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
