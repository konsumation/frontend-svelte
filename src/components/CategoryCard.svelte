<script>
  import imask from "../imask.mjs";

  let { category, valid = $bindable(false) } = $props();

  // Local $state vars so $effect can track changes reactively
  let name = $state(category.name ?? "");
  let description = $state(category.description ?? "");
  let unit = $state(category.unit ?? "");
  let fractionalDigits = $state(category.fractionalDigits ?? "");

  // Sync local state back to category — pure side effect, no valid computation
  $effect(() => {
    category.name = name;
    category.description = description;
    category.unit = unit;
    category.fractionalDigits = fractionalDigits;
  });

  // valid as separate $effect — avoids potential reactivity loop
  $effect(() => {
    valid = Boolean(
      name?.length &&
        description?.length &&
        unit?.length &&
        fractionalDigits
    );
  });

  function accept({ detail: maskRef }) {
    fractionalDigits = maskRef.value;
  }
</script>

<label for="name">
  Name
  <input
    id="name"
    type="text"
    placeholder="Name"
    size="20"
    required
    bind:value={name}
  />
</label>

<label for="description">
  Description
  <input
    id="description"
    type="text"
    placeholder="Description"
    size="20"
    required
    bind:value={description}
  />
</label>
<label for="unit">
  Unit
  <input
    id="unit"
    type="text"
    placeholder="Unit"
    size="20"
    required
    bind:value={unit}
  />
</label>

<label for="fractionalDigits">
  Fractional digits
  <input
    id="fractionalDigits"
    type="text"
    placeholder="Fractional Digits"
    size="20"
    required
    use:imask={{ mask: Number, scale: 0, signed: false, min: 0, max: 5 }}
    bind:value={fractionalDigits}
  />
</label>
