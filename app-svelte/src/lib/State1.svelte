<script lang="ts">
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
</script>
