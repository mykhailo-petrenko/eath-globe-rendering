
export function solveQuadraticEquation(a: number, b: number, c: number): number[] {
  // Solve the quadratic equation: ax^2 + bx + c = 0.
  // Algorithm is from Wikipedia's "Quadratic equation" topic, and Wikipedia credits
  // Numerical Recipes in C, section 5.6: "Quadratic and Cubic Equations"
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0.0) {
    // no intersections
    return [];
  } else if (discriminant == 0.0) {
    // one intersection at a tangent point
    return [-0.5 * b / a]
  }

  const t = -0.5 * (b + (b > 0.0 ? 1.0 : -1.0) * Math.sqrt(discriminant));
  const root1 = t / a;
  const root2 = c / t;

  if (root1 < root2) {
    return [root1, root2];
  } else {
    return [root2, root1];
  }
}
