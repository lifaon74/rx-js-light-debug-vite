import { parse } from 'acorn';
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
    const ast = parse(code, { ecmaVersion: 'latest' });
    // console.log(ast);
    // console.log((ast as unknown as Program).body[0]);
    console.log('\n\n------------\n\n');
    optimizeAST(ast, DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS);
    console.log(generate(ast));
}
export async function debugFunctionTraitsUnroll() {
    function IsPipeNowNode(node) {
        return (node.type === 'CallExpression')
            && (node.callee.type === 'Identifier')
            && (node.callee.name === 'pipeNow');
    }
    function uuid() {
        return `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16).padStart(14, '0')}-${Date.now().toString(16).padStart(12, '0')}`;
    }
    function uuid_var() {
        return `var_${uuid().replace('-', '_')}`;
    }
    function unrollPipeNowArgs(args) {
        if (args.length === 1) {
            return args[0];
        }
        else {
            return {
                type: 'CallExpression',
                callee: args[args.length - 1],
                arguments: [
                    unrollPipeNowArgs(args.slice(0, -1)),
                ],
            };
        }
    }
    function unrollPipe(node, ecmaVersion = 'latest') {
        const varName = uuid_var();
        const varNode = {
            type: 'Identifier',
            name: varName,
        };
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
                };
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
                };
        }
    }
    function unrollPipeNow(node) {
        console.log(IsPipeNowNode(node));
        return unrollPipeNowArgs(node.arguments);
    }
    // const ast: Program = parse(`
    //   pipeNow(
    //     num1,
    //     addCurried(num2),
    //     subtractCurried(num3),
    //   )
    // `, { ecmaVersion: 'latest' }) as unknown as Program;
    const ast = parse(`
    pipe(
      addCurried(num2),
      subtractCurried(num3),
    )
  `, { ecmaVersion: 'latest' });
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
    const ast2 = parse(`
    (...args) => add(...args, v1, v2)
  `, { ecmaVersion: 'latest' });
    // const ast2: Program = parse(`
    //   function g() { return add.apply(null, Array.from(arguments).concat([v1, v2])); }
    // `, { ecmaVersion: 'latest' }) as unknown as Program;
    // console.log('hello');
    // console.log(ast);
    console.log(ast2);
    // const newAST = unrollPipeNow((ast.body[0] as ExpressionStatement).expression as CallExpression);
    const newAST = unrollPipe(ast.body[0].expression);
    console.log(generate(newAST));
    // console.log(ast);
}
debugFunctionalUnroll();
