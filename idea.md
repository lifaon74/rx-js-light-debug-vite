https://dropmail.me/api/#curl-fetching-received-mail

Think about :


```html
<rx-tools
  add$$
  sub$$="sub"
></rx-tools>
<div [prop]="add$$(5, sub(1, 2))"></div>
```


```html
<div
  (opened$)="observer"
></div>
```

