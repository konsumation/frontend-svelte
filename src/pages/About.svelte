<script>
  import { About, SessionDetails, ServerDetails } from "svelte-common";
  import { server } from "../main.mjs";
  import { session } from "../util.mjs";
  import name from "consts:name";
  import version from "consts:version";
  import description from "consts:description";
</script>

<About {name} {version} {description}>
  <ServerDetails server={$server} />
  <SessionDetails session={$session} />
</About>
