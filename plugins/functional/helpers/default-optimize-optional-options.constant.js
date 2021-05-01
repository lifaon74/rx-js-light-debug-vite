export const DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS = {
    ecmaVersion: 'latest',
    pipeFunctionName: new Set(['pipeSubscribePipeFunctions', 'pipe$$$']),
    pipeNowFunctionName: new Set(['pipeSubscribeFunction', 'pipe$$']),
};
