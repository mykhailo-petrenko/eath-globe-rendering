import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Object3D, Vector3 } from 'three';

export class LineHelper extends Object3D {
  private line: Line;

  constructor(direction: Vector3, origin: Vector3, length: number, color: string = 'red') {
    super();

    const transformation = direction.clone().multiplyScalar(length);
    const destination = origin.clone().multiply(transformation);

    const points = [...origin.toArray(), ...destination.toArray()];
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
    this.line = new Line( geometry, new LineBasicMaterial( { color: color, toneMapped: false } ) );

    this.add(this.line);
  }

  public dispose(): void {
    this.line.geometry.dispose();
  }
}
