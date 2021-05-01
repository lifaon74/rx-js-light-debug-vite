import {
  compileReactiveHTMLAsComponentTemplateFunctionOptimized, DEFAULT_CONSTANTS_TO_IMPORT,
  generateConstantsToImportForComponentTemplateFromObject
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
}

export async function helloWorldDebug() {
  const templateString = `
    <div class="input-container">
      <input
        #input
        [value]="$.input.subscribe"
        (input)="() => $.input.emit(getNodeReference('input').value)"
      >
    </div>
    <div
      class="max-length-container"
      [class.valid]="$.valid"
    >
      Length: {{ $.remaining }} / 10
    </div>
  `;

  console.log((await compileReactiveHTMLAsComponentTemplateFunctionOptimized(templateString, generateConstantsToImportForComponentTemplateFromObject(CONSTANTS_TO_IMPORT))).join('\n'));
}

