import { Vector3 } from 'three';
import { Geodetic } from '@/globe/core/Geodetic';

/**
 * An ellipsoid is a surface that can be obtained from a sphere by deforming it by means of directional scalings, or more generally, of an affine transformation.
 * https://en.wikipedia.org/wiki/Ellipsoid
 *
 */
export class Ellipsoid {
  readonly radii: Vector3;
  // radii^2
  readonly radiiPow2: Vector3;
  // radii^4
  readonly radiiPow4: Vector3;
  // 1/(radii^2)
  readonly oneOverRadiiPow2: Vector3;

  /**
   * Create Ellipsoid described by 3 radii
   *
   * @param a A radius (lay on X axis)
   * @param b B radius (lay on Y axis)
   * @param c C radius (lay on Z axis)
   */
  constructor(a: number, b: number, c: number) {
    this.radii = new Vector3(a, b, c);
    this.radiiPow2 = new Vector3(a * a, b * b, c * c);
    this.radiiPow4 = new Vector3(
      this.radiiPow2.x * this.radiiPow2.x,
      this.radiiPow2.y * this.radiiPow2.y,
      this.radiiPow2.z * this.radiiPow2.z
    );
    this.oneOverRadiiPow2 = new Vector3(
      1.0 / this.radiiPow2.x,
      1.0 / this.radiiPow2.y,
      1.0 / this.radiiPow2.z
    );
  }

  /**
   * Geodetic Surface Normal
   */
  public surfaceNormal(positionOnSurface: Vector3, target?: Vector3): Vector3 {
    if (target === undefined) {
      target = new Vector3();
    }

    target.copy(positionOnSurface);
    target.multiply(this.oneOverRadiiPow2).normalize();

    return target;
  }

  public polarToCartesian(polar: Geodetic): Vector3 {

    const normal: Vector3 = Geodetic.geodeticSurfaceNormal(polar);
    const k = this.radiiPow2.clone();
    k.multiply(normal);

    const gamma = Math.sqrt(
      (k.x * normal.x) + (k.y * normal.y) + (k.z * normal.z)
    );

    // Get point on a surface
    k.divideScalar(gamma);
    // Height vector from surface
    normal.multiplyScalar(polar.height);

    // Add height above the surface and return
    return k.add(normal);
  }
}

export const WGS84_SEMI_MAJOR_AXIS = 6378137.0;
export const WGS84_SEMI_MINOR_AXIS = 6356752.314245;

export const WGS84 = new Ellipsoid(WGS84_SEMI_MAJOR_AXIS, WGS84_SEMI_MAJOR_AXIS, WGS84_SEMI_MINOR_AXIS);
export const SCALED_WGS84 = new Ellipsoid(1.0, 1.0, 6356752.314245 / 6378137.0);
export const UNIT_SPHERE = new Ellipsoid(1.0, 1.0, 1.0);
