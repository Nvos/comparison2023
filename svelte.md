# Svelte

Svelte doesn't feel like UI framework but whole language, it has very small runtime but mostly focuses on compiler, it feels like you are writing javascript but in reality you are writing `svelte` not just javascript.

## Ecosystem

Given that `svelte` had few years to grow, there's barely any good library, and most of ones which were recommended previously are abandonware. Community seems to think that it is good thing as it forces developers to implement own components instead of looking for libraries. Such thinking can be problematic as it can result in lack of high quality maintained libraries. There's no official support for eco system or any standard libraries which are recommended by community.

- Router
  - https://github.com/mefechoel/svelte-navigator (javascript, last update 8 months ago)
  - https://github.com/AlexxNB/tinro (javascript, last update 2 years ago)
  - https://kit.svelte.dev/ (recommended solution, official whole framework built on top of svelte)
  - https://github.com/roxiness/routify - (javascript, last update ~3 months ago)
- Unstyled accessible components (primitives to build on)
  - https://github.com/rgossiaux/svelte-headlessui (last update ~1 year ago) - Doesn't privde quite a few common components such as toast/checkbox/combobox/tooltip etc
- Component libraries
  - https://github.com/illright/attractions (last update ~1 year ago)
  - https://github.com/hperrin/svelte-material-ui (less than ~1 day ago)
  - https://github.com/themesberg/flowbite-svelte (less than ~1 day ago)
- Styling (baked in framework itself, thought it is just simple file scoped css modules)
- i18n
  - https://github.com/kaisermann/svelte-i18n (last update ~0.5 year ago) - pretty much wrapper for formatjs. Doesn't offer extraction or common i18n formats, only json

## Rendering

**Reactive system** depending on compiler magic, any variable which is assigned anywhere in code is turned into reactive one by compiler, which allows for easy re-renders on simple writes somewhat like proxy. Effects are handled using outdated/unused javascript syntax `$: {statement}`. Every change triggers invalidation, which results in making variable dirty and then scheduling update. After some time (batching) updates are flushed and template is re-rendered and dirty flag on variables is cleared

- Works amazingly well for low complexity but becomes problematic to reason about and manage along with complexity grow
- Magical `$: {statement}` only works in `.svelte` files which makes it problematic as it means extracting state logic to separate file isn't simple copy paste. It is necessary to refactor refactive statements used in `.svelte` file to use functions from `svelte/store`. Then After importing state from extracted logic prefixing variables with `$` is necessary. Take a look at example of svelte component:

### Arrays and objects

Svelte reactivity is triggered by assignments, which means that mutations on object or array will not trigger it. Interestingly mutations of object such as will work:

```typescript
const obj = {
  value: {
    value: int,
  },
};

obj.value.value = 1;

let arr = [1, 2, 3, 4];
arr[1] = 2;
```

Technically both operations above are mutations as there's no copy/write to variable directly but specific index instead. There are edge cases thought when there's reference or appending to array via `push` which will not trigger update

```typescript
const obj = {
  value: {
    value: int,
  },
};
let arr = [1, 2, 3, 4];

function increment(value) {
  value = value + 1;
}

increment(obj.value.value);
arr.push(1);
```

Thought isn't it a point of having framework being compiler to be able to easily support automatic change detection even when mutating (which it seems to do partially)?

- Relevant documentation https://svelte.dev/tutorial/updating-arrays-and-objects

### 2 way binding

2 way binding seems to be favored approach by svelte, given in multiple examples it is very simple to achieve just use `bind` directive and if needed just write to variable as easy as this. This can be problematic because both parent and child components will be able to modify this variable. This way of state synchronization should require specific consideration as while this is very convinient it can easily lead to hard to debug bugs. as instead of state always going down from `owner` to `children` it can go both ways. To avoid such problems other libraries consider state to be readonly and immutable and any change require explict operations to modify it. Example of `binding` usage:

```typescript
<script>
	let name = '';
  function handleClick() {
    name = name + name
  }
</script>

<input bind:value={name} placeholder="enter your name">
<Child bind:value{name}>
<input on:click={handleClick}>
<p>{name}</p>
```

Name is shared and modified by 3 sources:

