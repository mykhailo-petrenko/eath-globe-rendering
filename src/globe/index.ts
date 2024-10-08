import { WGS84_SEMI_MAJOR_AXIS } from '@/globe/core/Ellipsoid';
// import { DemoScene } from '@/globe/scene/DemoScene';
// import { BasicEllipsoidTexturedScene } from '@/globe/scene/BasicEllipsoidTexturedScene';
// import { DemoCubeToSphere } from '@/globe/scene/DemoCubeToSphere';
// import { UVRectifierScene } from '@/globe/scene/UVRectifierScene';
import { EarthScene } from '@/globe/scene/EarthScene';

const canvasElement = document.getElementById('GeoMapCanvas') as HTMLCanvasElement;
// const cssRendererElement = document.getElementById('GeoMapCSSRenderContainer') as HTMLElement;


// const scene = new DemoScene(canvasElement);
// const scene = new BasicEllipsoidTexturedScene(canvasElement);
// const scene = new DemoCubeToSphere(canvasElement);
// const scene = new UVRectifierScene(canvasElement);
const scene = new EarthScene(canvasElement);


scene.start();
scene.flyTo(0, -WGS84_SEMI_MAJOR_AXIS * 3, WGS84_SEMI_MAJOR_AXIS);
