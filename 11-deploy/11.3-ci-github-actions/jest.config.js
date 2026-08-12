// La misma configuración de la unidad 10, sin cambios. Está explicada línea por
// línea en 10-testing-jest/10.1-primeros-tests/jest.config.js.
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
