<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{ favorite: { nextValue: number } }>();
  export let value: number;
  // $: value = value + 1;

  const favorite = () => {
    value = value + 1;
    //Dispatch the favorite event with object data
    dispatch("favorite", { nextValue: value });
  };
</script>

<button on:click={() => favorite()}>favorite</button>
