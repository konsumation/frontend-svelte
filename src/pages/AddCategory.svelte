<script>
  import { ActionButton } from "svelte-common";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";
  import { handleFailedResponse } from "../handle-failed-response.mjs";

  const category = new Category();
  let valid;
</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} bind:valid={valid}/>
  <ActionButton
    disabled={!valid}
    shortcuts="enter"
    action={() => category.save()}
    error={handleFailedResponse}>
    Save
  </ActionButton>
</form>
