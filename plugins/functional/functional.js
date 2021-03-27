import { optimizeFunctional } from './helpers/optimize-functional';
import { DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS } from './helpers/default-optimize-optional-options.constant';
export default function optimizeFunctionalPlugin(options = DEFAULT_OPTIMIZE_OPTIONAL_OPTIONS) {
    return {
        name: 'optimize-functional',
        transform: async (src, id) => {
            if (id.endsWith('.ts')) {
                return {
                    code: optimizeFunctional(src, options),
                    map: null,
                };
            }
        }
    };
}
