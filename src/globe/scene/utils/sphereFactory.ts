import {  WGS84_SEMI_MAJOR_AXIS, WGS84_SEMI_MINOR_AXIS } from '@/globe/core/Ellipsoid';
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  TextureLoader
} from 'three';
import type { BasicGlobeOptions } from '@/globe/scene/utils/basicGlobe';
import { SphereGeometry } from '@/globe/core/SphereGeometry';

export function sphereGlobeFactory(
  options: BasicGlobeOptions = {opacity: 1.}
): Object3D {
  const EARTH_TEXTURE = '/world_topo_bathy_200411_3x5400x2700.jpg';

  const loader = new TextureLoader();
  const naturalEarth = loader.load(EARTH_TEXTURE);

  const wireframeMaterial =  new MeshPhongMaterial({
    color: 'blue',
    wireframe: true
  });

  const texturedMaterial = new MeshBasicMaterial({
    map: naturalEarth,
    transparent: true,
    opacity: options.opacity,
  });

  const widthSegments = options.widthSegments || 32;
  const heightSegments = options.heightSegments || 16;

  const MEAN_RADIUS = (WGS84_SEMI_MAJOR_AXIS + WGS84_SEMI_MINOR_AXIS) / 2;
  const globeGeometry = new SphereGeometry(MEAN_RADIUS, widthSegments, heightSegments);


  const globeFrame = new Mesh(globeGeometry, wireframeMaterial);
  const globeTextured = new Mesh(globeGeometry, texturedMaterial);

  const globe = new Group();

  globe.add(globeTextured);
  globe.add(globeFrame);

  return globe;
}
