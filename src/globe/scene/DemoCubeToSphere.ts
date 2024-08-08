import { Mesh, MeshBasicMaterial, MeshPhongMaterial, Points, PointsMaterial, Ray, Vector3 } from 'three';

import { AbstractScene } from '@/globe/scene/AbstractScene';
import { Ellipsoid, WGS84 } from '@/globe/core/Ellipsoid';
import { DebugSideCameraScene } from '@/globe/scene/DebugSideCamera';
import { Orbit3DControl } from '@/globe/core/Orbit3DControl';
import { basicGlobeFactory } from '@/globe/scene/utils/basicGlobe';
import { BoxTessellatedGeometry } from '@/globe/scene/utils/BoxTessellatedGeometry';
import { Geodetic } from '@/globe/core/Geodetic';
import { EllipsoidRayCaster } from '@/globe/core/EllipsoidRayCaster';
import { PointsHelper } from '@/globe/renderer/PointsHelper';

export class DemoCubeToSphere extends AbstractScene {
  ellipsoid: Ellipsoid;
  control: any;
  debug: DebugSideCameraScene;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.ellipsoid = WGS84;

    this.control = new Orbit3DControl(this.camera, this.canvas);
    this.control.target.set(0, 0, 0);

    this.debug = new DebugSideCameraScene(this.camera, this.scene);
    this.debug.start();

    this.initObjects();
  }

  protected initObjects(): void {
    const globe = basicGlobeFactory(this.ellipsoid, { opacity: 0.7});

    this.scene.add(globe);

    // Create cube and project corners of different sides to the sphere
    const cube = new BoxTessellatedGeometry(this.ellipsoid);
    const wireframeMaterial =  new MeshBasicMaterial({
      color: 'green',
      wireframe: true
    });

    const cubeMesh = new Mesh(cube, wireframeMaterial);

    this.scene.add(cubeMesh);

    const pointsMaterial = new PointsMaterial({color: 'red', size: 10, sizeAttenuation: false});
    const points = new Points(cube, pointsMaterial);

    this.scene.add(points);

    const intersections: Vector3[] = [];
    const coords: number[][] = [];

    for (let i=0; i < cube.corners.length; i++) {
      const corner = cube.corners[i];
      console.log(' >> ', i, corner);

      const normal = this.ellipsoid.surfaceNormal(corner);
      console.log(Geodetic.surfaceNormalToGeodeticDegrees(normal));
      coords.push(Geodetic.surfaceNormalToGeodeticDegrees(normal));

      intersections.push(
        this.ellipsoid.polarToCartesian(
          Geodetic.surfaceNormalToGeodetic(normal)
        )
      );
    }

    intersections.splice(0, 4);
    coords.splice(0, 4);

    this.scene.add(
      new PointsHelper(intersections),
    );

    console.log('intersections', intersections);
    console.log('coords', coords.map(c => c.slice(0, 2)));

    console.log(JSON.stringify(coords.map(c => c.slice(0, 2))))
  }
}
