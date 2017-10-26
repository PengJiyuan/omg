import bubble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  plugins: [
    json(),
    bubble()
  ],
  output: {
    file: 'dist/lcl.js',
    name: 'lcl',
    format: 'umd'
  }
};