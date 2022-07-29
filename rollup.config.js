import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
// import commonjs from '@rollup/plugin-commonjs';
// import babel from 'rollup-plugin-babel'
// import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    preserveModules: true,
    format: 'cjs',
    exports: 'auto'
  },
  plugins: [
    cleaner({ targets: ['dist'] }),
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    nodeResolve({ browser: true }),
    // babel({
    //   exclude: 'node_modules/**'
    // }),
    // terser(),
  ],
  external: ['css', 'dom-serializer', 'htmlparser2', 'less', 'lodash', 'minimatch'],
};