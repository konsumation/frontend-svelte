<script>
  import * as style from "./main.css";
  import { Outlet, Route, Router } from "svelte-guard-history-router";
  import { Menue } from "svelte-common";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Admin from "./pages/Admin.svelte";
  import Categories from "./pages/Categories.svelte";
  import Insert from "./pages/Insert.svelte";

  import { router, needsSession, session } from "./main.mjs";

  function logout() {
    session.invalidate();
  }
</script>

<Router {router}>
  <nav>
    <Route path="/" component={Home}>
      <img class="logo" src="logo.svg" alt="Konsum" />
      Konsum
    </Route>
    <ul class="left">
      <li>
        <Route path="/category" guards={[needsSession]} component={Categories}>
          Categories
        </Route>
      </li>
      <li>
        <Route path="/insert" guards={[needsSession]} component={Insert}>
          Insert
        </Route>
      </li>
      <li>
        <Route path="/about" component={About}>About</Route>
      </li>
    </ul>
    <ul>
      <li>
        {#if $session.isValid}
          <Menue>
            <div slot="title" class="dropdown-trigger">{$session.username}</div>
            <div slot="content" class="dropdown-menu dropdown-menu-sw">
              <a
                href="/"
                class="dropdown-item"
                on:click|preventDefault={logout}>
                Logout {$session.username}
              </a>
              <div class="dropdown-divider" />
              <Route
                path="/admin"
                guards={[needsSession]}
                class="dropdown-item"
                component={Admin}>
                Admin
              </Route>
            </div>
          </Menue>
        {:else}
          <Route path="/login" component={Login}>Login</Route>
        {/if}
      </li>
    </ul>
  </nav>
  <main>
    <Outlet {router} />
  </main>
</Router>
