import { IOptimizeFunctionalOptions } from './optimize-functional';

export const DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS: IOptimizeFunctionalOptions = {
  ecmaVersion: 'latest',
  pipeFunctionName: new Set<string>(['pipeSubscribePipeFunctions', 'pipe$$$']),
  pipeNowFunctionName: new Set<string>(['pipeSubscribeFunction', 'pipe$$']),
};


