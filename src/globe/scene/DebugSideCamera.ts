import { CameraHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { AbstractScene } from '@/globe/scene/AbstractScene';
import { WGS84_SEMI_MAJOR_AXIS } from '@/globe/core/Ellipsoid';

export class DebugSideCameraScene extends AbstractScene {
  private examineeCamera: PerspectiveCamera;
  private examineeScene: Scene;

  WIDTH = 160;
  HEIGHT = 120;

  SCALE_FACTOR = 5;
  private isScaled = false;

  _listener: (event: any) => void;

  constructor(
    camera: PerspectiveCamera,
    scene: Scene
  ) {
    super(document.createElement('canvas') as HTMLCanvasElement);

    this.initCanvas();

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      logarithmicDepthBuffer: true,
      antialias: true,
    });

    this.examineeCamera = camera;
    this.examineeScene = scene;

    this.scene.add(this.examineeScene);

    const N = WGS84_SEMI_MAJOR_AXIS * 3;
    this.flyTo(N, N, N * 0.8);

    const cameraHelper = new CameraHelper( this.examineeCamera );
    this.scene.add(cameraHelper);

    this._listener = this.onClick.bind(this);
    this.canvas.addEventListener('dblclick', this._listener);
  }

  public start(): void {
    // Subscribe on events
    this.onResize = () => {
      this.updateAspect();
      this.render();
    };

    this.onResize();
    window.addEventListener('resize', this.onResize);

    // Start rendering loop
    this.startLoop();
  }
  private initCanvas(): void {
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.canvas.style.position = 'absolute';
    this.canvas.style.bottom = '0';
    this.canvas.style.right = '0';
    this.canvas.style.zIndex = '10';
    this.canvas.style.opacity = '0.8';

    document.body.appendChild(this.canvas);
  }

  private onClick(): void {
    this.isScaled = !this.isScaled;

    this.updateSize();
  }

  private updateSize(): void {
    const k = this.isScaled ? 1 : this.SCALE_FACTOR;
    this.resize(this.WIDTH * k, this.HEIGHT * k);
  }
}
