<script lang="ts">
    import ApMessageNode from "$lib/components/APMessageNode.svelte";

    let { logs } = $props()

</script>


<div>
    {#each logs as log}
        <div>
            {#each log as node}
                <ApMessageNode {node} />
            {/each}
        </div>
    {/each}
</div>