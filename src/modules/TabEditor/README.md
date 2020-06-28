# Data structure

```
E|-2-1
B|-0--
G|----
D|----
A|---3
E|----

E|-9-------
B|-0h3-----
G|---------
D|-------22
A|---------
E|-----1---
```

```js
const tablatures = {
  1: {
    notes: [
      //
      [2, 0, null, null, null, null],
      [null, null, null, null, null],
      [1, null, null, null, 3, null],
    ],
  },
  2: {
    notes: [
      //
      [9, 0, null, null, null, null],
      [null, 'h', null, null, null],
      [null, 3, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, null],
      [null, null, null, 22, null, null],
    ],
  },
};
```
