<script>
  import { ActionButton } from "svelte-common";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";
  import { errorHandler } from "../util.mjs";

  const category = new Category({ name: "new" });
</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} />
  <ActionButton action={()=>category.save()} error={errorHandler}>Save</ActionButton>
</form>
