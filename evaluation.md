**All comparisons are based off only base library doesn't include things such as `sveltekit`/`next`/`solidstart` etc**

1. All comparisons are based oof only base library, official frameworks offered by them are not part of it
2. All comparisons are only client side SPA relevant

# Solidjs

Library offers innovative implementation of synchronous reactivity coupled with minimal compiler which feels like direct successor to ideas from `react` while resolving most of issues which came with its model at cost of handling functions as templates instead of code to be re-executed on every change.

Learning curve by itself could be somewhat high when starting without any `jsx` and `hook` knowledge. After understanding those concepts it is quite easy to use even for complex cases as library comes along with loads of primitives to handle them. Quite a bit of `solid` knowledge is shared with `react` which is very good thing as `react` has largest market

## Usage
- Logic focused applications, with a lot of state
- Long term projects
- High performance requirements
- Realtime data

## Pros
- Performance
- Similar to react (quite a lot of `react` knowledge is applicable to `solid`)
- Synchronous reactivity allows to write more predictable and robust logic
- Official state management library
- Single directional data flow
- Clear separation between read and write operations
- First class typescript support
- Separation between template (handled by compiler) and reactivity (handler by runtime via `solid-js`), ensures that logic wont be affected by compiler 
  
## Cons
- Batching is at times not consistent
- Slight differences in how data is read from `store` and `createSignal`
- Store returns proxy instead of accessor which can be problematic as passing reactive state as component props has to be handled with care
- Destructuring and spreading props can be source of bugs
- Small community (there's noticeable growth in 2022/2023)
- Poor library ecosystem (there's noticeable growth in regard to ecosystem in 2022/2023 and important things are officially supported)
- There can be breaking changes as library is rapidly evolving, possibly can stabilize in version 2.0
- Documentation is lacking (there's ongoing effort in regard to improved documentation https://docs.solidjs.com/)

# Vue

# React

# Angular

# Svelte

Library magically hides a lot of complexity thanks to compiler, significantly simplifying syntax and usage for standard things but when when there's need to do something more complex, there's need to opt out of simplicity. Which results in worse developer experience than alternatives. In `react` or `solid` difficulty curve lowers along with learning how those work but in `svelte` it feels like difficulty curve rises the more advanced things you are attempting to do and ends up with need to learn how compiler works, learn about poorly documented internals or completely undocumented typing which is somewhat pasted on top everything and feels like it floats along instead being integral part of everything.

## Usage
- Smaller applications with tight timelines
- Static websites
- CRUD
- High performance requirements
- Realtime data

## Pros

- Very beginner friendly
- Animation and transitions as part of library
- Performance
- Styling solution as part of library
- Store as part of library

## Cons

- Reactivity is inconsistent, there's quite a few long outstanding issues without resolution
- Styling is very limited - basic css modules scoped to file or globals, there's no way to pass styles down to children or typing for css variables
- Typescript support is either hit or miss
- Templating (subjective, personally I think that templating is outdated concept in modern UIs and it should be component focused instead due to typescript ecosystem and composability)
- Component reactivity is different from reactivity outside. Need to use `store` outside of `svelte` components for shared/extracted state logic
- Component format being single file discourages composition and is more likely to result in large components. In component focused libraries it should be easy to refactor and split single component into multiple smaller ones especially in single file to have collocation
- No error handling primitives, base library is not very robust and any error can crash whole thing
- There's barely any ecosystem, quite a lot of it is abandonware and there are no well known libraries which are considered goto for specific things. `React` has such libraries, `angular` comes with most of them baked in, `solid` has support for many libraries as official similar thing with `vue`. It doesn't feel that library ecosystem is progressing
- 2 way binding being very easily supported and recommended can be large source of bugs
- Large differences with react can result in lack of people willing to work on svelte projects as market is react dominated and svelte prospects are unknown. Additionally when switching between react <-> svelte there's no much overlap due to different models
- Poor documentation, there's not much effort to improve on it

# Opinionated
## JSX vs templating engine
Libraries which nowdays use templating engine solutions instead of JSX are outdated and should be avoided. People glorify them for separation of concern and that it is just simple HTML which for most cases is delusion as there are always templating engine specific logic/flow expressions, custom directives and possibly other things present in scope and all of them are different for each framework. By using JSX by default you get:
- Good typescript support, no need for any custom language server or IDE specific tooling
- Simpler mental model
- Component being first class citizen, easy to create small ones, logic/flow can be just a component
- Possibility of using javascript instead of custom framework specific solutions
- Composability
- Templates are functions thus any errors are regular javascript exceptions
- Simple scoping rules

It was shown by solid and react that JSX can be used in different ways, e.g.
- React uses JSX as is, template is converted to function calls which are called on each change
- Solid uses JSX as a definiton for a compiler, to achieve high performance and fine grained changes

## Styling and systems
Nowdays CSS or its extensions such as SCSS or framework specific solutions are not that convinient to work with due to heavy focus on design systems which often require:
- Theme
- Dynamic styling
- Component variants (e.g. button - ghost/solid/outline)
- Scoping
- Standardization

ALl of above are solved by modern css-in-js solutions, with nearly zero performance cost and great DX benefits:
- Typesafety
- Automatic scoping  (build step)
- Standardization via system tokens (tokens can be same in design and implementation, ideally exported from design)
- Generate static CSS at build time
- Component variants
- Compound variants - apply styles given combination of variants (e.g. button ghost + colorScheme)
- Composition
- Theme

Current best example of cross framework css-in-js solution is [vanilla-extract](https://vanilla-extract.style/)

## Component frameworks
We are moving away from standard component frameworks which include large amounts of styled opinionated components to unstyled primitives offering mostly logic, accessibility and user experience features such as focus management and shortcuts. 

Such primitive component libraries provide building blocks of specific components which can be styled and composed according to specific needs e.g. `Dialog` consists commonly of following parts - Root, Trigger, Portal, Overlay, Content, Close, Title and Description. Using those `Dialog` parts we can create `AlertDialog`, `Modal` or even `Drawer` all according to our needs without fighting library predefined styles

Good examples of such libraries are:
- [Kobalte](https://kobalte.dev/docs/core/overview/introduction) - Solid
- [Ark UI](https://ark-ui.com/) - React/Vue/Solid with Svelte on roadmap but currently not possible due to Svelte's limitations
- [Radix](https://www.radix-ui.com/) - React

## I18n (WIP)

# Future
- Fine grained reactivity (angular adding new state api using signal concept)
- Compiler optimizations
- Developer experience focus
- Even better Typescript support
- Tools written in Go/Rust e.g. `swc` and `esbuild`
- Signals - popularized by solid, `preact` and `angular` made decision to switch their state handling, other libraries might follow
- Focus on server side related solutions such as server components, island  and streaming
- Focus on frameworks built on top of base libraries: nextjs, sveltekit, solid start, astro

# Interesting articles
- https://dev.to/this-is-learning/the-cost-of-consistency-in-ui-frameworks-4agi
- https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4