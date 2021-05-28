#define PI 3.14159265358979323846264338327950288

varying vec2 vUv;
varying float vTime;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))* 43758.54532123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) + sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    // // Pattern 1
    // float strength = vUv.x;

    // // Pattern 2
    // float strength = vUv.y;
    
    // // Pattern 3
    // float strength = 1.0 - vUv.y;
    
    // // Pattern 4
    // float strength = vUv.y * 10.0;

    // // Pattern 5
    // float strength = mod(vUv.y * 10.0, 0.5);
    
    // // Pattern 6
    // float strength = mod(vUv.y * 50.0, 1.0);
    // strength = step(0.8, strength);
    
    // // Pattern 7
    // float strength = mod(vUv.x * 50.0, 1.0);
    // strength = step(0.8, strength);
    
    // // Pattern 8
    // float strength = step(0.8, mod(vUv.x * 50.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 25.0, 1.0));
    
    // // Pattern 9
    // float strength = step(0.4, mod(vUv.x * 50.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 25.0, 1.0));
    
    // // // Pattern 10
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;
    
    // // Pattern 11
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;
    
    // Pattern 12
    // float strength = abs((vUv.x - 0.5) * 2.0);
    
    // // Pattern 13
    // float strength = min( abs((vUv.x - 0.5)),  abs((vUv.y - 0.5)));
    
    // // Pattern 14
    // float strength = max( abs(vUv.x - 0.5),  abs(vUv.y - 0.5));
    
    // // // Pattern 15
    // float square1 = step(0.2, max( abs(vUv.x - 0.5),  abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max( abs(vUv.x - 0.5),  abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // // Pattern 16
    // float strength = ceil(vUv.x * 10.0) / 10.0;
    
    // // Pattern 17
    // float strength = (ceil(vUv.x * 10.0) / 10.0) * (ceil(vUv.y * 10.0) / 10.0);

    // // Pattern 18
    // float strength = random(vUv);

    // // // Pattern 19
    // vec2 gridUv = vec2((ceil(vUv.x * 10.0) / 10.0), (ceil(vUv.y * 10.0) / 10.0));
    // float strength = random(gridUv);
    
    // // Pattern 20
    // vec2 gridUv = vec2(
    //     (ceil(vUv.x * 10.0) / 10.0), 
    //     (ceil((vUv.y + vUv.x * 0.25)* 10.0) / 10.0)
    // );
    // float strength = random(gridUv);
   
    // // Pattern 21
    // float strength = length(vUv - 0.5);
    
    // // Pattern 22
    // float strength = distance(vUv, vec2(0.5)) * 2.0;

    // // Pattern 23
    // float strength = 1.0 - distance(vUv, vec2(0.5)) * 2.0;
    
    // // Pattern 24
    // float strength = 0.015 / distance(vUv, vec2(0.5));
    
    // // Pattern 25
    // vec2 bar = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    //     );
    // float strength = 0.015 / distance(bar, vec2(0.5));
        
    // // Pattern 26
    // vec2 barX = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    //     );
    // vec2 barY = vec2(
    //     vUv.y * 0.1 + 0.45,
    //     vUv.x * 0.5 + 0.25
    //     );
    // float strengthBarX = 0.015 / distance(barX, vec2(0.5));
    // float strengthBarY = 0.015 / distance(barY, vec2(0.5));
    // float strength = strengthBarX * strengthBarY;
    
    // // Pattern 27
    // vec2 rotatedUv = rotate(vUv, PI*0.25, vec2(0.5));

    // vec2 barX = vec2(
    //     rotatedUv.x * 0.1 + 0.45,
    //     rotatedUv.y * 0.5 + 0.25
    //     );
    // vec2 barY = vec2(
    //     rotatedUv.y * 0.1 + 0.45,
    //     rotatedUv.x * 0.5 + 0.25
    //     );
    // float strengthBarX = 0.015 / distance(barX, vec2(0.5));
    // float strengthBarY = 0.015 / distance(barY, vec2(0.5));
    // float strength = strengthBarX * strengthBarY;
    
    // // Pattern 28
    // float strength = step(0.25, distance(vUv , vec2(0.5)));
    
    // Pattern 29
    // float strength = abs(distance(vUv , vec2(0.5)) - 0.25);
    
    // Pattern 30
    // float strength = step(0.05, abs(distance(vUv , vec2(0.5)) - 0.25));
    
    // Pattern 31
    // float strength = 1.0 - step(0.05, abs(distance(vUv , vec2(0.5)) - 0.25));
    
    // // Pattern 32
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.025, abs(distance(wavedUv , vec2(0.5)) - 0.25));
    
    // // Pattern 33
    vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * vTime * 50.0) * 0.1 + tan(vUv.x * vTime),
        vUv.y + sin(vUv.x * vTime * 50.0) * 0.1+ tan(vUv.y * vTime)
    );
    float strength = 1.0 - step(0.025, abs(distance(wavedUv , vec2(0.5)) - 0.25));
    
    // // Pattern 34
    // vec2 wavedUv = vec2(
    //     vUv.x + cos(vUv.y * vTime * 5.0) ,
    //     vUv.y + sin(vUv.x * vTime * 5.0) 
    // );
    // float strength = 1.0 - step(0.025, abs(distance(wavedUv , vec2(0.5)) - 0.25));


    gl_FragColor = vec4(strength, strength, strength, 1.0);


}