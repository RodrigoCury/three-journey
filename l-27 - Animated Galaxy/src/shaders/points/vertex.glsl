#define PI 3.14159265358979323846264338327950288;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main(){
    /**
      * Position
      */


    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float distToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distToCenter) * uTime * 0.5;
    
    angle += angleOffset;
    modelPosition.x = sin(angle) * distToCenter;
    modelPosition.z = cos(angle) * distToCenter;

    modelPosition.xyz += aRandomness;



    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    /**
      * Size
      */

    gl_PointSize = uSize;
    gl_PointSize *= aScale / - viewPosition.z ;

    /**
      * Size
      */
    vColor = color;
}