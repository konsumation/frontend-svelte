<script>
  import * as style from "./main.css";
  import { Outlet, Route, Router, Link } from "svelte-guard-history-router";
  import { Menue } from "svelte-common";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Admin from "./pages/Admin.svelte";
  import Categories from "./pages/Categories.svelte";
  import Insert from "./pages/Insert.svelte";

  import { router, needsSession } from "./main.mjs";
  import { CategoriesRoute } from "./category.mjs";

  import { session } from "./util.mjs";

  function logout() {
    session.invalidate();
  }
</script>

<Router {router}>
  <nav>
    <Route href="/" path="*" component={Home}>
      <img class="logo" src="logo.svg" alt="Konsum" />
      Konsum
    </Route>
    <ul class="left">
      <li>
        <Link href="/category">
          Categories
        </Link>
      </li>
      <li>
        <Route path="/insert" factory={CategoriesRoute} guards={needsSession} component={Insert}>
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
                guards={needsSession}
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
    <Outlet/>
  </main>
</Router>
