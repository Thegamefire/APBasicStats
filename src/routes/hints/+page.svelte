<script lang="ts">
  import HintTable  from "$lib/components/HintTable.svelte";
  import {onMount} from "svelte";
  import type {PublicHintRecieverMap} from '$lib/types';
  
  // fake data here \/, be sure to replace - Luniya
  let hintMap = {
  "Luniya" : {
  name : "the thing",
  sender : "the sender",
  location : "the location",
  },
  }
</script>

<div class="w-full flex flex-col items-center">
  <div class="w-6/7 md:w-4/5 rounded-xl overflow-hidden mb-6">
      <HintTable hintMap={hintMap}/>
    </div>
</div>
