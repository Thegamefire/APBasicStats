<script lang="ts">
  import HintTable  from "$lib/components/HintTable.svelte";
  import type {GeneralData} from "$lib/server/tracker";
  import {onMount} from "svelte";
  import {source} from "sveltekit-sse";

  let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

  onMount(() => {
      const trackerSource = source("/api/tracker").select("message");

      trackerSource.subscribe((message: string) => {
          tracker = JSON.parse(message);
      })
  });

</script>

<div class="w-full flex flex-col items-center">
  <div class="w-6/7 md:w-4/5 rounded-xl overflow-hidden mb-6">
      <HintTable hints={tracker.hints}/>
    </div>
</div>
