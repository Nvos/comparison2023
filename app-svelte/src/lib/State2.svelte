<script lang="ts">
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
</script>

<div>Component reactivity</div>
<div>count: {count}</div>
<div>isSmallerThan10: {isSmallerThan10}</div>
