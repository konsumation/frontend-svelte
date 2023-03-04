<script>
  import {
    useForm,
    Hint,
    HintGroup,
    validators,
    required,
    minLength,
    email,
  } from "svelte-use-form";
  import { Modal } from "svelte-common";
  import { session } from "../util.mjs";
  import { api } from "../constants.mjs";
  export let router;
  const endpoint = api + "/register";
  const defaultTokenMap = Object.fromEntries(
  ["access_token", "refresh_token"].map(k => [k, k])
);
  const form = useForm();
  const requiredMessage = "This field is required";
  let message;
  function passwordMatch(value, form) {
    if (value !== form.values.password) {
      return { passwordMatch: true };
    }
  }

  function containNumbers(numbers) {
    return function (value) {
      if (value.replace(/[^0-9]/g, "").length < numbers) {
        return { containNumbers: numbers };
      }
    };
  }

  async function register() {
    const email = $form.values.email;
    const name = $form.values.name;
    const password = $form.values.password;
    //console.log(email, name, password);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          message = data.error;
          return false;
        }
        if (!data.access_token) {
          message = "missing access_token";
          return false;
        }
        session.update({
          endpoint,
          email,
          ...Object.fromEntries(
            Object.entries(defaultTokenMap).map(([k1, k2]) => [k1, data[k2]])
          ),
        });
        await router.continue("/confirmRegistration")
      } else {
        session.update({ email });
        return handleFailedResponse(response);
      }
    } catch (e) {
      console.log("catched error", e);
      session.update({ email });
      throw e;
    }
  }
</script>

<Modal close={() => router.abort("/")}>
  <slot name="inputs">
    <form use:form>
      <h1>Registration</h1>
      <label for="email">Email</label>
      <input type="email" name="email" use:validators={[required, email]} />
      <HintGroup for="email">
        <Hint on="required">{requiredMessage}</Hint>
        <Hint on="email" hideWhenRequired>This must be a valid email</Hint>
      </HintGroup>

      <label for="name">Name</label>
      <input type="text" name="name" />

      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        use:validators={[required, minLength(5), containNumbers(2)]}
      />
      <HintGroup for="password">
        <Hint on="required">{requiredMessage}</Hint>
        <Hint on="minLength" hideWhenRequired let:value
          >This field must have at least {value} characters.</Hint
        >
        <Hint on="containNumbers" hideWhen="minLength" let:value>
          This field must contain at least {value} numbers.
        </Hint>
      </HintGroup>

      <label for="passwordConfirmation">Password Confirmation</label>
      <input
        type="password"
        name="passwordConfirmation"
        use:validators={[required, passwordMatch]}
      />
      <HintGroup for="passwordConfirmation">
        <Hint on="required">{requiredMessage}</Hint>
        <Hint on="passwordMatch" hideWhenRequired>Passwords do not match</Hint>
      </HintGroup><br />

      {#if message}
        <div class="error" id="message">{message}</div>
      {/if}

      <button disabled={!$form.valid} on:click|preventDefault={register}>
        Submit
      </button>
    </form>
  </slot>
</Modal>

<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }
</style>
