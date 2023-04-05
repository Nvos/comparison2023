<script lang="ts">
  export let wtf: string = "";
  type $$Props = HTMLButtonElement;
</script>

<button {...$$restProps}>
  <slot />
  {wtf}
</button>
