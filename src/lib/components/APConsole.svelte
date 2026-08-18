<script lang="ts">
    import ApMessageNode from "$lib/components/APMessageNode.svelte";
    import {Card} from "flowbite-svelte";

    let {logs} = $props()

</script>


<div class="flex flex-col gap-1">
    {#each logs as log}
        <Card class="p-3 inline-block">
            {#each log as node}
                <ApMessageNode {node}/>
            {/each}
        </Card>
    {/each}
</div>