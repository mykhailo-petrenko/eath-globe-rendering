import {
  AxesHelper,
  Group
} from 'three';

import { AbstractScene } from '@/globe/scene/AbstractScene';
import { Ellipsoid, WGS84, WGS84_SEMI_MAJOR_AXIS } from '@/globe/core/Ellipsoid';
import { DebugSideCameraScene } from '@/globe/scene/DebugSideCamera';
import { Orbit3DControl } from '@/globe/core/Orbit3DControl';
import { basicGlobeFactory } from '@/globe/scene/utils/basicGlobe';
import { sphereGlobeFactory } from '@/globe/scene/utils/sphereFactory';

export class UVRectifierScene extends AbstractScene {
  ellipsoid: Ellipsoid;
  control: any;
  debug: DebugSideCameraScene;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.camera.far = this.FAR * 10;
    this.camera.updateProjectionMatrix();

    this.ellipsoid = WGS84;

    this.control = new Orbit3DControl(this.camera, this.canvas);
    this.control.target.set(0, 0, 0);
    // this.control.autoRotate = true;

    this.debug = new DebugSideCameraScene(this.camera, this.scene);
    this.debug.start();

    this.initObjects();
  }

  public render(): void {
    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  protected initObjects(): void {
    {
      const globe = basicGlobeFactory(this.ellipsoid, {opacity: 0.7, widthSegments: 128, heightSegments: 64});
      globe.add(new AxesHelper( WGS84_SEMI_MAJOR_AXIS * 1.5 ))
      globe.translateX(-WGS84_SEMI_MAJOR_AXIS);
      this.scene.add(globe);
    }



    const sphereEarth = new Group();
    sphereEarth.translateX(WGS84_SEMI_MAJOR_AXIS);
    {
      const pseudoGlobe = sphereGlobeFactory({opacity: 0.7, widthSegments: 128, heightSegments: 64});
      sphereEarth.add(pseudoGlobe);
      sphereEarth.add(new AxesHelper( WGS84_SEMI_MAJOR_AXIS * 1.5 ))
    }
    this.scene.add(sphereEarth);

    this.control.target.set(0, 0, 0);
    this.control.object.position.set(WGS84_SEMI_MAJOR_AXIS*2, 0, 0);
    this.control.update();

  }
}
