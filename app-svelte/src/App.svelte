<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import Calc from "./lib/Calc.svelte";
  import Child from "./lib/Child.svelte";
  import Parent from "./lib/Parent.svelte";
  import Button from "./lib/Button.svelte";
  import { getContext } from "svelte";
  let value = 0;

  function increment() {
    value++;
  }
</script>

<main>
  <!-- <Calc /> -->
  <Child on:favorite={(it) => it.detail.nextValue} bind:value />
  <button on:click={increment}>increment</button>
  {value}
  <Parent let:exposed={value}>
    <div>Default? {value}</div>
    <div slot="slot-1">Slot 1?</div>
  </Parent>

  <!-- <Parent let:exposed={wtf}>
    {#if value === 0}
      <div slot="slot-1">Default? {value}</div>
    {/if}
  </Parent> -->
  <Button wtf="??">omega</Button>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
