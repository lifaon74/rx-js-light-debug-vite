import { bootstrap } from '@lifaon/rx-dom';
import { AppFileTreeComponent } from './file-tree.component';


/** BOOTSTRAP FUNCTION **/

export function fileTreeExample() {
  const component = new AppFileTreeComponent();

  bootstrap(component);

  component.items = [
    {
      name: 'File #1',
      children: [
        {
          name: 'File #1.1',
          children: [],
        },
        {
          name: 'File #1.2',
          children: [
            {
              name: 'File #1.2.1',
              children: [],
            },
            {
              name: 'File #1.2.2',
              children: [],
            },
          ],
        },
        {
          name: 'File #1.3',
          children: [],
        },
      ],
    },
  ];
}
