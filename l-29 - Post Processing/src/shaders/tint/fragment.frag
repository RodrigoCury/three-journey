uniform sampler2D tDiffuse;
uniform vec3 uTint;
varying vec2 vUv;

void main(){
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 tint = vec4(uTint, 1.0);

    color.xyz *= tint.xyz;


    gl_FragColor = color;
}