<script>

  export let router;

  const route = router.route;
  console.log(route)
  const entitlements = $route.value;
</script>

<h1>confirm Registration</h1>
we have send you email to 
{entitlements}