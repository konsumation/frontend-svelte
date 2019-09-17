<script>
  import { Outlet, link, active } from "svelte-guard-history-router";
  import { Menue } from "svelte-common";
  import { router, session } from "./main.mjs";

  function logout() {
    session.invalidate();
  }
</script>

<nav>
  <a href="/" use:link={router} use:active={router}>
    <img class="logo" src="konsum.svg" alt="Konsum" />
    Konsum
  </a>
  <ul class="left">
    <li>
      <a href="/category" use:link={router} use:active={router}>Categories</a>
    </li>
    <li>
      <a href="/insert" use:link={router} use:active={router}>Insert</a>
    </li>
    <li>
      <a href="/about" use:link={router} use:active={router}>About</a>
    </li>
    <li>
      <a href="/admin" use:link={router} use:active={router}>Admin</a>
    </li>
  </ul>
  <ul>
    <li>
      {#if $session.isValid}
        <Menue>
          <div slot="title" class="dropdown-trigger">{$session.username}</div>
          <ul class="dropdown-content">
            <li>
              <a href="#!" on:click|preventDefault={logout}>
                Logout {$session.username}
              </a>
            </li>
          </ul>
        </Menue>
      {:else}
        <a href="/login" use:link={router} use:active={router}>Login</a>
      {/if}
    </li>
  </ul>
</nav>
<main>
  <Outlet {router} />
</main>
