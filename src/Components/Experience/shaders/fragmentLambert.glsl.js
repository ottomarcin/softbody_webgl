export default `precision mediump float; 

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 uColor;
void main()
{
    vec3 kolorek = vec3(0.33, 0.28, 0.77);
    vec3 directionalLightLocation = normalize(vec3(0.5, 0.7, 1.0));
    // vec3 normal = normalize(vNormal)*0.5+0.5;
    vec3 normal = normalize(vNormal);

    float ambientLightPower = 0.4;
    float light = ambientLightPower + max(0.0, dot(normal, directionalLightLocation)*(1.0-ambientLightPower));
    // float light = ambientLightPower ;

    // gl_FragColor = vec4(vNormal, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor = vec4(kolorek*light, 1.0);
    // gl_FragColor = vec4(0.0,vUv.x*light, vUv.y*light,   1.0);
    gl_FragColor = vec4(uColor*light,   1.0);
}`;
