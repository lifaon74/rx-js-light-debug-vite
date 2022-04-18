import {
  compileReactiveHTMLAsComponentTemplate, Component, generateComponentProxyData, IComponentProxyData, OnCreate,
} from '@lirx/dom';

/** COMPONENT **/

type IData = IComponentProxyData<AppInputDemoUsingProxyComponent>

@Component({
  name: 'app-input-demo-using-proxy',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <input
        [value]="$.proxy.value.$"
        (input)="() => $.self.value = node.value"
      >
      <div>
       {{ $.proxy.value.$ }}
      </div>
   `,
  }),
})
export class AppInputDemoUsingProxyComponent extends HTMLElement implements OnCreate<IData> {
  public value: string;

  constructor() {
    super();
    this.value = '';
  }

  public onCreate(): IData {
    return generateComponentProxyData(this);
  }
}
