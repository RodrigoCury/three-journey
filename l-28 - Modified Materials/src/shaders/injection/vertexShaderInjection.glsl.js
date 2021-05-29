const codeInjection = require(
    "./vertexShaderInjection.glsl"
).default
const functionInjection = require(
    "./vertexShaderFunctionInjection.glsl"
).default
const uniAttrInjection = require(
    "./vertexShaderUniAttrInjection.glsl"
).default
const shadowMapInjection = require(
    "./vertexShaderShadowMapInjection.glsl"
).default


export default {
    functionInjection,
    codeInjection,
    uniAttrInjection,
    shadowMapInjection,
}