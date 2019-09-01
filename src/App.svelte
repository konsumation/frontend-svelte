<script>
  import { Outlet, Link } from "svelte-guard-history-router";
  import { session } from "svelte-session-manager";
  import { router } from "./main.mjs";
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
          <Link href="/login">Login</Link>
        {:else}
          <Link href="/logout">Logout {$session.username}</Link>
        {/if}
      </li>
    </ul>
  </header>
  <main>
    <Outlet {router}>nothing there</Outlet>
  </main>
</div>
