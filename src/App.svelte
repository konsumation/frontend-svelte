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
    <h2>Konsum</h2>
  </Link>

  <ul>
    <li>
      <Link href="/category">
        <h3>Categories</h3>
      </Link>
    </li>
    <li>
      <Link href="/insert">
        <h3>Insert</h3>
      </Link>
    </li>
    <li>
      <Link href="/about">
        <h3>About</h3>
      </Link>
    </li>
    <li>
      {#if $session.isValid}
        <Menue>
          <h3 slot="title" class="dropdown-trigger">{$session.username}</h3>
          <ul class="dropdown-content">
            <li>
              <a href="#!" on:click|preventDefault={logout}>
                Logout {$session.username}
              </a>
            </li>
          </ul>
        </Menue>
      {:else}
        <Link href="/login">
          <h3>Login</h3>
        </Link>
      {/if}
    </li>
  </ul>
</nav>
<main>
  <Outlet {router}>nothing there</Outlet>
</main>
