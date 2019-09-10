<script>
  let open = false;

  function toggleOpen() {
    open = !open;
  }
</script>

<a href="#!" on:click|preventDefault={toggleOpen}>
  <slot name="title" />
  {#if open}
    <slot name="content" />
  {/if}
</a>
