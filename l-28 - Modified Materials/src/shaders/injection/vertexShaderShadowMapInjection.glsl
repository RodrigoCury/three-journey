#include <beginnormal_vertex>

float angle = (uTime);

mat2 rotateMatrix = get2dRotateMatrix(angle);

objectNormal.xz = rotateMatrix * objectNormal.xz;

