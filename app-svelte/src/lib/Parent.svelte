<script lang="ts">
  let exposed: string = "exposed-LOL";
</script>

<div>
  <div>
    default
    <slot {exposed} />
  </div>

  <div>
    slot 1
    <slot name="slot-1" />
  </div>
</div>
