import { Ellipsoid } from '@/globe/core/Ellipsoid';
import { Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, TextureLoader } from 'three';
import { EllipsoidGeometry } from '@/globe/core/EllipsoidGeometry';

export interface BasicGlobeOptions {
  opacity: number;
  widthSegments?: number;
  heightSegments?: number;
  drawNormals?: boolean;
}

export function basicGlobeFactory(
  ellipsoid: Ellipsoid,
  options: BasicGlobeOptions = {opacity: 1., drawNormals: false}
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

  const globeGeometry = new EllipsoidGeometry(ellipsoid, widthSegments, heightSegments);


  const globeFrame = new Mesh(globeGeometry, wireframeMaterial);
  const globeTextured = new Mesh(globeGeometry, texturedMaterial);

  const globe = new Group();

  globe.add(globeTextured);
  globe.add(globeFrame);

  return globe;
}
