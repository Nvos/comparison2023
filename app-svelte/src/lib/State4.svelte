<script lang="ts">
  import { writable } from "svelte/store";
  import { onDestroy } from "svelte";

  let componentValue = 0;
  let storeValue = writable(0);
  const handleStoreClick = () => {
    storeValue.update((prev) => prev + 1);
    // Unable to access store value synchronously, requires subscribe
  };

  const handleComponentClick = () => {
    componentValue = componentValue + 1;
    console.log("component click", componentValue);
  };

  $: console.log("component effect", componentValue);

  const unsubscribe = storeValue.subscribe((value) => {
    console.log("store effect", value);
  });

  onDestroy(() => unsubscribe());
</script>

<div>
  <button on:click={handleStoreClick}>Click store</button>
  <button on:click={handleComponentClick}>Click component</button>
  <div>component: {componentValue}</div>
  <div>store: {$storeValue}</div>
</div>
