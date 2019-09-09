<script>
  import { Outlet, Link } from "svelte-guard-history-router";
  import Menue from "./components/Menue.svelte";
  import { router, session } from "./main.mjs";

  function logout() {
    session.invalidate();
  }
</script>

<nav>
  <Link href="/">
    <img class="logo" src="konsum.svg" alt="Konsum" />
    Konsum
  </Link>

  <ul>
    <li>
      <Link href="/category">Categories</Link>
    </li>
    <li>
      <Link href="/insert">Insert</Link>
    </li>
    <li>
      <Link href="/about">About</Link>
    </li>
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
        <Link href="/login">Login</Link>
      {/if}
    </li>
  </ul>
</nav>
<main>
  <Outlet {router}>nothing there</Outlet>
</main>
