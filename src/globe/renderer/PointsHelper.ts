import { BufferGeometry, Float32BufferAttribute, Mesh, Object3D, Points, PointsMaterial, Vector3 } from 'three';

export class PointsHelper extends Object3D {
  mesh: Points;

  constructor(points: Vector3[], color = 'green', size = 20) {
    super();
    const vertices: number[] = [];

    for (const p of points) {
      vertices.push(p.x, p.y, p.z);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const material = new PointsMaterial({
      size: size,
      color: color,
      sizeAttenuation: false,
    });

    this.mesh = new Points(geometry, material);

    this.add(this.mesh);
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh = null;
  }
}
