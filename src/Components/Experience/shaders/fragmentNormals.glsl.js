export default `precision mediump float; 

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 uColor;
void main()
{
    vec3 normal = normalize(vNormal)*0.5+0.5;

    gl_FragColor = vec4(normal, 1.0);
}`;
