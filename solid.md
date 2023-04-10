# Solid

## Ecosystem (WIP)

## State (WIP)

Reactive system using reactive primitives offered by library itself which are completely de-coupled from rendering system and can be used as standalone library. Primitives are based off signals and proxies and provide clear separation between write and read by making value read-only and writes via separate function. All primitives are similar and likely based off `react` hooks but are more convinient to use due to automatic dependency tracking.

- [Introduction to fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)

Automatic dependency tracking can initially look somewhat magical, but when looking at implementation executing signal inside some wrapper function allows those wrappers to see it and automatically subscribe to them.

### Synchronous execution

Implementation of reactivity allows for synchronous execution which solves main pain point of `react` hooks and allows to write more robus and predictable logic with aim to be **glitch-free**. There are quite few benefits to such idea:
- Any change only runs once
- Code always runs top-down
- Changes are executed **synchronously**
- Changes are executed **immediately**

[Example of behavior](https://github.com/Nvos/comparison2023/app-solid/src/State1.tsx)
1. Changes are going from top to bottom
2. Effect 1 sets `a`
3. Effect 2 already has updated value of `a` from previous effect and sets `d` using this value
4. Effect 3 already has updated `a` by effect 1, thus runs `reset` which sets `b` and `c` to 0
5. Effect 4 prints current state along with changes to `b` and `c` which were set to 0
6. Changes to `b` and `c` triggered effect 1 which in result triggered effect 2
7. Effect 4 prints current state along with new changes to `a` and `d`

Output from example:
```
resetting
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```


### Store (WIP)

## Error handling (WIP)

## Syntax (WIP)

### Readibility (WIP)

### Styling (WIP)

### JSX/TSX (WIP)

## Typescript (WIP)

## Size (WIP)

## Performance (WIP)

## Usage (WIP)

## Notes