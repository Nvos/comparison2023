# Svelte
Svelte doesn't feel like UI framework but whole language, it has very small runtime but mostly focuses on compiler, it feels like you are writing javascript but in reality you are writing `svelte` not just javascript.

## Ecosystem (WIP)
Given that `svelte` had few years to grow, there's barely any good library, and most of ones which were recommended previously are abandonware. Community seems to think that it is good thing as it forces developers to implement own components instead of looking for libraries. Such thinking can be problematic as it can result in lack of high quality maintained libraries. There's no official support for eco system or any standard libraries which are recommended by community.

- Router (lacks standalone official solution)
  - https://github.com/mefechoel/svelte-navigator (javascript, last update 8 months ago)
  - https://github.com/AlexxNB/tinro (javascript, last update 2 years ago)
  - https://kit.svelte.dev/ (recommended solution, official whole framework built on top of svelte)

## Re-render
**Reactive system** depending on compiler magic, any variable which is assigned anywhere in code is turned into reactive one by compiler, which allows for easy re-renders on simple writes somewhat like proxy. Effects are handled using outdated/unused javascript syntax `$: {statement}`. Every change triggers invalidation, which results in making variable dirty and then scheduling update. After some time (batching) updates are flushed and template is re-rendered and dirty flag on variables is cleared
- Works amazingly well for low complexity but becomes problematic to reason about and manage along with complexity grow
- Possibility to pass reactive prop and bind to it allows child component to assign to reactive variable and update passed reactive state from parent. This makes it harder to reason about state as it is possible for it to be **down<->top** instead always **top -> down**. Interesting thing is that you can still write to prop but without `bind` directive nothing will happen expect child component state behaving strangely for few updates but this is expected as props should be readonly


### Unpredictable reactivity
https://github.com/sveltejs/svelte/issues/6730 (issue from 2021, likely there's more problems with reactivity)

Output from solid (m)
```jsx
const [a, setA] = createSignal(1);
const [b, setB] = createSignal(8);
const [c, setC] = createSignal(3);
const [d, setD] = createSignal(4);

createEffect(() => {
  setA(b() + c());
});

createEffect(() => {
  setD(a() * 2);
});

createEffect(() => {
  if (a() > 10) {
    console.log('resetting');
    setB(0);
    setC(0);
  }
});

createEffect(() => {
  console.log({ a:a(), b:b(), c:c(), d:d() })
});

<!-- OUTPUT -->
resetting
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```

Output from svelte
```js
let b = 8;
let a = 1;
let c = 3;
let d = 4;

$: a = b + c;
$: d = a * 2;

const reset = () => (b = c = 0);

$: if (a > 10) {
  console.log("resetting");
  reset();
}

$: console.log({ a, b, c, d });

<!-- OUTPUT -->
resetting
Object { a: 11, b: 0, c: 0, d: 22 }
```

Output from react
```jsx
const [a, setA] = useState(1);
const [b, setB] = useState(8);
const [c, setC] = useState(3);
const [d, setD] = useState(4);

useEffect(() => {
  setA(b + c);
}, [b, c]);

  useEffect(() => {
  setD(a * 2);
}, [a]);

useEffect(() => {
  if (a > 10) {
    console.log('resetting');
    setB(0);
    setC(0);
  }
}, [a]);

useEffect(() => {
  console.log({ a, b, c, d })
}, [a,b,c,d]);

Object { a: 1, b: 8, c: 3, d: 4 }
Object { a: 1, b: 8, c: 3, d: 4 }
resetting
Object { a: 11, b: 8, c: 3, d: 2 }
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```

## Composition
Each svelte file is composed by `script` (can be mulitple, can even be module if you want to export function along with svelte component which will have access to component state in global way), `html` (with templating and directives) and `css` (all styles are scoped to component, unless marked as global, standard css)
- Component format being single file can be quite annoying as it discourages creation of small components which ideally would be colocated in single file. Components should always be first class citizen in modern framework and should be easy to define and refactor. There's quite few good points from author of solid about this https://dev.to/ryansolid/why-i-m-not-a-fan-of-single-file-components-3bfl
- Children are passed by api called `slots` which allow each component to define specific places to which children will be inserted. It is possible to define multiple slots and name them to insert components into specific places. Given current api it seems not really possible to typecheck what is inserted into specific slot at most it is possible to check if slot is empty but this requires specific syntax to achieve it.
- Each component which defines slot can expose variables to children using `let` directive, and setting exposed value on default slot.
- Slot api can be problematic as you cannot conditionally pass specific slot without using default one

