**All comparisons are based off only base library doesn't include things such as `sveltekit`/`next`/`solidstart` etc**

# Solidjs

# Vue

# React

# Angular

# Svelte

Library magically hides a lot of complexity thanks to compiler, significantly simplifying syntax and usage for standard things but when when there's need to do something more complex, there's need to opt out of simplicity. Which results in worse developer experience than alternatives. In `react` or `solid` difficulty curve lowers along with learning how those work but in `svelte` it feels like difficulty curve rises the more advanced things you are attempting to do and ends up with need to learn how compiler works, learn about poorly documented internals or completely undocumented typing which is somewhat pasted on top everything and feels like it floats along instead being integral part of everything.

Personally wouldn't choose it for any larger application or anything which has focus on being robust, predictable and maintainable. Might be good fit for smaller applications with focus on data not logic or simple CRUD uis.

## Cons

- Reactivity is inconsistent, there's quite a few long outstanding issues without resolution
- Styling is very limited - basic css modules scoped to file or globals, there's no way to pass styles down to children or typing for css variables
- Typescript support is either hit or miss
- Templating (subjective, personally I think that templating is outdated concept in modern UIs and it should be component focused instead due to typescript ecosystem and composability)
- Component reactivity is different from reactivity outside. Need to use `store` outside of `svelte` components for shared/extracted state logic
- Component format being single file discourages composition and is more likely to result in large components. In component focused libraries it should be easy to refactor and split single component into multiple smaller ones especially in single file to have collocation
- No error handling primitives, base library is not very robust and any error can crash whole thing
- There's barely any ecosystem, quite a lot of it is abandonware and there are no well known libraries which are considered goto for specific things. `React` has such libraries, `angular` comes with most of them baked in, `solid` has support for many libraries as `official` similar thing with `vue`. It doesn't feel that library ecosystem is progressing
- 2 way binding being very easily supported and recommended can be large source of bugs
- Large differences with react can result in lack of people willing to work on svelte projects as market is react dominated and svelte prospects are unknown. Additionally when switching between react <-> svelte there's no much overlap due to different models

## Pros

- Very beginner friendly as long there are experienced people willing to create complex building blocks of application
- Baked in animation and transitions
- Official state management library
- Performance
- Baked in styling solution

# Interesting articles
- https://dev.to/this-is-learning/the-cost-of-consistency-in-ui-frameworks-4agi
