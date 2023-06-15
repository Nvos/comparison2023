# Svelte

Svelte doesn't feel like UI framework but whole language, it has very small runtime but mostly focuses on compiler, it feels like you are writing javascript but in reality you are writing `svelte` not just javascript.

## Ecosystem

Given that `svelte` had few years to grow, there's barely any good library, and most of ones which were recommended previously are abandonware. Community seems to think that it is good thing as it forces developers to implement own components instead of looking for libraries. Such thinking can be problematic as it can result in lack of high quality maintained libraries. There's no official support for eco system or any standard libraries which are recommended by community.

**Active** - Library was updated in less than 3 months ago, pending issues are being resolved frequently
**Inactive** - Library was updated more than 3 months ago, has quite a bit of pending issues
**Dead** - Library was updated 1 year ago

- Router
  - https://github.com/mefechoel/svelte-navigator (inactive)
  - https://github.com/AlexxNB/tinro (inactive)
  - https://github.com/roxiness/routify - (inactive)
- Unstyled accessible components (primitives to build on)
  - https://github.com/rgossiaux/svelte-headlessui (dead) - Doesn't provide quite a few common components such as toast/checkbox/combobox/tooltip etc
  - https://github.com/chakra-ui/zag (active, supports multiple libs, svelte doc is not yet done)
- Component libraries
  - https://github.com/illright/attractions (inactive)
  - https://github.com/hperrin/svelte-material-ui (active)
  - https://github.com/themesberg/flowbite-svelte (active)
  - https://github.com/carbon-design-system/carbon-components-svelte (active)
  - https://github.com/skeletonlabs/skeleton (active)
- Styling (baked in framework itself, simple file scoped css modules/scss)
- i18n
  - https://github.com/kaisermann/svelte-i18n (inactive) - wrapper for formatjs. Doesn't offer extraction or common i18n formats, only json
- forms
  - https://github.com/chainlist/svelte-forms (inactive)
  - https://github.com/pablo-abc/felte (inactive)
  - https://github.com/noahsalvi/svelte-use-form - (active)
- devtools
  - https://github.com/sveltejs/svelte-devtools (dead)
- query
  - https://tanstack.com/query/latest/docs/svelte/overview (active)
  - https://formidable.com/open-source/urql/docs/basics/svelte/ (graphql, active)

There are no recommended libraries to use by community. In react there are goto libraries recommended by community for i18n such as `lingui` or `i18next`, forms such as `react-hook-form`, unstyled components such as `radix`.

## State

**Reactive system** depending on compiler magic, any variable which is assigned anywhere in code is turned into reactive one by compiler, which allows for easy re-renders on simple writes somewhat like proxy. Effects are handled using outdated/unused javascript syntax `$: {statement}`. Every change triggers invalidation, which results in making variable dirty and then scheduling update. After some time (batching) updates are flushed and template is re-rendered and dirty flag on variables is cleared.

Component reactivity is quite convenient as changes are applied synchronously which allows to use modified variable to be used directly after change, thought stores are exception and cannot be read synchronously

- Works amazingly well for low complexity but becomes problematic to reason about and manage along with complexity grow
- Magical `$: {statement}` only works in `.svelte` files which makes it problematic as it means extracting state logic to separate file isn't simple copy paste. It is necessary to refactor reactive statements used in `.svelte` file to use functions from `svelte/store`. Then After importing state from extracted logic prefixing variables with `$` is necessary.
- Handles granularity of updates at component level, determining dependencies at compile time to remove need for runtime subscription system (stores are exception)

### Store

Library comes in with baked in store - `svelte/store` which can be used for sharing state between components without passing it as props or on component scope. Package exposes 3 functions:

- `writable` - uses `set` and `update` to modify value and `subscribe` to listen. There's no way to synchronously read value. When using `subscribe` there's need to unsubscribe manually unless using it in svelte component in template then can prefix value with `$` which internally handles subscription
- `readable` - provides value which cannot be externally modified, similar value usage handling as in `writable
- `derived` - used to combine values from multiple or single story and optionally modify it

Store package is not compatible with `svelte` component syntax and can result in different behavior as changes on it are not batched. Take a look at [differences in usage of store and component state](https://github.com/Nvos/comparison2023/tree/master/app-svelte/src/lib/State4.svelte)

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

2 way binding seems to be favored approach by svelte, given in multiple examples it is very simple to achieve just use `bind` directive and if needed just write to variable as easy as this. This can be problematic because both parent and child components will be able to modify this variable. This way of state synchronization should require specific consideration as while this is very convenient it can easily lead to hard to debug bugs. as instead of state always going down from `owner` to `children` it can go both ways. To avoid such problems other libraries consider state to be readonly and immutable and any change require explicit operations to modify it. Example of `binding` usage:

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

It is common to extract/copy/refactor logic in component when it grows larges. Such operations should be convenient as those are very common. Svelte given special handling of anything in `.svelte` files makes it quite annoying. Lets take a look at following example of refactoring simple reactive state:

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

It is impossible to use magical `$` in non `.svelte` files thus you cannot easily extract component logic to separate file and have to use special state management library provided by svelte `svelte/store` and then when using it remember to prefix values with `$` for **magic** to happen. Of course you could always use `svelte/store` and ignore `$` but then it seems simplicity of reactivity promoted by svelte is lost and syntax becomes worse than solutions provided by other frameworks and not only that but requires understanding of 2 different state management solutions depending on location (svelte component/standard js/ts file).

Without using magic layer of `.svelte` you could use less convenient syntax (which actually prefix `$` does internally) such as:

```typescript
let value;
const unsubscribe = word.subscribe((nextValue) => {
  value = nextValue;
});

