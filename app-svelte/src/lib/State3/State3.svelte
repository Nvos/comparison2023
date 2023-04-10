<script lang="ts">
  import Child from "./Child.svelte";
  let array = [1];
  let value = 1;
</script>

<Child bind:value bind:array />
