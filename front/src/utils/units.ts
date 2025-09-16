export const MM_TO_SCENE = 0.1; // 1 mm -> 0.1 scene units (centimetre scene)
export const CM_TO_SCENE = 1; // 1 cm -> 1 scene unit
export const M_TO_SCENE = 100; // 1 m -> 100 scene units

export const mm = (v: number) => v * MM_TO_SCENE;
export const cm = (v: number) => v * CM_TO_SCENE;
export const m = (v: number) => v * M_TO_SCENE;

// Scale factor to apply to raw models authored in millimetres so they match the centimetre-based scene.
export const MODEL_SCALE_MM = MM_TO_SCENE; 