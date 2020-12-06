import typescript from 'rollup-plugin-typescript'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import es3 from 'rollup-plugin-es3'
import resolve from 'rollup-plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import scss from 'rollup-plugin-scss'
import path from 'path'

const env = process.env.NODE_ENV

export default {
  input: path.join(__dirname, './src/index.tsx'),
  output: {
    dir: 'dist',
    format: 'esm',
    exports: 'named',
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    es3({ remove: ['defineProperty', 'freeze'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    scss(),
    css({ // 将css导出
      output: './dist/bundle.css'
    }),
  ]
}