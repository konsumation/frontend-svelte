<script>
  import * as style from "./main.css";
  import {
    Outlet,
    Route,
    IteratorStoreRoute,
    ChildStoreRoute,
    Router,
    redirectGuard
  } from "svelte-guard-history-router";
  import { Menue, TopNav } from "svelte-common";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Admin from "./pages/Admin.svelte";
  import CategoriesPage from "./pages/Categories.svelte";
  import CategoryPage from "./pages/Category.svelte";
  import Insert from "./pages/Insert.svelte";
  import CategoryValueList from "./pages/CategoryValueList.svelte";
  import CategoryGraph from "./pages/CategoryGraph.svelte";
  import CategoryLink from "./components/CategoryLink.svelte";
  import base from "consts:base";
  import { Category, categoryIterator, valueIterator } from "./category.mjs";
  import { session } from "./util.mjs";

  const enshureSession = redirectGuard("/login", () => !session.isValid);
</script>

<Router {base}>
  <TopNav offset={42}>
    <Route href="/" path="*" component={Home}>
      <img class="logo" src="images/logo.svg" alt="Konsum" />
      Konsum
    </Route>
    <ul class="left">
      <li>
        <Route
          path="/category"
          factory={IteratorStoreRoute}
          iteratorFor={categoryIterator}
          guards={enshureSession}
          component={CategoriesPage}>
          Categories
          <Route
            path="/:category"
            objectInstance={Category}
            propertyMapping={{ category: 'name' }}
            factory={ChildStoreRoute}
            linkComponent={CategoryLink}
            component={CategoryPage}>
            <Route path="/values" iteratorFor={valueIterator}>
              <Route
                path="/list"
                factory={IteratorStoreRoute}
                component={CategoryValueList} />
              <Route
                path="/graph"
                factory={IteratorStoreRoute}
                component={CategoryGraph} />
            </Route>
          </Route>
        </Route>
      </li>
      <li>
        <Route
          path="/insert"
          factory={IteratorStoreRoute}
          iteratorFor={categoryIterator}
          guards={enshureSession}
          component={Insert}>
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
                on:click|preventDefault={() => session.invalidate()}>
                Logout
                {$session.username}
              </a>
              <div class="dropdown-divider" />
              <Route
                path="/admin"
                guards={enshureSession}
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
  </TopNav>
  <main>
    <Outlet />
  </main>
</Router>
