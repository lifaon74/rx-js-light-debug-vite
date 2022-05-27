import { aotPlugin } from '@lirx/dom-aot-plugin';
// import { defineConfig } from 'vite'

// function myPlugin() {
//   return {
//     name: 'transform-file',
//
//     transform(src, id) {
//       console.log(id);
//       // if (fileRegex.test(id)) {
//       //   return {
//       //     code: compileFileToJS(src),
//       //     map: null // provide source map if available
//       //   }
//       // }
//     }
//   }
// }

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
      },
    },
  },
  plugins: [
    // myPlugin(),
    aotPlugin({
      pathMatches: (path) => {
        const matches = path.endsWith('.ts')
          || (
            path.endsWith('component.mjs')
            // && path.includes('lirx/mdi')
          );
        // if (matches) {
        //   console.log(`\nOPTIMIZING => ${path}`);
        // }
        return matches;
      },
    }),
  ],
  server: {
    // https: true,
    // host: true,
    watch: {
      ignored: [/\.cache/],
    },
  },
  optimizeDeps: {
    include: [
      '@lirx/core',
      // '@lirx/dom',
      // '@lirx/mdi',
      // '@lirx/router',
    ],
  },
};

export default config;
