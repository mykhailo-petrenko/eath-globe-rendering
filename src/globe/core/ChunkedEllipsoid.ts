import { PerspectiveCamera } from 'three';

export interface ChunkedEllipsoidProperties {
  camera: PerspectiveCamera;
}

export class ChunkedEllipsoid {
  private camera: PerspectiveCamera;
  constructor(properties: ChunkedEllipsoidProperties) {
    this.camera = properties.camera;

  }

}