## Typescript
Svelte supports typescript via `<script lang="ts">` and specific ide plugins using language service to handle `.svelte` files.
- Simple typing automatically works for props exported from script
- Unable to type what can be used in slot
- Hacky and undocumented solutions to typing spread - `type $$Props` and solution to have generic component `type T = $$Generic;`. When using `type $$Props` you lose automatic props typing and have to type each prop manually. Seems like most of types which `svelte` uses are hidden and can be exposed via specific names prefixed with `$$`, most of compiler/tooling magic seems to obfuscate this and try to make it easy to use but this just makes it more annoying to use for complex cases and makes it seem more simple that it really is
- Suggestions do not work very well when typing, especially for directives or templating expressions/variables(starting with `$$`)
- Documentation completely ignores typescript

Example of generic type resolution:
```typescript
<script lang="ts">
	type T = $$Generic
	interface $$Slots {
		default: { // slot name
			item: T
			index: number
		}
	}
	export let items: T[] = []
</script>
```

Example of props typing (by default it seems to be handled automatically):
```typescript
<script lang="ts">
 type $$Props = HTMLButtonElement;
</script>
```

## Api
- Component props are defined by exporting variables from `<script>`
- Standard templating expressions such as `if`/`each`. Feels quite strange to have complex if/else if/else instead of `switch` for complex cases and single `if` for simpler cases, most of time syntax feels better
```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}

{#each expression as name}...{/each}
```
- Templating offers `directives` which can be used on props to make them reactive such as `bind` or handle events such as `on`, then there's quite few more directives for more advanced cases
- Standard life cycle hooks such as `mount`/`beforeUpdate`/`afterUpdate`/`onDestroy`, thought I don't know why complicate api by defining `update` hooks while effects exists
- `Context` - similar to `react` context but instead of having specific component, any usage of `setContext(key, value)` will make children allow to read it via `getContext` by `key`
- Baked in `transition` and `animation` in library itself
- Store - standard global state, depending on preferences there are different ways how it can be used. For example thanks to compiler magic you can prefix part of state from store e.g. `count` as `$count` to subscribe to it. Otherwise manual subscription which writes to local state is necessary.

## Size
Constantly marked as small, but point of comparison is based off runtime size which svelte doesn't have much of as it is mostly compiled code thus making point not really valid one. In reality svelte on anything larger than app containing 10-20 components will result in larger bundle size than other frameworks. Seems that stance is that this is not a problem as we can lazy load parts of code, but we can do it in any other framework so there's no benefit for anything more complex.
- Size comparison https://gist.github.com/ryansolid/71e2b160df4db33fcca2862355377983

## Performance
While `svelte` likely has more good enought performance and if it is not enought then it means that you are doing something wrong there are few interesting things. Marketing of `svelte` always points to performance and that it being `compiled` and having no virtual dom allows it to have amazing performance, funny thing is that it is outclassed by vue 3.0 in benchmarks and vue uses vritual dom thus making their main point not really valid. Additionally when comparing most popular libraries `solidjs` has best performance while react has worst. React being worst can be expected as library doesn't focus on it at all.
- Benchmarks https://krausest.github.io/js-framework-benchmark/

## Sveltekit - official starter framework (WIP)

## Notes
- Starts simple but becomes problematic as complexity of application grows. Assumption can be made that it will be great fit for small-medium apps
- https://learn.svelte.dev/tutorial/welcome-to-svelte - link to docs, there are 2 tutorials this one seems latest but on their main website it links to https://svelte.dev/tutorial/basics which seems worse?

# Solidjs
## Ecosystem
- Router
  - https://github.com/solidjs/solid-router#getting-started (typescript, official, last update 4 days ago)
  - https://github.com/solidjs/solid-start (typescript, official, official whole framework built on top of solidjs)

## Notes
- Starts hard but allows to manage complexity as application size grows. Assumption can be made that it will be greate fit for medium-large apps
- Small compiler with own core framework