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
        {$session.isValid ? $session.username : "-"}

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
        <Link href="/login">Login</Link>
      </li>
    </ul>
  </header>
  <main>
    <Outlet {router}>nothing there</Outlet>
  </main>
</div>
