uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;

void main(){

    vec2 newUv = vec2(
        vUv.x + sin(vUv.y * 10.0 + uTime) * 0.1,
        vUv.y
    );
    

    vec4 color = texture2D(tDiffuse, newUv);


    gl_FragColor = color;
}