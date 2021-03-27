import { buildComponent } from './helpers/build-component';
await buildComponent();
export default function myPlugin() {
    return {
        name: 'transform-file',
        transform: async (src, id) => {
            // console.log('transform', src, id);
            if (id.includes('.component.ts')) {
                console.log('\n\n');
                await buildComponent();
                // console.log(src);
                // return {
                //   code: `const a = 5;`,
                //   map: null,
                // };
                console.log('\n\n');
            }
            // if (fileRegex.test(id)) {
            //   return {
            //     code: compileFileToJS(src),
            //     map: null // provide source map if available
            //   }
            // }
        }
    };
}
