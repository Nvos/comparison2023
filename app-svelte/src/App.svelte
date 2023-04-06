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

  let something = { 
    value: {
      value: 0
    }
  }

  function increment1(value) {
    value.value.value = value.value.value + 1;
    something = value;
  }
</script>

<main>
  <!-- <Calc /> -->
  <!-- <Child on:favorite={(it) => it.detail.nextValue} bind:value /> -->
  <!-- <button on:click={increment}>increment</button> -->
  {value}

    {#if value === 3}
    <Parent>
      <div slot="slot-1">Slot 1?</div>
    </Parent>
    {/if}
  <button on:click={() => increment1(something)}>click</button>
  {something.value.value}
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
