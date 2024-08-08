import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { Ellipsoid } from '@/globe/core/Ellipsoid';

export class BoxTessellatedGeometry extends BufferGeometry {
  readonly corners: Vector3[] = [];
  readonly type = 'boxTessellated';

  constructor(
    private ellipsoid: Ellipsoid
  ) {
    super();

    // Buffers
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    const corner: Vector3 = this.ellipsoid.radii.clone();
    // corner.multiplyScalar(0.5);

    this.corners.push(new Vector3(-corner.x, -corner.y, -corner.z)); // 0
    this.corners.push(new Vector3( corner.x, -corner.y, -corner.z)); // 1
    this.corners.push(new Vector3( corner.x,  corner.y, -corner.z)); // 2
    this.corners.push(new Vector3(-corner.x,  corner.y, -corner.z)); // 3
    this.corners.push(new Vector3(-corner.x, -corner.y,  corner.z)); // 4
    this.corners.push(new Vector3( corner.x, -corner.y,  corner.z)); // 5
    this.corners.push(new Vector3( corner.x,  corner.y,  corner.z)); // 6
    this.corners.push(new Vector3(-corner.x,  corner.y,  corner.z)); // 7

    vertices.push(-corner.x, -corner.y, -corner.z); // 0
    vertices.push( corner.x, -corner.y, -corner.z); // 1
    vertices.push( corner.x,  corner.y, -corner.z); // 2
    vertices.push(-corner.x,  corner.y, -corner.z); // 3
    vertices.push(-corner.x, -corner.y,  corner.z); // 4
    vertices.push( corner.x, -corner.y,  corner.z); // 5
    vertices.push( corner.x,  corner.y,  corner.z); // 6
    vertices.push(-corner.x,  corner.y,  corner.z); // 7

    // Top: plane z = corner.Z
    indices.push(4, 5, 6);
    indices.push(4, 6, 7);
    // Bottom: plane z = -corner.Z
    indices.push(1, 0, 3);
    indices.push(1, 3, 2);
    // Side: plane x = corner.X
    indices.push(1, 6, 5);
    indices.push(1, 2, 6);
    // Side: plane y = corner.Y
    indices.push(2, 3, 7);
    indices.push(2, 7, 6);
    // Side: plane x = -corner.X
    indices.push(3, 0, 4);
    indices.push(3, 4, 7);
    // Side: plane y = -corner.Y
    indices.push(0, 1, 5);
    indices.push(0, 5, 4);

    // build geometry
    this.setIndex(indices);
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  }
}
