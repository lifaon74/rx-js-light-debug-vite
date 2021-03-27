import { Node, parse } from 'acorn';
import {
  ArrowFunctionExpression, BaseNode, CallExpression, ExpressionStatement, FunctionDeclaration, Identifier, Program,
} from 'estree';
// import { generate } from 'astring';
import astring from 'astring';
import { optimizeAST } from './optimize-functional';
import { DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS } from './default-optimize-optional-options.constant';

const { generate } = astring;


export async function debugFunctionalUnroll() {
  // const code = `
  //   pipeSubscribePipeFunctions([
  //     op1(),
  //     op2(),
  //     op3(),
  //     op4(),
  //   ])
  // `;

  // const code = `
  //   pipeSubscribePipeFunctions([])
  // `;

  // const code = `
  //   pipeSubscribePipeFunctions([
  //     op1(),
  //     pipeSubscribePipeFunctions([
  //       op2(),
  //       op3(),
  //     ]),
  //     op4(),
  //   ])
  // `;

  // const code = `
  //   pipeSubscribeFunction(source, [
  //     op1(),
  //     op2(),
  //   ])
  // `;

  const code = `
    pipeSubscribeFunction(source, [])
  `;



  `const emit = (emit) => op2()(op1()(emit));`; // for 'pipe'
  `const emit = op2()(op1()(source));`; // for 'pipeNow'


  // const code = `
  //   pipeSubscribeFunction($progress$.subscribe, [])
  // `;

  const ast: Node = parse(code, { ecmaVersion: 'latest' });
  // console.log(ast);
  // console.log((ast as unknown as Program).body[0]);

  console.log('\n\n------------\n\n');

  optimizeAST(ast, DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS);

  console.log(generate(ast));
}


export async function debugFunctionTraitsUnroll() {

  type TEcmaVersion = 'es5' | 'latest';

  function IsPipeNowNode(node: BaseNode): boolean {
    return (node.type === 'CallExpression')
      && ((node as CallExpression).callee.type === 'Identifier')
      && (((node as CallExpression).callee as Identifier).name === 'pipeNow');
  }

  function uuid() {
    return `${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16).padStart(14, '0') }-${ Date.now().toString(16).padStart(12, '0') }`;
  }

  function uuid_var() {
    return `var_${ uuid().replace('-', '_') }`;
  }


  function unrollPipeNowArgs(args: BaseNode[]): CallExpression | BaseNode {
    if (args.length === 1) {
      return args[0];
    } else {
      return {
        type: 'CallExpression',
        callee: args[args.length - 1],
        arguments: [
          unrollPipeNowArgs(args.slice(0, -1)),
        ],
      } as CallExpression;
    }
  }

  function unrollPipe(node: CallExpression, ecmaVersion: TEcmaVersion = 'latest'): FunctionDeclaration | ArrowFunctionExpression {
    const varName: string = uuid_var();

    const varNode: Identifier = {
      type: 'Identifier',
      name: varName,
    } as Identifier;

    switch (ecmaVersion) {
      case 'latest':
        return {
          type: 'ArrowFunctionExpression',
          id: null,
          expression: true,
          params: [varNode],
          body: unrollPipeNowArgs([
            varNode,
            ...node.arguments,
          ]),
        } as ArrowFunctionExpression;
      default:
        return {
          type: 'FunctionDeclaration',
          id: null,
          params: [varNode],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ReturnStatement',
              argument: unrollPipeNowArgs([
                varNode,
                ...node.arguments,
              ]),
            }],
          },
        } as FunctionDeclaration;
    }
  }

  function unrollPipeNow(node: CallExpression): CallExpression | BaseNode {
    console.log(IsPipeNowNode(node));
    return unrollPipeNowArgs(node.arguments as unknown as BaseNode[]);
  }

  // const ast: Program = parse(`
  //   pipeNow(
  //     num1,
  //     addCurried(num2),
  //     subtractCurried(num3),
  //   )
  // `, { ecmaVersion: 'latest' }) as unknown as Program;

  const ast: Program = parse(`
    pipe(
      addCurried(num2),
      subtractCurried(num3),
    )
  `, { ecmaVersion: 'latest' }) as unknown as Program;

  // const ast: Program = parse(`
  //   curryRight(add)(v1, v2)(v3);
  // `, { ecmaVersion: 'latest' }) as unknown as Program;


  // const ast2: Program = parse(`
  //   function g(c) { return a(b(c)); }
  // `, { ecmaVersion: 'latest' }) as unknown as Program;

  // const ast2: Program = parse(`
  //   (c) => a(b(c))
  // `, { ecmaVersion: 'latest' }) as unknown as Program;

  // curryRight(add)(v1, v2); => (...args) => add(...args, v1, v2)
  const ast2: Program = parse(`
    (...args) => add(...args, v1, v2)
  `, { ecmaVersion: 'latest' }) as unknown as Program;
  // const ast2: Program = parse(`
  //   function g() { return add.apply(null, Array.from(arguments).concat([v1, v2])); }
  // `, { ecmaVersion: 'latest' }) as unknown as Program;

  // console.log('hello');
  // console.log(ast);
  console.log(ast2);
  // const newAST = unrollPipeNow((ast.body[0] as ExpressionStatement).expression as CallExpression);
  const newAST = unrollPipe((ast.body[0] as ExpressionStatement).expression as CallExpression);
  console.log(generate(newAST as any));
  // console.log(ast);
}


debugFunctionalUnroll();


