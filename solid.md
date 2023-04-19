# Solid

## Ecosystem (WIP)

## State

Reactive system using primitives offered by library itself which are de-coupled from rendering system and can be used as standalone library. Primitives are based off signals and proxies and provide clear separation between write and read by making value read-only and writes via separate function. All primitives are similar and likely based off `react` hooks but are more convenient to use due to automatic dependency tracking.

- [Introduction to fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)

In comparison to `react` dependencies of effect/memo etc. are handled automatically, when any dependency is read as part of other primitive it becomes dependency of that primitive. It is possible as well to manually decide what should be dependency using `on` function which allows to define dependencies manually.

### Nested reactivity

React was first library to introduce concept of `hook` which in short is group of primitives allowing sharing and extracting component level logics without changing component hierarchy. Solid iterates on this concept and given its approach to reactivity, compiler and [synchronous executing](#synchronous-execution) allows for nesting reactive primitives and even using them as values. This functionality simplifies some patterns and allows for better collocation.

[Nested effects with timer](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/NestedReactivity1.tsx)
[Nested signal](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/NestedReactivity2.tsx)

### Synchronous execution

Implementation of reactivity allows for synchronous execution which solves main pain point of `react` hooks and allows to write more robust and predictable logic with aim to be **glitch-free**. There are quite few benefits to such idea:
- Any change only runs once
- Code always runs top-down
- Changes are executed synchronously
- Changes are executed immediately

[Example of behavior](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/State1.tsx)

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
Object { a: 0, b: 0, c: 0, d: 0 }`
```

### Destructuring, spread and defaults
Small pain point of solid reactivity is that it can be lost when we destructure/spread. Destructuring props is quite common operation along with spread, e.g. in `react` it is very common to do following: `{value, value1, ...rest}: Props`. This allows us to destructure specific props which we intend to use in component and spread rest of them, it is quite common way to pass props on components which wrap native elements e.g. `button`. So while this is small pain point it is one to remember as it can easily lead to bugs. Seems it would be good idea avoid destructuring props.

This is somewhat alleviated by 2 prop helper functions:

- [splitProps](https://www.solidjs.com/tutorial/props_split) - allows to split props into 2 objects, thus simulating splitting props between locally used and spread
- [defaultProps](https://www.solidjs.com/tutorial/props_defaults) - allows to provide fallback values, by merging props with defaults

### Batching

Batching currently is somewhat inconsistent as it automatically works in some parts such as `createEffect` or anything done in function body on mount but it doesn't work in `setTimeout`, async await and event handlers. This is due to batching being handled synchronously via wrapping, which in some cases is not possible to be achieved synchronously. For problematic parts it is necessary to wrap in `batch` function. Without batching reading synchronously changed variables can result in interesting behavior such as effects being ran directly after setting signal resulting in next read possibly being already updated by such effects.

[Batching behavior](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/Batching.tsx)
Remove `batch` wrapper from `handleValue2Click`, this results in removal of batching in event handler which results in effect which modifies it to be ran synchronously directly after first `setValue2` which results in already updated `value2` in next console log. This behavior is different when it happens during mount as automatic batching works in this case.

Batching behavior seems to be consistent when using `store` package in regard to how changes from `createSignal` are bached

Batching seems to be one of higher priorities now on road to 2.0 and there's quite a lot of discussion in regard to it.

### Store (WIP)

Solid is offers official store solution for more complex cases which require nested changes and lazy subscriptions to part of state which were requested. It is somewhat inconsistent in regard to standard `createSignal` as accessing value doesn't require getter, e.g. when using `createSignal` value has to be accessed like so: `value()` while from store just `value`. There's quite big difference in regard to performance when nesting values, as in store you can just provide path to specific element and it will lazily subscribe to it while for `createSignal` subscription is to whole `value` unless other signals are used as values which is valid option due to concept of nested reactivity.

Store comes along with convenient way to apply deeply nested changes via [powerful syntax](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/Store.tsx) for providing path to specific part which requires mutation all of which is fully typed.

Given that everything is proxied there's no possibility of accessing value of e.g. array or object directly. Direct access to value is only possible on primitive values, thought there's `unwrap` function which allows to return underlying data without proxy.

Derived values are internally supported by store, via getters which can be used as part of objects stored in store.

Store supports internally as part of state derived values via usage of [getters](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/Store1.tsx)

## Error handling (WIP)

## Syntax (WIP)

Very similar to `react`, but this can be misleading due to different way component definition is used. React components can be thought as functions but solid components are templates. This means that function is always executed only once, this vastly simplifies handling of component state and makes it more predictable but at cost of conditional logic returning different fragments. There's always single template and logic/flow is handled using components provided by library such as `For`/`Show`/`Switch`. Those flow primitives do not use any special library internals and could be written manually, but it is good idea to provide such base building blocks by default. Example of difference with react model:

1. React

```tsx
const Component = (props) => {
  if (props.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Data</div>;
};
```

2. Solid

```tsx
const Component = (props) => {
  return (
    <Show when={props.isLoading} fallback={<div>Loading...</div>}>
      Data
    </Show>
  );
};
```

### Readability (WIP)

### Styling (WIP)

### JSX/TSX (WIP)

## Typescript (WIP)

## Size (WIP)

## Performance (WIP)

## Usage

While solid appeared in 2021 it became realistically production ready in 2022 as of statistics usage is currently quite low being 6% but personally I think there are large prospects due to `react` similarity and low awareness 66% . We'll likely see growth in 2023 but prospects are still unknown as react might alleviate some of its problems thanks to project react forget which is supposed to automate some of memoization via compiler. Still solid might find its own place thanks to interesting approach to reactivity and focus on performance and predictable logic.

Due to large `react` similarity it is easy for anyone with some `react` knowledge to switch to solid. There small gotchas such as component being template and prop handling but in the end everything is nearly same as `react`. This has additional benefit of being able to recruit people with `react` knowledge as it might be hard to find people with solid knowledge due to low awareness of library and market being dominated by `react`.

- Statistics taken from https://2022.stateofjs.com/en-US/libraries/front-end-frameworks/

## Notes
