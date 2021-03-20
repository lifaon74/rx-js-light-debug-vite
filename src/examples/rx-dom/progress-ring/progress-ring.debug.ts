import {
  compileReactiveHTMLAsComponentTemplateFunctionOptimized, DEFAULT_CONSTANTS_TO_IMPORT,
  generateConstantsToImportForComponentTemplateFromObject
} from '@lifaon/rx-dom';

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
}

export async function progressRingDebug() {
  const templateString = `
    <svg
      [attr.width]="$.diameter"
      [attr.height]="$.diameter"
     >
       <circle
         stroke="red"
         fill="transparent"
         [attr.r]="$.innerRadius"
         [attr.cx]="$.radius"
         [attr.cy]="$.radius"
         [attr.stroke-width]="$.strokeWidth"
         [attr.stroke-dasharray]="$.strokeDashArray"
         [style.stroke-dashoffset]="$.strokeDashOffset"
         [attr.transform]="$.transform"
      />
    </svg>
  `;

  console.log((await compileReactiveHTMLAsComponentTemplateFunctionOptimized(templateString, generateConstantsToImportForComponentTemplateFromObject(CONSTANTS_TO_IMPORT))).join('\n'));
}

