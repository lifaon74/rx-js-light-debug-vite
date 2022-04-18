// export function noCORS(url: string): string {
//   const _url: URL = new URL(`https://cors-anywhere.herokuapp.com/`);
//   _url.pathname = url;
//   return _url.href;
// }

export function noCORS(url: string): string {
  const _url: URL = new URL(`https://api.allorigins.win/get`);
  _url.searchParams.set('raw', url);
  return _url.href;
}
