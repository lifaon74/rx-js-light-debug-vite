// import { ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router } from '@angular/router';
// import { NavigationHistory, NavigationHistoryState } from './NavigationHistory';
// import { PropertyCallInterceptorSubscription } from '@app/snippets';
// import { Subscription } from 'rxjs';
//
//
// export class NgHistoryState extends NavigationHistoryState {
//   protected _route: ActivatedRouteSnapshot;
//
//   constructor(url: URL, route: ActivatedRouteSnapshot) {
//     super(url);
//     this.route = route;
//   }
//
//   get route(): ActivatedRouteSnapshot {
//     return this._route;
//   }
//
//   set route(input: ActivatedRouteSnapshot) {
//     if (input instanceof ActivatedRouteSnapshot) {
//       this._route = input;
//     } else {
//       throw new TypeError(`Expected ActivatedRouteSnapshot as input`);
//     }
//   }
// }
//
// export class NgHistory extends NavigationHistory<NgHistoryState> {
//
//   protected _routerEventsSubscription: Subscription;
//   protected _interceptedEvents: string[];
//   protected _lastActivatedRoute: ActivatedRouteSnapshot | null;
//
//
//   constructor(public router: Router) {
//     super();
//
//     this._interceptedEvents = [];
//     this._lastActivatedRoute = null;
//
//     this._routerEventsSubscription = this.router.events.subscribe((event: any) => {
//       if (event instanceof ActivationEnd) {
//         this._lastActivatedRoute = event.snapshot;
//       } else if (event instanceof NavigationEnd) {
//
//         let interceptedEvent: string;
//         if (this._interceptedEvents.length === 0) {
//           if (this._index === -1) { // first call
//             interceptedEvent = 'push';
//           } else {
//             console.error(`Unexpected state: nothing intercepted`);
//             return;
//           }
//         } else if(this._interceptedEvents.length === 1) {
//           interceptedEvent = this._interceptedEvents.pop();
//         } else if ((this._interceptedEvents[0] === 'back') || (this._interceptedEvents[0] === 'forward')) {
//           interceptedEvent = this._interceptedEvents[0];
//           this._interceptedEvents = [];
//         } else {
//           console.error(`Unexpected state: ${this._interceptedEvents}`);
//           this._interceptedEvents = [];
//           return;
//         }
//
//
//         const url: URL = new URL(event.urlAfterRedirects || event.url, window.location.origin);
//         const state: NgHistoryState = new NgHistoryState(url, this._lastActivatedRoute);
//
//         switch (interceptedEvent) {
//           case 'push':
//             this._onPush(state);
//             break;
//           case 'replace':
//             this._onReplace(state);
//             break;
//           case 'back':
//             this._onBack(state);
//             break;
//           case 'forward':
//             this._onForward(state);
//             break;
//           default:
//             throw new TypeError(`Invalid interceptedEvent name ${interceptedEvent}`);
//         }
//
//         this._updateNativeHistoryLastLength();
//       }
//     });
//   }
//
//
//   destroy(): void {
//     this._routerEventsSubscription.unsubscribe();
//
//     return super.destroy();
//   }
//
//   protected setUpInterceptors(): Promise<void> {
//     this._interceptors = {
//
//       push: new PropertyCallInterceptorSubscription(this._nativeHistory, 'pushState',
//         (args: any[], target: History, native: any) => {
//           this._interceptedEvents.push('push');
//           return native.apply(target, args);
//         }),
//
//       replace: new PropertyCallInterceptorSubscription(this._nativeHistory, 'replaceState',
//         (args: any[], target: History, native: any) => {
//           this._interceptedEvents.push('replace');
//           return native.apply(target, args);
//         }),
//
//       back: new PropertyCallInterceptorSubscription(this._nativeHistory, 'back',
//         (args: any[], target: History, native: any) => {
//           this._interceptedEvents.push('back');
//           return native.apply(target, args);
//         }),
//
//       forward: new PropertyCallInterceptorSubscription(this._nativeHistory, 'forward',
//         (args: any[], target: History, native: any) => {
//           this._interceptedEvents.push('forward');
//           return native.apply(target, args);
//         }),
//     };
//
//     return Promise.all(
//       Object.values<PropertyCallInterceptorSubscription<History>>(this._interceptors)
//         .map(_ => _.subscribe())
//     ).then(() => {});
//   }
// }
