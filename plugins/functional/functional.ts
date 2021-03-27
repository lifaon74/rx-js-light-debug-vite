import { IOptimizeFunctionalOptions, optimizeFunctional } from './helpers/optimize-functional';
import { DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS } from './helpers/default-optimize-optional-options.constant';

export default function optimizeFunctionalPlugin(
  options: IOptimizeFunctionalOptions = DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS,
) {
  return {
    name: 'optimize-functional',

    transform: async (src: string, id: string): Promise<any> => {
      if (id.endsWith('.ts')) {
        return {
          code: optimizeFunctional(src, options),
          map: null,
        };
      }
    }
  };
}

