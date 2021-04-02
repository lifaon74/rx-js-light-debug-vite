import { parse } from 'acorn';
import { full } from 'acorn-walk';
// import { generate } from 'astring';
import * as astring from 'astring';
const generate = (astring.generate ?? astring.default.generate);
/** MISC **/
export function replaceObjectProperties(obj, newObject) {
    [
        ...Object.getOwnPropertyNames(obj),
        ...Object.getOwnPropertySymbols(obj)
    ].forEach((key) => {
        delete obj[key];
    });
    Object.assign(obj, newObject);
    return newObject;
}
export function createBlockStatementNode(params) {
    return {
        ...params,
        type: 'BlockStatement',
    };
}
export function createReturnStatementNode(params) {
    return {
        ...params,
        type: 'ReturnStatement',
    };
}
export function createIdentifierNode(params) {
    return {
        ...params,
        type: 'Identifier',
    };
}
export function createArrowFunctionExpressionNode(params) {
    return {
        ...params,
        type: 'ArrowFunctionExpression',
    };
}
export function createFunctionDeclarationNode(params) {
    return {
        ...params,
        type: 'FunctionDeclaration',
    };
}
// export function createFunctionNode(
//   params?: Pattern[],
//   body?: BlockStatement | Expression,
//   ecmaVersion: IEcmaVersion = 'latest',
// ): ArrowFunctionExpression | FunctionDeclaration {
//   switch (ecmaVersion) {
//     case 'latest':
//       return createArrowFunctionExpressionNode(params, body);
//     default:
//       return createFunctionDeclarationNode(params, body as BlockStatement);
//   }
// }
function uuid() {
    return `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16).padStart(14, '0')}-${Date.now().toString(16).padStart(12, '0')}`;
}
export function uuid_var() {
    return `var_${uuid().replace('-', '_')}`;
}
/** IS NODE **/
export function isCallExpressionNode(node) {
    return (node.type === 'CallExpression');
}
export function isIdentifierNode(node) {
    return (node.type === 'Identifier');
}
export function isArrayExpressionNode(node) {
    return (node.type === 'ArrayExpression');
}
/** PIPE NODE **/
export function isPipeNode(node, pipeFunctionName) {
    return isCallExpressionNode(node)
        && isIdentifierNode(node.callee)
        && pipeFunctionName.has(node.callee.name);
}
function extractPipeElements(elements, pipeFunctionName) {
    return elements;
    // TODO => better implementation, but the tree-walker explores first the leaf, resulting in non optimizable build
    // return elements
    //   .map((element: Expression) => {
    //     const elements: IPipeNodeElements | null = extractPipeNodeElements(element, pipeFunctionName);
    //     return (elements === null)
    //       ? [element]
    //       : elements;
    //   })
    //   .flat();
}
export function extractPipeNodeElements(node, pipeFunctionName) {
    if (isPipeNode(node, pipeFunctionName)) {
        if (node.arguments.length === 1) {
            const arg0 = node.arguments[0];
            if (isArrayExpressionNode(arg0)) {
                return extractPipeElements(arg0.elements, pipeFunctionName);
            }
            else {
                throw new Error(`Expected array`);
            }
        }
        else {
            throw new Error(`Expected one argument`);
        }
    }
    else {
        return null;
    }
}
function unrollPipes(pipes) {
    if (pipes.length === 0) {
        throw new Error(`Unrolling empty pipes`);
        // return createFunctionNode(void 0, void 0, ecmaVersion);
    }
    else if (pipes.length === 1) {
        return pipes[0];
    }
    else {
        return {
            type: 'CallExpression',
            callee: pipes[pipes.length - 1],
            arguments: [
                unrollPipes(pipes.slice(0, -1)),
            ],
        };
    }
}
export function unrollPipeNodeElements(pipes, ecmaVersion) {
    const varNode = createIdentifierNode({ name: uuid_var() });
    const unrolled = unrollPipes([
        varNode,
        ...pipes,
    ]);
    switch (ecmaVersion) {
        case 'latest':
            return createArrowFunctionExpressionNode({
                expression: true,
                params: [varNode],
                body: unrolled,
            });
        default:
            return createFunctionDeclarationNode({
                params: [varNode],
                id: null,
                body: createBlockStatementNode({
                    body: [
                        createReturnStatementNode({
                            argument: unrolled,
                        }),
                    ]
                }),
            });
    }
}
export function handlePipeNode(node, options) {
    const elements = extractPipeNodeElements(node, options.pipeFunctionName);
    if (elements) {
        replaceObjectProperties(node, unrollPipeNodeElements(elements, options.ecmaVersion));
        return true;
    }
    else {
        return false;
    }
}
/** PIPE NOW NODE **/
export function isPipeNowNode(node, pipeNowFunctionName) {
    return isCallExpressionNode(node)
        && isIdentifierNode(node.callee)
        && pipeNowFunctionName.has(node.callee.name);
}
export function extractPipeNowNodeElements(node, pipeNowFunctionName, pipeFunctionName) {
    if (isPipeNowNode(node, pipeNowFunctionName)) {
        if (node.arguments.length === 2) {
            const arg0 = node.arguments[0];
            const arg1 = node.arguments[1];
            if (isArrayExpressionNode(arg1)) {
                return {
                    value: arg0,
                    pipes: extractPipeElements(arg1.elements, pipeFunctionName),
                };
            }
            else {
                throw new Error(`Expected array`);
            }
        }
        else {
            throw new Error(`Expected one argument`);
        }
    }
    else {
        return null;
    }
}
export function unrollPipeNowNodeElements(elements) {
    return unrollPipes([
        elements.value,
        ...elements.pipes,
    ]);
}
export function handlePipeNowNode(node, options) {
    const elements = extractPipeNowNodeElements(node, options.pipeNowFunctionName, options.pipeFunctionName);
    if (elements) {
        replaceObjectProperties(node, unrollPipeNowNodeElements(elements));
        return true;
    }
    else {
        return false;
    }
}
/** NODE **/
export function handleNode(node, options) {
    return handlePipeNode(node, options)
        || handlePipeNowNode(node, options);
}
export function optimizeAST(ast, options) {
    full(ast, (node) => {
        // handleNode(node, options);
        while (handleNode(node, options))
            ;
    });
    return ast;
}
export function optimizeFunctional(code, options) {
    let ast;
    try {
        ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    }
    catch {
        ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
    }
    return generate(optimizeAST(ast, options));
}
