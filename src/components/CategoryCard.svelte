<script>
  import { imask } from "@imask/svelte";

  export let category;

  function accept({ detail: maskRef }) {
    category.fractionalDigits = maskRef.value;
  }
</script>

<label for="description">
  Description
  <input
    id="description"
    type="text"
    placeholder="Description"
    name="description"
    size="20"
    required
    bind:value={category.description} />
</label>
<label for="unit">
  Unit
  <input
    id="unit"
    type="text"
    placeholder="Unit"
    name="unit"
    size="20"
    required
    bind:value={category.unit} />
</label>

<label for="fractionalDigits">
  Fractional digits
  <input
    id="fractionalDigits"
    type="text"
    placeholder="Fractional Digits"
    name="fractionalDigits"
    size="20"
    required
    use:imask={{
        mask: Number,
        scale: 0,
        signed: false,
        min: 0,
        max: 5
      }}
    bind:value={category.fractionalDigits} />
</label>
