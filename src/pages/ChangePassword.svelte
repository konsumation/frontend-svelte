<script>
  import { Modal } from "svelte-common";
  import { CommandButton, FetchCommand } from "svelte-command";
  import { session, headers } from "../util.mjs";
  import { api } from "../constants.mjs";

  let { router } = $props();

  let username = $state("");
  let password = $state("");
  let newPassword = $state("");
  let repeatedNewPassword = $state("");

  const command = new FetchCommand(
    `${api}/user/password`,
    () => {
      return {
        method: "PATCH",
        header: headers(session),
        body: JSON.stringify({
          user: username,
          password,
          new_password: newPassword
        })
      };
    },
    {
      title: "Change Password",
      shortcuts: "Enter"
    }
  );

  command.disabled =
    !password ||
    !username ||
    !newPassword ||
    newPassword !== repeatedNewPassword;
</script>

<Modal close={() => router.abort("/")}>
  <form>
    <fieldset>
      <label for="username">
        Username
        <input
          aria-label="username"
          aria-required="true"
          maxlength="75"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="username"
          id="username"
          type="text"
          placeholder="Username"
          name="username"
          required
          disabled={command.active}
          bind:value={username}
        />
      </label>
      <label for="current-password">
        Current Password
        <input
          aria-label="current password"
          aria-required="true"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="current-password"
          id="new-password"
          type="password"
          placeholder="Current Password"
          name="password"
          required
          disabled={command.active}
          bind:value={password}
        />
      </label>
    </fieldset>
    <fieldset>
      <label for="new-password">
        New Password
        <input
          aria-label="new password"
          aria-required="true"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="new-password"
          id="new-password"
          type="password"
          placeholder="New Password"
          name="new-password"
          required
          disabled={command.active}
          bind:value={newPassword}
        />
      </label>
      <label for="repeated-new-password">
        Repeat New Password
        <input
          aria-label="repeated new password"
          aria-required="true"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="repeated-new-password"
          id="repeated-new-password"
          type="password"
          placeholder="New Password"
          name="repeated-new-password"
          required
          disabled={command.active}
          bind:value={repeatedNewPassword}
        />
      </label>
    </fieldset>
    <CommandButton {command} />
  </form>
</Modal>