- `handleClick`
- And change to `value` prop from `Child`, given that it is bound `Child` can freely write to it and it will apply changes
- Any change when typing in `input`

### Extracting reactive logic

It is common to extract/copy/refactor logic in component when it grows larges. Such operations should be convinient as those are very common. Svelte given special handling of anything in `.svelte` files makes it quite annoying. Lets take a look at following example of refactoring simple reative state:

```typescript
<script lang="ts">
  let a = 'a';
  let b = 'b';
  $: word = a + b + c
</script>
<div>
  {word}
</div>
```

Extracted state:

```typescript
import { writable, derived } from "svelte/store";
export function useValues() {
  let a = writable("a");
  let b = writable("b");
  let word = derived([a, b], ($values) => $values[0] + $values[1]);

  return { a, b, word };
}
```

Usage of extracted state:

```typescript
<script lang="ts">
import { useXY } from './useValues.ts'

let { a, b, word } = useXY()
</script>
<div>
  {$word}
</div>
```

It is impossible to use magical `$` in non `.svelte` files thus you canno't easily extract component logic to separate file and have to use special state management library provided by svelte `svelte/store` and then when using it remember to prefix values with `$` for **magic** to happen. Of course you could always use `svelte/store` and ignore `$` but then it seems simplicity of reactivity promoted by svelte is lost and syntax becomes worse than solutions provided by other frameworks and not only that but requires understanding of 2 different state management solutions depending on location (svelte component/standard js/ts file).

Without using magic layer of `.svelte` you could use less convinient syntax (which actually prefix `$` does internally) such as:

```typescript
let value;
const unsubscribe = word.subscribe((nextValue) => {
  value = nextValue;
});

onDestroy(unsubscribe);
```

### Unpredictable reactivity

There's few outstanding issues (e.g. from 2021) which show clear reactivity inconsitienties. There's like few more

- https://github.com/sveltejs/svelte/issues/6730
- https://github.com/sveltejs/svelte/issues/6732

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

<!-- OUTPUT -->
Object { a: 1, b: 8, c: 3, d: 4 }
Object { a: 1, b: 8, c: 3, d: 4 }
resetting
Object { a: 11, b: 8, c: 3, d: 2 }
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```

Thee is another interesting example (not very realistic one, possibly prone to infinite loops). Svelte:

```typescript
let isSmallerThan10 = true;
let count = 1;
$: if (count) {
  if (count < 10) {
    console.log("smaller", count);
    // this should trigger this reactive block again and enter the "else" but it doesn't
    count = 11;
  } else {
    console.log("larger", count);
    isSmallerThan10 = false;
  }
}
<!-- OUTPUT -->
smaller 1
```

Solid:

```typescript
const [count, setCount] = createSignal(0);
const [isSmallerThan10, setIsSmallerThan10] = createSignal(true);

createEffect(() => {
  if (count() < 10) {
    console.log("smaller", count());
    setCount(11);
  } else {
    console.log("larger", count());
    setIsSmallerThan10(false);
  }
});

<!-- OUTPUT -->
smaller 0
larger 11
```

Interestingly some proposed solutions (can take look at issues) point to `effect` apis similar to `react`/`solid`, using specific api `tick` which returns `promise` which resolves as soon as pending state is applied to dom or rewriting it in `svelte/store` which apperantely behaves differently than internal component reactivity which is not a good thing. Eitherway in any more complex case no matter solution whole simplicity is lost and there is no clear path to resolve issue.

## Error handling

Commonly UI libraries which focus on concept of components provide ways to catch errors coming from children at some boundaries, commonly such component is called `ErrorBoundary`. Svelte doesn't provide any such primitive which means that any error will completely crash whole application instead of specific part with possibility of restoration.

Reactive statements are especially propne to this as throwing error from them will result in instant crash as it will be compiled and then ran in unprotected flush by runtime.

There outstanding issue (from 2018) about error handling API - no resolution so far

- https://github.com/sveltejs/svelte/issues/1096

## Syntax

Each svelte file is composed by `script` (can be mulitple, can even be module if you want to export function along with svelte component which will have access to component state in global way), `html` (with templating and directives) and `css` (all styles are scoped to component, unless marked as global, standard css)

Component format being single file can be quite annoying as it discourages creation of small components which ideally would be colocated in single file. Components should always be first class citizen in modern framework and should be easy to define and refactor. There's quite few good points from author of solid about this https://dev.to/ryansolid/why-i-m-not-a-fan-of-single-file-components-3bfl

Given how currently popular and supported typescript is and along with it support for `tsx`/`jsx` it feels strange to use custom file format instead of depending on typescript which is nowdays widely supported and has first class tooling everywhere. While it can be convinient to have custom file format using it loses most of benefits of typescript ecosystem and requires specific tooling to connect to it and it is hard to say if this specific tooling is enough.

### Readibility

Simple components are quite readable but when there is more complexity it can be hard to understand what is where given that there is quite a lot of things which you can use which by default compiler hides but can be necessary when writting convinient to use and bit more complex components e.g.:

```svelte
<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from "svelte";

