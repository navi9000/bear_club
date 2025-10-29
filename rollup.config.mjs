import cleanup from "rollup-plugin-cleanup"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { minify } from "rollup-plugin-esbuild-minify"

export default {
  input: "index.js",
  plugins: [commonjs(), nodeResolve(), cleanup(), minify()],
  output: [
    {
      dir: "public/js",
      format: "esm",
    },
  ],
}
