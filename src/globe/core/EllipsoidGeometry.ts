import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

import { Ellipsoid } from '@/globe/core/Ellipsoid';

const TWO_PI = Math.PI * 2.;

/**
 * EllipsoidGeometry
 *
 * EPSG:6500 Cartesian 3D CS (geocentric).
 * Axes: geocentric X Y Z.
 * Orientations: X and Y in equatorial plane,
 *  X positive through intersection with prime meridian, EPSG:115
 *  Y through 0°N 90°E. EPSG:116
 *  Z axis parallel to mean earth rotation axis and positive towards the North Pole. EPSG:117
 *  UoM: m.
 *
 *  https://epsg.io/9602-method Geographic/geocentric conversions
 */
export class EllipsoidGeometry extends BufferGeometry {
  readonly type = 'ellipsoidGeometry';
  constructor(
    ellipsoid: Ellipsoid,
    widthSegments = 32,
    heightSegments = 16,
  ) {
    super();

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const phiStart = -Math.PI; // Start from Antimeridian
    const phiLength = TWO_PI; // And end on the Antimeridian
    // UV x coordinate will be 0.5 at zero Meridian

    const thetaStart = 0;
    const thetaLength = Math.PI - thetaStart * 2;
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    // Buffers
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    let index = 0;
    const vertex = new Vector3();
    const normal = new Vector3();
    const grid: number[][] = [];

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow: number[] = [];

      const v = iy / heightSegments;

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        // vertex
        vertex.x = ellipsoid.radii.x * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex.y = ellipsoid.radii.y * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex.z = ellipsoid.radii.z * Math.cos(thetaStart + v * thetaLength);

        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal
        ellipsoid.surfaceNormal(vertex, normal);
        normals.push(normal.x, normal.y, normal.z);

        // uv
        uvs.push(
          (Math.atan2(normal.y, normal.x) / TWO_PI) + 0.5,
          (Math.asin(normal.z) / Math.PI) + 0.5
        );
        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // indices
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
      }
    }

    // build geometry
    this.setIndex(indices);
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  }
}
