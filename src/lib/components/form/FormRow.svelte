<script lang="ts">
  import Label from '$components/ui/label/label.svelte';

  export let id: string;
  export let label: string;
</script>

<div class="col-span-full">
  <div class="flex items-center justify-between">
    <Label for={id}>{label}</Label>

    <slot name="rightLabel" />
  </div>
  <div class="mt-2">
    <slot name="input" />
  </div>
</div>
