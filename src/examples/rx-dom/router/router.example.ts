import { bootstrap, getDocumentBody } from '@lifaon/rx-dom';
// import { APP_ROUTES } from './example/routes';
// import { AppMainComponent } from './example/main.component';
import { createRXRouter } from '@lifaon/rx-router';
import { APP_ROUTES } from './example/routes';
import { AppMainComponent } from './example/main.component';


/*----*/


async function routerExample1() {
  // the router is around:  8.50 KiB / gzip: 3.59 KiB
  const router = createRXRouter({
    routes: APP_ROUTES,
    // routes: [],
    routerOutletElement: getDocumentBody(),
  });

  router.error$(_ => console.error(_));
  router.state$(_ => console.log(_));
}

async function routerExample2() {
  bootstrap(new AppMainComponent());
}

/*-----------------*/


export async function routerExample() {
  // await routerExample1();
  await routerExample2();
}

