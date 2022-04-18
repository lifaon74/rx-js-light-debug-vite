import { fromEventTarget, map$$ } from '@lirx/core';


export function rxJSLightPerformancesExample2() {
  const subscribe = map$$<MouseEvent, [number, number]>(
    fromEventTarget<'click', MouseEvent>(window, 'click'),
    (event: MouseEvent) => [event.clientY, event.clientX] as [number, number],
  );

  subscribe((position) => {
    console.log(position);
  });
}

/*
var e,n,i;(i=window,n=e=>((e,n,i,o)=>(e.addEventListener(n,i,o),()=>{e.removeEventListener(n,i,o)}))(i,"click",e,void 0),((e,n)=>i=>e(n(i)))(n,(e=e=>[e.clientY,e.clientX],n=>((e,n)=>i=>{e(n(i))})(n,e))))((e=>{console.log(e)}));
// only 228 bytes
 */
