<script>
  let open = false;

  function toggleOpen() {
    open = !open;
  }
</script>

{#if open}
  <slot />
{:else}
  <a href="#!" on:click|preventDefault={toggleOpen}>
    <slot name="title" />
  </a>
{/if}