onDestroy(unsubscribe);
```

### Unpredictable reactivity

There's few outstanding issues (e.g. from 2021) which show clear reactivity inconsistencies. There's like few more

- https://github.com/sveltejs/svelte/issues/6730
- https://github.com/sveltejs/svelte/issues/6732

1. Multiple dependent effects

- [Svelte](https://github.com/Nvos/comparison2023/tree/master/app-svelte/src/lib/State1.svelte)

```javascript
resetting
Object { a: 11, b: 0, c: 0, d: 22 }
```

- [Solid](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/State1.tsx)

```javascript
resetting
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```

- [React](https://github.com/Nvos/comparison2023/tree/master/app-react/src/component/State1.tsx)

```javascript
Object { a: 1, b: 8, c: 3, d: 4 }
Object { a: 1, b: 8, c: 3, d: 4 }
resetting
Object { a: 11, b: 8, c: 3, d: 2 }
Object { a: 11, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 22 }
Object { a: 0, b: 0, c: 0, d: 0 }
```

2. Effect modifying value on which it is dependent

- [Svelte](https://github.com/Nvos/comparison2023/tree/master/app-svelte/src/lib/State2.svelte)

```javascript
smaller 1
```

- [Solid](https://github.com/Nvos/comparison2023/tree/master/app-solid/src/State2.tsx)

```javascript
smaller 0
larger 11
```

- [React](https://github.com/Nvos/comparison2023/tree/master/app-react/src/component/State2.tsx)

```javascript
smaller 0
smaller 0
larger 11
```

3. Specific reactivity case where effects are called multiple times for object/array while once for primitives

- [Svelte](https://github.com/Nvos/comparison2023/tree/master/app-svelte/src/lib/State3.svelte)

```javascript
array Array [ 1 ]
value 1
array Array [ 1 ]
```

Interestingly some proposed solutions (can take look at issues) point to `effect` apis similar to `react`/`solid`, using specific api `tick` which returns `promise` which resolves as soon as pending state is applied to dom or rewriting it in `svelte/store` which alternately behaves differently than internal component reactivity which is not a good thing. Either way in any more complex case no matter solution whole simplicity is lost and there is no clear path to resolve issue.

## Error handling

Commonly UI libraries which focus on concept of components provide ways to catch errors coming from children at some boundaries, commonly such component is called `ErrorBoundary`. Svelte doesn't provide any such primitive which means that any error will completely crash whole application instead of specific part with possibility of restoration.

Reactive statements are especially prone to this as throwing error from them will result in instant crash as it will be compiled and then ran in unprotected flush by runtime.

There outstanding issue (from 2018) about error handling API - no resolution so far

- https://github.com/sveltejs/svelte/issues/1096

## Syntax

Each svelte file is composed by `script` (can be multiple, can even be module if you want to export function along with svelte component which will have access to component state in global way), `html` (with templating and directives) and `css` (all styles are scoped to component, unless marked as global, standard css)

Component format being single file can be quite annoying as it discourages creation of small components which ideally would be collocated in single file. Components should always be first class citizen in modern framework and should be easy to define and refactor. There's quite few good points from author of solid about this https://dev.to/ryansolid/why-i-m-not-a-fan-of-single-file-components-3bfl

Given how currently popular and supported typescript is and along with it support for `tsx`/`jsx` it feels strange to use custom file format instead of depending on typescript which is nowadays widely supported and has first class tooling everywhere. While it can be convenient to have custom file format using it loses most of benefits of typescript ecosystem and requires specific tooling to connect to it and it is hard to say if this specific tooling is enough.

### Readability

Simple components are quite readable but when there is more complexity it can be hard to understand what is where given that there is quite a lot of things which you can use which by default compiler hides but can be necessary when writhing convenient to use and bit more complex components.

There is no enforced order for anything:

- Any code outside of `script`/`style` is `html` all of those can be in any order in svelte file
- When opting out of automatic typing and typing manually e.g. `$$Props` there's no enforced place where it could be, it is pretty much floating and doesn't look like it is being used
- Any component props are defined by exporting variables
- Any `dispatch` call is turned into event callback, once again there's no definition it just happens automatically no matter where `dispatch` is used

### Styling

Styling is quite limited, basically it is standard css modules scoped to file with possibility to opt out of scoping via `global`. There are pain points with such styling meaning you cannot pass styles down to children from parent and there's no support for design system - variables/variants/compound variants/responsive helpers etc. Thought it seems possible to use `vanilla-extract` with svelte but given that svelte comes with own styling it is debatable it using external library is good idea.

- There's outstanding issue to improve styling pain points https://github.com/sveltejs/svelte/issues/6972

### Lacking primitives

1. `Portal` - element allowing to render specific node in any position e.g. outside of root. While it can be implemented using `fixed`/`absolute` positioning it can be problematic due to wrapping in other elements with such positioning or `z-index` problems, which portal allows us to avoid
2. `ErrorBoundary` - element allowing to catch errors coming from children components allowing to provide fallback component on error and possibility of restoration instead of whole application crash
3. `Suspense` - element allowing to provide fallback while async action is happening, can be useful when lazy loading routes or data. While this is not as important as `1` and `2` it is quite convenient

### Slots

Component composition is handled by primitive called `slot` it can be either named or default one. This allows component to decide where to put children components. This api is somewhat problematic as you cannot conditionally render slot content instead have to render whole component.

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

Parent component can define props passed to specific slots, in case of default slot you can directly use `let` directive to access them but in case of named ones you need to wrap content of named slot in `svelte:fragment`

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
<Switch fallback={<div>unauthorized</div>}>
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
- Suggestions do not work very well when typing in templates, especially for directives, templating expressions or internal variables(starting with `$$`)
- Documentation completely ignores typescript
- When opting out of automatic typing for props via `$$Props` we lost all of the magic and need to manually add types for exported code to `$$Props`
- Callbacks are automatically exported when executing any dispatch with correct name, thought there's currently no possible way to opt out of this automatic typing like with `$$Props`
- Due to how typescript is handled there can be holes in typings e.g. `type $$Props` defines component props, but props are typed only for usage not internally, this means `$$restProps` and `$$props` are untyped

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
  import {HTMLButtonAttributes} from 'svelte/elements'; type $$Props =
  HTMLButtonAttributes;
</script>
```

