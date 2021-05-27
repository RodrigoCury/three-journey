uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uElapsedTime;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;


// Function

float fooFunction(float a, float b){ // the tyoe of the function must be what type it returns
    float c = 1.0;

    return a * b * c;
}

void main(){
    vec4 attributes = vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * attributes;
    // modelPosition.y *= 0.5;
    float elevation = sin(modelPosition.x * uFrequency.x - uElapsedTime) * 0.1;
    elevation += cos(modelPosition.y * uFrequency.y - uElapsedTime) * 0.1 ;
    
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}

// gl_Position.x += 0.5;
// vec2 foo = vec2(1.0, 1.2);
// foo.x = 2.0;
// foo.y = 0.5;
// // Multiplies all the properties
// foo *= 2.0;

// vec3 bar = vec3(0.0);
// vec3 bar2 = vec3(1.0, 2.0, 0.0);
// bar.z = 1.0;

// // x == r, y == g, z == b //
// vec3 purpleColor = vec3(0.0);
// purpleColor.r = 0.5;
// purpleColor.g = 1.0;

// // Merge vec2 into vec3

// vec2 merge2 = vec2(1.0, 2.0);
// vec3 merge3 = vec3(merge2, 1.0);

// // Turn values from vec3 into a new vec2 "SWIZZLE"
// vec3 foo = vec3(1.0, 2.0, 3.0);
// vec2 bar = foo.xy;
// bar = foo.yz; // and so on

// // vec4's

// vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
// float bar = foo.w; // x:y:z:w

// // Calling functions
// float foo = fooFunction(1.0,2.0);