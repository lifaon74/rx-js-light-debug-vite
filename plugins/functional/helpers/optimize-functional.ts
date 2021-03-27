import { Node, parse } from 'acorn';
import { full } from 'acorn-walk';

import {
  ArrayExpression, ArrowFunctionExpression, BaseNode, BlockStatement, CallExpression, Expression, FunctionDeclaration,
  Identifier, ReturnStatement,
} from 'estree';
// import { generate } from 'astring';
import * as astring from 'astring';
const generate = (astring.generate ?? (astring as any).default.generate) as typeof astring.generate;


/** TYPES **/

export type IEcmaVersion = 'es5' | 'latest';

export interface IOptimizeFunctionalOptions {
  ecmaVersion: IEcmaVersion; // (default: 'latest')
  pipeFunctionName: Set<string>;
  pipeNowFunctionName: Set<string>;
}


/** MISC **/

export function replaceObjectProperties<GNewObject>(
  obj: object,
  newObject: GNewObject,
): GNewObject {
  [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj)
  ].forEach((key: PropertyKey): void => {
    delete obj[key];
  });
  Object.assign(obj, newObject);
  return newObject;
}

export function createBlockStatementNode(
  params: Omit<BlockStatement, 'type'>,
): BlockStatement {
  return {
    ...params,
    type: 'BlockStatement',
  };
}

export function createReturnStatementNode(
  params: Omit<ReturnStatement, 'type'>,
): ReturnStatement {
  return {
    ...params,
    type: 'ReturnStatement',
  };
}

export function createIdentifierNode(
  params: Omit<Identifier, 'type'>,
): Identifier {
  return {
    ...params,
    type: 'Identifier',
  };
}


export function createArrowFunctionExpressionNode(
  params: Omit<ArrowFunctionExpression, 'type'>,
): ArrowFunctionExpression {
  return {
    ...params,
    type: 'ArrowFunctionExpression',
  };
}

export function createFunctionDeclarationNode(
  params: Omit<FunctionDeclaration, 'type'>,
): FunctionDeclaration {
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
  return `${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16).padStart(14, '0') }-${ Date.now().toString(16).padStart(12, '0') }`;
}

export function uuid_var() {
  return `var_${ uuid().replace('-', '_') }`;
}


/** IS NODE **/

export function isCallExpressionNode(
  node: BaseNode,
): node is CallExpression {
  return (node.type === 'CallExpression');
}

export function isIdentifierNode(
  node: BaseNode,
): node is Identifier {
  return (node.type === 'Identifier');
}

export function isArrayExpressionNode(
  node: BaseNode,
): node is ArrayExpression {
  return (node.type === 'ArrayExpression');
}

/** PIPE NODE **/

export function isPipeNode(
  node: BaseNode,
  pipeFunctionName: Set<string>,
): node is CallExpression {
  return isCallExpressionNode(node)
    && isIdentifierNode(node.callee)
    && pipeFunctionName.has(node.callee.name);
}

export type IPipeNodeElements = Expression[];


function extractPipeElements(
  elements: IPipeNodeElements,
  pipeFunctionName: Set<string>,
): IPipeNodeElements {
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

export function extractPipeNodeElements(
  node: BaseNode,
  pipeFunctionName: Set<string>,
): IPipeNodeElements | null {
  if (isPipeNode(node, pipeFunctionName)) {
    if (node.arguments.length === 1) {
      const arg0: BaseNode = node.arguments[0];
      if (isArrayExpressionNode(arg0)) {
        return extractPipeElements(arg0.elements as IPipeNodeElements, pipeFunctionName);
      } else {
        throw new Error(`Expected array`);
      }
    } else {
      throw new Error(`Expected one argument`);
    }
  } else {
    return null;
  }
}

function unrollPipes(
  pipes: IPipeNodeElements,
): CallExpression | Expression {
  if (pipes.length === 0) {
    throw new Error(`Unrolling empty pipes`);
    // return createFunctionNode(void 0, void 0, ecmaVersion);
  } else if (pipes.length === 1) {
    return pipes[0];
  } else {
    return {
      type: 'CallExpression',
      callee: pipes[pipes.length - 1],
      arguments: [
        unrollPipes(pipes.slice(0, -1)),
      ],
    } as CallExpression;
  }
}

export function unrollPipeNodeElements(
  pipes: IPipeNodeElements,
  ecmaVersion?: IEcmaVersion
): ArrowFunctionExpression | FunctionDeclaration {
  const varNode: Identifier = createIdentifierNode({ name: uuid_var() });

  const unrolled: CallExpression | Expression = unrollPipes([
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

export function handlePipeNode(
  node: BaseNode,
  options: IOptimizeFunctionalOptions,
): boolean {
  const elements: IPipeNodeElements | null = extractPipeNodeElements(node, options.pipeFunctionName);
  if (elements) {
    replaceObjectProperties(node, unrollPipeNodeElements(elements, options.ecmaVersion));
    return true;
  } else {
    return false;
  }
}

/** PIPE NOW NODE **/

export function isPipeNowNode(
  node: BaseNode,
  pipeNowFunctionName: Set<string>,
): node is CallExpression {
  return isCallExpressionNode(node)
    && isIdentifierNode(node.callee)
    && pipeNowFunctionName.has(node.callee.name);
}


export interface IPipeNowNodeElements {
  value: Expression,
  pipes: IPipeNodeElements,
}

export function extractPipeNowNodeElements(
  node: BaseNode,
  pipeNowFunctionName: Set<string>,
  pipeFunctionName: Set<string>,
): IPipeNowNodeElements | null {
  if (isPipeNowNode(node, pipeNowFunctionName)) {
    if (node.arguments.length === 2) {
      const arg0: Expression = node.arguments[0] as Expression;
      const arg1: Expression = node.arguments[1] as Expression;

      if (isArrayExpressionNode(arg1)) {
        return {
          value: arg0,
          pipes: extractPipeElements(arg1.elements as IPipeNodeElements, pipeFunctionName),
        };
      } else {
        throw new Error(`Expected array`);
      }
    } else {
      throw new Error(`Expected one argument`);
    }
  } else {
    return null;
  }
}

export function unrollPipeNowNodeElements(
  elements: IPipeNowNodeElements,
): CallExpression | BaseNode {
  return unrollPipes([
    elements.value,
    ...elements.pipes,
  ]);
}

export function handlePipeNowNode(
  node: BaseNode,
  options: IOptimizeFunctionalOptions,
): boolean {
  const elements: IPipeNowNodeElements | null = extractPipeNowNodeElements(
    node,
    options.pipeNowFunctionName,
    options.pipeFunctionName,
  );
  if (elements) {
    replaceObjectProperties(node, unrollPipeNowNodeElements(elements));
    return true;
  } else {
    return false;
  }
}

/** NODE **/

export function handleNode(
  node: BaseNode,
  options: IOptimizeFunctionalOptions,
): boolean {
  return handlePipeNode(node, options)
    || handlePipeNowNode(node, options);
}

export function optimizeAST(
  ast: Node,
  options: IOptimizeFunctionalOptions,
): Node {
  full(ast, (node: Node) => {
    // handleNode(node, options);
    while (handleNode(node, options)) ;
  });
  return ast;
}

export function optimizeFunctional(
  code: string,
  options: IOptimizeFunctionalOptions,
): string {
  let ast: Node;
  try {
    ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  } catch {
    ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
  }
  return generate(optimizeAST(ast, options));
}
