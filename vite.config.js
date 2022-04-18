import { aotPlugin } from '@lirx/dom-aot-plugin';
// import { defineConfig } from 'vite'

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    target: 'esnext',
    minify: 'terser',
    polyfillModulePreload: false,
    terserOptions: {
      toplevel: true,
      ecma: 2020,
      compress: {
        pure_getters: true,
        passes: 5,
        ecma: 2020,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_undefined: true,
      },
      mangle: {
        eval: true,
      }
    },
  },
  plugins: [
    aotPlugin(),
  ],
  server: {
    // https: true,
    // host: true,
    watch: {
      ignored: [/\.cache/],
    }
  },
  optimizeDeps: {
    include: [
      '@lirx/core',
      '@lirx/dom',
      '@lirx/router',
    ],
  },
};

export default config;
