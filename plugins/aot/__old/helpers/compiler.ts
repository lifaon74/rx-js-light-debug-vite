import {
  compileReactiveHTMLAsComponentTemplateFunctionOptimized, DEFAULT_CONSTANTS_TO_IMPORT,
  generateConstantsToImportForComponentTemplateFromObject, ILines, IObjectProperties, linesToString
} from '@lifaon/rx-dom';

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  // nodeAppendChild,
  // createDocumentFragment,
  // createTextNode,
  // createReactiveTextNode,
  // createElementNode,
  // setAttributeValue,
  // setReactiveProperty,
  // setReactiveClass,
  // setReactiveEventListener,
};

// export async function compile2(
//   html: string
// ): Promise<string> {
//   const templateString = `
//     <div class="input-container">
//       <input
//         #input
//         [value]="$.input.subscribe"
//         (input)="() => $.input.emit(input.value)"
//       >
//     </div>
//     <div
//       class="max-length-container"
//       [class.valid]="$.valid"
//     >
//       Length: {{ $.remaining }} / 10
//     </div>
//   `;
//
//   return compileReactiveHTMLAsComponentTemplateFunctionOptimized(
//     templateString,
//     generateConstantsToImportForComponentTemplateFromObject(CONSTANTS_TO_IMPORT),
//   );
// }


export function compile(
  html: string,
  constantsToImport?: IObjectProperties,
): Promise<string> {
  return compileReactiveHTMLAsComponentTemplateFunctionOptimized(
    html,
    constantsToImport,
  )
    .then((lines: ILines) => {
      return linesToString(lines);
    })
}

// (globalThis as any).compile = compile;