Overall it feels strange as technically those types are unused, and are somehow internally hidden and automatically handled but when you use them then you opt out from automatic typing and have to handle it manually. Everything seems to be handled by svelte language service.

I have encountered some value typing problems for simple cases, such as union e.g. `let value: string | undefined = undefined;` this type for some reason was just `string` instead of union. Seems that for some reason typechecking in some cases is overridden or lost?

## Size

Constantly marked as small, but point of comparison is based off runtime size which svelte doesn't have much of as it is mostly compiled code thus making point not really valid one. In reality svelte on anything larger than app containing 10-20 components will result in larger bundle size than other frameworks. Seems that stance is that this is not a problem as we can lazy load parts of code, but we can do it in any other framework so there's no benefit for anything more complex.

- Size comparison https://gist.github.com/ryansolid/71e2b160df4db33fcca2862355377983

## Performance

While `svelte` likely has more good enoughs performance and if it is not enoughs then it means that you are doing something wrong there are few interesting things. Marketing of `svelte` always points to performance and that it being `compiled` and having no virtual dom allows it to have amazing performance, funny thing is that it is similar to vue in benchmarks and vue uses virtual dom thus making their main point not really valid.

- Benchmarks https://krausest.github.io/js-framework-benchmark/

## Usage

Svelte is now out for quite few years now, while is was released on 2019 but technically it was usable in either 2020 or 2021, later being more likely. According to statistics it didn't grow much in usage in last 2 years. Given svelte's syntax it competes with vue and somewhat angular due to templating and being somewhat easier to use alternative to vue.

Currently it can be hard to search for svelte developers due to low usage(21%). Thus it might be necessary to search for people with libraries similar to svelte such as vue(46%) or maybe even angular (49% but much more complex) which both have similar mental model and templating syntax. Though both of them are falling in usage.

- Statistics taken from https://2022.stateofjs.com/en-US/libraries/front-end-frameworks/

## Notes

- https://learn.svelte.dev/tutorial/welcome-to-svelte - link to docs, there are 2 tutorials this one seems latest but on their main website it links to https://svelte.dev/tutorial/basics which seems worse?
- https://github.com/sveltejs/svelte/issues/6730#issuecomment-923268648
- https://github.com/sveltejs/svelte/issues/4265 - https://svelte.dev/repl/b0204a06a3f24ede8850017c8b20b998?version=3.17.1 (double reactivity)
