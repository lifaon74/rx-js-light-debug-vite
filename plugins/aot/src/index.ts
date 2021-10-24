// import ts from 'typescript';

// import { Node, parse } from 'acorn';
// import { full } from 'acorn-walk';
// import { IOptimizeFunctionalOptions, optimizeAST } from '../../functional/helpers/optimize-functional';

// export function optimizeFunctional(
//   code: string,
//   options: IOptimizeFunctionalOptions,
// ): string {
//   let ast: Node;
//   try {
//     ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
//   } catch {
//     ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
//   }
//   return generate(optimizeAST(ast, options));
// }


// function run() {
//   console.log('abc');
//   // ts.pa
// }
//
// run();
//

import { parseEcmaScript } from './parse/parse-ecsmascript';
import { PluginOption } from 'vite';

async function runAOT(
  src: string,
): Promise<string> {
  const ast = parseEcmaScript(src);

  return 'abc';
}



export default function aotPlugin(
): PluginOption {
  return {
    name: 'aot',

    transform: async (
      src: string,
      id: string,
    ): Promise<any> => {
      if (id.endsWith('.ts')) {
        return {
          code: await runAOT(src),
          map: null,
        };
      }
    }
  };
}



