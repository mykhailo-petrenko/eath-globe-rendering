import { Ellipsoid } from '@/globe/core/Ellipsoid';
import { Ray } from 'three';
import { solveQuadraticEquation } from '@/globe/math/QuadraticEquation';

export class EllipsoidRayCaster {
  constructor(readonly ellipsoid: Ellipsoid) {
  }

  intersect(ray: Ray): number[] {
    const oneOverRadii2 = this.ellipsoid.oneOverRadiiPow2;
    const a = ray.direction.x * ray.direction.x * oneOverRadii2.x +
      ray.direction.y * ray.direction.y * oneOverRadii2.y +
      ray.direction.z * ray.direction.z * oneOverRadii2.z;
    const b = 2.0 *
      (ray.origin.x * ray.direction.x * oneOverRadii2.x +
        ray.origin.y * ray.direction.y * oneOverRadii2.y +
        ray.origin.z * ray.direction.z * oneOverRadii2.z);
    const c = ray.origin.x * ray.origin.x * oneOverRadii2.x +
      ray.origin.y * ray.origin.y * oneOverRadii2.y +
      ray.origin.z * ray.origin.z * oneOverRadii2.z - 1.0;

    return solveQuadraticEquation(a, b, c);
  }

  isIntersect(ray: Ray): boolean {
    return this.intersect(ray).length > 0;
  }


}
