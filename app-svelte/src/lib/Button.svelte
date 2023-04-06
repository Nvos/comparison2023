<script lang="ts">
  export let value: string = "";
  type $$Props = HTMLButtonElement & {
    value: string
  };
</script>

<button {...$$restProps}>
  <slot />
  {value}
</button>
