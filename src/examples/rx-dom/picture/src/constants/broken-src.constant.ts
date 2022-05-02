// import { singleN } from '@lirx/core';

const svg = '<svg class="svg-icon" style="width:1em;height:1em;vertical-align:middle;fill:#ddd;overflow:hidden" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M896 213.333v281.6l-128-128L597.333 537.6 426.667 366.933 256 537.6l-128-128V213.333C128 166.4 166.4 128 213.333 128h597.334C857.6 128 896 166.4 896 213.333zM768 486.4l128 128v196.267C896 857.6 857.6 896 810.667 896H213.333C166.4 896 128 857.6 128 810.667v-281.6l128 128L426.667 486.4l170.666 170.667L768 486.4z"/></svg>';

// export const BROKEN_SRC = `data:image/svg+xml,${svg}`;
// export const BROKEN_SRC = `data:image/svg+xml;utf8,${svg}`;
export const BROKEN_SRC = `data:image/svg+xml;base64,${btoa(svg)}`;

// export const BROKEN_SRC$ = singleN(BROKEN_SRC);
