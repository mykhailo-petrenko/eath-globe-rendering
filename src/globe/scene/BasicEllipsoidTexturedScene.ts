import { AbstractScene } from '@/globe/scene/AbstractScene';
import { Ellipsoid, WGS84 } from '@/globe/core/Ellipsoid';
import { Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, TextureLoader } from 'three';
import { EllipsoidGeometry } from '@/globe/core/EllipsoidGeometry';
import { Orbit3DControl } from '@/globe/core/Orbit3DControl';
import { DebugSideCameraScene } from '@/globe/scene/DebugSideCamera';
import { basicGlobeFactory } from '@/globe/scene/utils/basicGlobe';

export class BasicEllipsoidTexturedScene extends AbstractScene {
  ellipsoid: Ellipsoid;
  control: any;
  debug: DebugSideCameraScene;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.ellipsoid = WGS84;

    this.initControl();

    this.debug = new DebugSideCameraScene(this.camera, this.scene);
    this.debug.start();
  }

  public start(): void {
    super.start();

    this.initObjects();
  }

  protected initObjects(): void {
    this.initEllipsoidWithTexture();
  }

  protected initEllipsoidWithTexture(): void {
    const globe = basicGlobeFactory(this.ellipsoid);

    this.scene.add(globe);
  }

  protected initControl(): void {
    this.control = new Orbit3DControl(this.camera, this.canvas);
    this.control.target.set(0, 0, 0);
  }

}
