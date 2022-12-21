export default `
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 uModelToWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    gl_Position = uProjectionMatrix * uViewMatrix * uModelToWorldMatrix * vec4(aPosition, 1.0);

    vNormal = mat3(uModelToWorldMatrix) * aNormal; // changing normals after object rotations
    vColor = aColor;
    vUv = aUv;
}`;
