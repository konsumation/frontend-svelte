<script>

  export let router;

  const route = router.route;
  console.log(route.value)
  const entitlements = $route.value;
</script>

<h1>confirm</h1>
please confirm
{entitlements}