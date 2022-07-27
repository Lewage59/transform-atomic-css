import json from 'rollup-plugin-json';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    typescript(),
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['css', 'dom-serializer', 'htmlparser2', 'less', 'lodash', 'minimatch'],
};