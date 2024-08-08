import { ShaderMaterial, GLSL3 } from 'three';
import { ShaderMaterialParameters } from 'three/src/materials/ShaderMaterial';


const vertex = /* glsl */`
#include <common>
#include <logdepthbuf_pars_vertex>
out vec2 v_uv;
out vec3 v_normal;

void main() {
  v_uv = uv;
  v_normal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  #include <logdepthbuf_vertex>
}
`;

const fragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>

in vec2 v_uv;
in vec3 v_normal;

void main() {
	#include <logdepthbuf_fragment>
//  vec3 n = (v_normal + 1.) * 0.5;
//  outColor = vec4( n, 1.0 );
  gl_FragColor = vec4( v_uv.x, v_uv.y, 0.0, 1.0 );
}
`;

export class BasicGlobeMaterial extends ShaderMaterial {
  constructor(parameters?: ShaderMaterialParameters) {
    super(parameters);

    // this.glslVersion = GLSL3;
    this.vertexShader = vertex;
    this.fragmentShader = fragment;
  }
}