export let count: number = 0;
export let loading: boolean = false;
type $$Props = HTMLElementTagNameMap['button'] & {
    count: number;
    loading: boolean;
};

type $$Slots = {
    default: {
        count: number;
    }
    iconLeft: {
        count1: number
    }
}

onMount(() => {
    console.log('mount, e.g. fetch data')
})

onDestroy(() => {
    console.log('cleanup')
})

const dispatch = createEventDispatcher();

const handleClick = () => {
    count = count + 1;
    if (count === 3) {
        dispatch('countis3')
    }
}

$: dispatch('countchange', {count: count})
</script>

<button on:click={handleClick} {...$$restProps}>
    {#if loading}
        Loading....
    {:else}
        <slot name="iconLeft" count1={count} />
        <slot {count} />
    {/if}
</button>
```

This component has following things:

1. `$$Props` - used to type props, as all html `button` props have to be forwarded, additionally it is merged with prop types defined by component `count` and `loading`
2. `export let count` and `export let loading` exposes those properties to be used as props, given that `$$Props` is set those have to be manually typed
3. `$$Slots` - used to manually type variables exposed to slots. To access this variable in named slot there's need for specific syntax e.g. `<svelte:fragment slot="iconLeft" let:count1>...<svelte:fragment>`
4. `onMount`/`onDestroy` - standard directives
5. `handleClick` - function which increments count and calls disptch, any `dispatch` call inside `.svelte` is turned into callback prop which can be accessed via `on` directive
6. `$:` - reactivity, dispatch on `count` change
7. html template which conditionally depending on `loading` prop shows either slots or simple `Loading....` string

There could be few more things such as styles/context/directives etc. Overall while template feels somewhat ok, script feels all over the place there's no proper structure or order. Prop types are somewhat floating and internally in component `$$restProps` is not typed only when using component. There's no specific order for `html`/`script`/`style` and there can be multiple `script` sections e.g. `module` one. Any `dispatch` can be called anywhere and is turned into callbacks handler automatically and can be called via `on`

### Styling

Styling is quite limited, basically it is standard css modules scoped to file with possibility to opt out of scoping via `global`. There are pain points with such styling meaning you canno't pass styles down to children from parent and there's no support for design system - variables/variants/compound variants/responsive helpers etc. Thought it seems possible to use `vanilla-extract` with svelte but given that svelte comes with own styling it is debatable it using external library is good idea.

- There's oustanding issue to improve styling pain points https://github.com/sveltejs/svelte/issues/6972

### Slots

Component composition is handled by primitive called `slot` it can be either named or default one. This allows component to decide where to put children components. This api is somewhat problematic as you canno't conditionally render slot content instead have to render whole component.

Following code will not work

```typescript
<Parent>
  {#if user.loggedIn}
    <span slot="slot-name">text</span>
  {/if}
</Parent>
```

It has to be:

```typescript
{#if user.loggedIn}
	<Parent>
		<span slot="slot-name">text</span>
	</Parent>
{:else}
	<Parent />
{/if}
```

### Templating

It feels off to have templating expressions in `html` section given that `svelte` is component based framework (pretty much all modern ones are). It seems like quite outdated idea to have templating along with components while templating could be completely replaced by components. Assumption can be made that it is due to being based off `vue` and trying to simplify it further. Take a look at following example of templating + components vs pure components, which one do you prefer?

```typescript
{#if user.loggedIn}
  <div>Something!</div>
{/if}

{#if user.loggedIn}
  {#if user.isAdmin}
    <div>Something!</div>
  {/if}
{/if}
```

vs

```typescript
<Show when(user.loggedIn)>
  <Show when(user.isAdmin)>
    <div>Something!</div>
  </Show>
</Show>
```

Or more complex cases with multiple branches, svelte decide on `if/if else/else` syntax, but wouldn't it be better to have switch? It is quite easy to use component composition to have nice switch component. Lets compare following:

```typescript
{#if role === isAdmin}
	admin
{:else role === isRole1}
	role1
{:else role === isRole2}
	role2
  {#if features.include(somefeature)}
    Can use something!
  {/if}
{:else}
	unauthorized
{/if}
```

vs (this is solidjs example, in svelte likely fallback would have to be some component inside switch)

```typescript
<Switch fallback={<div>unauhorized</div>}>
  <Match when={role === isAdmin}>admin</Match>
  <Match when={role === isRole1}>role 1</Match>
  <Match when={role === isRole2}>
    role 2
    <Show when(features.include(somefeature))>
      Can use something!
    </Show>
  </Match>
</Switch>
```

Then there is one quite strange thing - `await` template expression. I'm not sure what is point of handling promises in template instead of as part of `script`, seems strange to include something like this as one of primitives, especially in same exact format as handling promise (await, then and catch), take a look at https://svelte.dev/tutorial/await-blocks. It seems simpler to reason when you have some sort of mini client which instead returns `loading`/`value`/`error` which is now common, solid offers good primitive for it and there are popular cross-framework libraries which allow for it https://tanstack.com/query/latest/docs/svelte/overview

## Typescript

Svelte supports typescript via `<script lang="ts">` and specific ide plugins using language service to handle `.svelte` files.

- Simple typing automatically works for props exported from script
- Hacky and undocumented solutions to typing spread - `type $$Props` and solution to have generic component `type T = $$Generic;`. When using `type $$Props` you lose automatic props typing and have to type each prop manually. Seems like most of types which `svelte` uses are hidden and can be exposed via specific names prefixed with `$$`, most of compiler/tooling magic seems to obfuscate this and try to make it easy to use but this just makes it more annoying to use for complex cases and makes it seem more simple that it really is
- Suggestions do not work very well when typing in templates, especially for directives or templating expressions/variables(starting with `$$`)
- Documentation completely ignores typescript
- When opting out of automatic typing for props via `$$Props` we lost all of the magic and need to manually add types for exported code to `$$Props`
- Callbacks are automatically exported when executing any dispatch with correct name, thought there's currently no possible way to opt out of this automatic typing like with `$$Props`
- Due to how typescript is handled there can be holes in typings e.g. `$$restProps` should have same type as `type $$Props` but it doesn't

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
<script lang="ts">type $$Props = HTMLButtonElement;</script>
```

Overall it feels strange as technically those types are unsued, and are somehow internally hidden and automatically handled but when you use them then you opt out from automatic typing and have to handle it manually. Everything seems to be handled by svelte language service.

## Size

Constantly marked as small, but point of comparison is based off runtime size which svelte doesn't have much of as it is mostly compiled code thus making point not really valid one. In reality svelte on anything larger than app containing 10-20 components will result in larger bundle size than other frameworks. Seems that stance is that this is not a problem as we can lazy load parts of code, but we can do it in any other framework so there's no benefit for anything more complex.

- Size comparison https://gist.github.com/ryansolid/71e2b160df4db33fcca2862355377983

## Performance

While `svelte` likely has more good enought performance and if it is not enought then it means that you are doing something wrong there are few interesting things. Marketing of `svelte` always points to performance and that it being `compiled` and having no virtual dom allows it to have amazing performance, funny thing is that it is outclassed by vue 3.0 in benchmarks and vue uses vritual dom thus making their main point not really valid. Additionally when comparing most popular libraries `solidjs` has best performance while react has worst. React being worst can be expected as library doesn't focus on it at all.

- Benchmarks https://krausest.github.io/js-framework-benchmark/

## Notes

- https://learn.svelte.dev/tutorial/welcome-to-svelte - link to docs, there are 2 tutorials this one seems latest but on their main website it links to https://svelte.dev/tutorial/basics which seems worse?
