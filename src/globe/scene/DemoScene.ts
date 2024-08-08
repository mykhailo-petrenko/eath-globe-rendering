import {
  BufferGeometry, Float32BufferAttribute,
  Mesh, MeshPhongMaterial,
  Points, PointsMaterial
} from 'three';
import { WGS84, WGS84_SEMI_MAJOR_AXIS } from '@/globe/core/Ellipsoid';
import { Orbit3DControl } from '@/globe/core/Orbit3DControl';
import { EllipsoidGeometry } from '@/globe/core/EllipsoidGeometry';
import { BasicGlobeMaterial } from '@/globe/renderer/BasicGlobeMaterial';
import { Geodetic } from '@/globe/core/Geodetic';
import { LineHelper } from '@/globe/renderer/LineHelper';
import { AbstractScene } from '@/globe/scene/AbstractScene';

export class DemoScene extends AbstractScene {
  control: any;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    {
      // Controls
      this.control = new Orbit3DControl(this.camera, this.canvas);
      this.control.minDistance = WGS84_SEMI_MAJOR_AXIS + 2;
      this.control.maxDistance = WGS84_SEMI_MAJOR_AXIS * 5;
      this.control.target.set(0, 0, 0);
    }
  }

  public flyTo(x: number, y: number, z: number): void {
    this.control.object.position.set(x, y, z);
    this.control.update();
  }

  public start(): void {
    super.start();

    // Add objects to scene
    this.addObjects();
  }

  protected addObjects() {

    const ellipsoid  = WGS84;
    // const ellipsoid  = new Ellipsoid(6378137.0, 6378137.0, 5000000.0);
    const widthSegments = 32;
    const heightSegments = 16;

    const globeGeometry = new EllipsoidGeometry(ellipsoid, widthSegments, heightSegments);

    const wireframe =  new MeshPhongMaterial({
      color: 'green',
      wireframe: true
    });

    const globeWireframe = new Mesh(globeGeometry, wireframe);
    this.scene.add(globeWireframe);

    // const normalMaterial = new MeshNormalMaterial({
    //   normalMapType: ObjectSpaceNormalMap,
    // });
    // console.log(normalMaterial.toJSON());
    // const globeNormals = new Mesh(globeGeometry, normalMaterial);
    // this.scene.add(globeNormals);

    const basicMaterial = new BasicGlobeMaterial();
    const basicGlobe = new Mesh(globeGeometry, basicMaterial);
    this.scene.add(basicGlobe);

    {
      const coordinate = Geodetic.fromDegrees(0, 45, 0);
      const pointPosition = ellipsoid.polarToCartesian(coordinate);

      // @TODO: Point helper
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute([...pointPosition.toArray()], 3));
      const material = new PointsMaterial({size: 10, color: 'red'});
      material.sizeAttenuation = false;
      const points = new Points(geometry, material);

      this.scene.add(points);

      const geodetic = ellipsoid.surfaceNormal(pointPosition);
      const geocentric = pointPosition.clone().normalize();

      const geodeticArrow = new LineHelper(geodetic, pointPosition, WGS84_SEMI_MAJOR_AXIS, 'red');
      const geocentricArrow = new LineHelper(geocentric, pointPosition, WGS84_SEMI_MAJOR_AXIS, 'blue');
      this.scene.add(geodeticArrow);
      this.scene.add(geocentricArrow);
    }
  }
}
