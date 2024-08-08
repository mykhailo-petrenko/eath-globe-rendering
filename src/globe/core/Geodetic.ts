import { Vector3 } from 'three';

const DEG2RAD = Math.PI / 180.;
const RAD2DEG = 180. / Math.PI;

export class Geodetic {

  /**
   *
   * @param longitude Longitude in radians
   * @param latitude Latitude in radians
   * @param height Height above the Ellipsoid surface in meters
   */
  constructor(
    readonly longitude: number,
    readonly latitude: number,
    readonly height: number = 0
  ) {
  }

  static fromDegrees(longitude: number, latitude: number, height: number = 0) {
    return new Geodetic(
      longitude * DEG2RAD,
      latitude * DEG2RAD,
      height
    );
  }

  static toDegrees(coordinate: Geodetic): [number, number, number] {
    return [
      coordinate.longitude * RAD2DEG,
      coordinate.latitude * RAD2DEG,
      coordinate.height,
    ];
  }

  static geodeticSurfaceNormal(coordinate: Geodetic, target?: Vector3): Vector3 {
    if (target === undefined) {
      target = new Vector3();
    }

    const cosLatitude = Math.cos(coordinate.latitude);

    target.set(
      cosLatitude * Math.cos(coordinate.longitude),
      cosLatitude * Math.sin(coordinate.longitude),
      Math.sin(coordinate.latitude)
    );

    return target;
  }

  static surfaceNormalToGeodetic(normal: Vector3): Geodetic {
    return new Geodetic(
      Math.atan2(normal.y, normal.x),
      Math.asin(normal.z),
      0
    );
  }

  static surfaceNormalToGeodeticDegrees(normal: Vector3): [number, number, number] {
    return [
      Math.atan2(normal.y, normal.x) * RAD2DEG,
      Math.asin(normal.z) * RAD2DEG,
      0
    ];
  }
}
