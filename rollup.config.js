import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel'
// import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'auto'
  },
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    commonjs(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    // terser(),
  ],
  external: ['css', 'dom-serializer', 'htmlparser2', 'less', 'lodash', 'minimatch'],
};