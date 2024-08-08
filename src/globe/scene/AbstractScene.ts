import { AmbientLight, DirectionalLight, Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { WGS84_SEMI_MAJOR_AXIS } from '@/globe/core/Ellipsoid';

export class AbstractScene {
  public isAnimate: boolean = false;

  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;

  UP = new Vector3(0, 0, 1);
  NEAR = 1;
  FAR = WGS84_SEMI_MAJOR_AXIS * 10;

  protected canvas: HTMLCanvasElement
  protected onResize: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new Scene();

    this.initCamera();
    this.initLight();
    this.initRenderer();
  }

  protected initCamera(): void     {
    // Camera
    this.camera = new PerspectiveCamera(60, this.getAspect(), this.NEAR, this.FAR);
    this.camera.position.set(0, 1, 1);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.copy(this.UP);
  }

  protected initLight(): void {
    // Light
    const light = new Group();

    light.add( new AmbientLight( 0xeeeeee ) );
    const directional = new DirectionalLight( 0xffffff, 0.7 );
    directional.position.set(1, 1, 1).normalize();
    light.add( directional );

    this.scene.add( light );
  }
  protected initRenderer(): void {
    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      logarithmicDepthBuffer: true,
      antialias: true,
    });
  }

  public start(): void {
    // Subscribe on events
    this.onResize = () => {
      this.canvas.width = window.document.body.offsetWidth;
      this.canvas.height = window.document.body.offsetHeight;
      this.updateAspect();
      this.render();
    };

    this.onResize();
    window.addEventListener('resize', this.onResize);

    // Start rendering loop
    this.startLoop();
  }

  public flyTo(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public startLoop() {
    this.isAnimate = true;

    const tick = () => {
      if (!this.isAnimate) {
        return;
      }

      this.render();

      requestAnimationFrame(tick);
    }

    tick();
  }

  protected getAspect(): number {
    return this.canvas.width / this.canvas.height;
  }

  protected updateAspect() {
    this.camera.aspect = this.getAspect();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.width, this.canvas.height);
  };

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.onResize();
  }

}
