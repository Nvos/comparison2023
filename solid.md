# Solid

## Ecosystem (WIP)

## State (WIP)

Reactive system using primitives offered by library itself which are de-coupled from rendering system and can be used as standalone library. Primitives are based off signals and proxies and provide clear separation between write and read by making value read-only and writes via separate function. All primitives are similar and likely based off `react` hooks but are more convinient to use due to automatic dependency tracking.

- [Introduction to fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)

In comparison to `react` dependencies of effect/memo etc. are handled automatically, when any dependency is read as part of other primitive it becomes dependency of that primitive. It is possible as well to manually decide what should be dependency using `on` function which allows to define dependencies manually.

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

### Destructuring/spread
Small pain point of solid reactivity is that it can be lost when we destructure/spread. Destructuring props is quite common operation along with spread, e.g. in `react` it is very common to do following: `{value, value1, ...rest}: Props`. This allows us to destructure specific props which we intend to use in component and spread rest of them, it is quite common way to pass props on components which wrap native elements e.g. `button`. So while this is small pain point it is one to remember as it can easily lead to bugs. Seems it would be good idea avoid destructuring props.

This is somewhat alleviated by 2 prop helper functions:
- [splitProps](https://www.solidjs.com/tutorial/props_split) - allows to split props into 2 objects, thus simulating splitting props between locally used and spread
- [defaultProps](https://www.solidjs.com/tutorial/props_defaults) - allows to provide fallback values, by merging props with defaults

### Store (WIP)

## Error handling (WIP)

## Syntax (WIP)

Very similar to `react`, but this can be misleading due to different way component definition is used. React components can be thought as functions but solid componentes are templates. This means that function is always executed only once, this vastly simplifies handling of component state and makes it more predictable but at cost of conditional logic returning different fragments. There's always single template and logic/flow is handled using components provided by library such as `For`/`Show`/`Switch`. Those flow primitives do not use any special library internals and could be written manually, but it is good idea to provide such base building blocks by default. Example of dirrence with react model:

1. React
```tsx
const Component = (props) => {
  if (props.isLoading) {
    return <div>Loading...</div>
  }

  return <div>Data</div>
}
```
2. Solid 
```tsx
const Component = (props) => {
  return <Show when={props.isLoading} fallback={<div>Loading...</div>}>
    Data
  </Show>
}
```

### Readibility (WIP)

### Styling (WIP)

### JSX/TSX (WIP)

## Typescript (WIP)

## Size (WIP)

## Performance (WIP)

## Usage

While solid appeared in 2021 it became realistically production ready in 2022 as of statistics usage is currently quite low being 6% but personally I think there are large prospects due to `react` similarity and low awarness 66% . We'll likely see growth in 2023 but prospects are still unknown as react might alleviate some of its problems thanks to project react forget which is supposed to automate some of memoization via compiler. Still solid might find its own place thanks to interesting approach to reactivity and focus on performance and predictable logic.

Due to large `react` similarity it is easy for anyone with some `react` knowledge to switch to solid. There small gotchas such as component being template and prop handling but in the end everything is nearly same as `react`. This has additional benefit of being able to recruit people with `react` knowledge as it might be hard to find people with solid knowledge due to low awarness of library and market being dominated by `react`.

- Statistics taken from https://2022.stateofjs.com/en-US/libraries/front-end-frameworks/

## Notes