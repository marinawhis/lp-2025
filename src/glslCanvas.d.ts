declare module 'glslCanvas' {
  class GlslCanvas {
    constructor(canvas: HTMLCanvasElement, options?: Record<string, unknown>);
    load(fragShader: string, vertShader?: string): void;
    setUniforms(uniforms: Record<string, unknown>): void;
    destroy(): void;
    realToCSSPixels: number;
  }
  export default GlslCanvas;
}