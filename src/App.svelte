<script>
  import { Outlet, Link } from "svelte-guard-history-router";
  import Menue from "./components/Menue.svelte";
  import { router, session } from "./main.mjs";

  function logout() {
    session.invalidate();
  }
</script>

<div class="wrapper">
  <header id="topnav">
    <Link href="/">
      <img class="logo" src="konsum.svg" alt="Konsum" />
      <h2>Konsum</h2>
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
            <div slot="title">{$session.username}</div>
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
  </header>
  <main>
    <Outlet {router}>nothing there</Outlet>
  </main>
</div>
