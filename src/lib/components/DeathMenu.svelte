<script lang="ts">
    import {Button, Drawer, Heading, Hr, Span} from "flowbite-svelte";
    import SkullIcon from "$lib/components/icons/SkullIcon.svelte";

    let {slots}: { slots: string[] } = $props();

    let open = $state(false);

    function kill(slot: string) {
        fetch(`/api/kill/${slot}`, {
            method: "POST",
        })
        open = false;
    }

</script>

<Button color="light" class="text-red-400 flex items-center gap-1 hover:underline hover:cursor-pointer px-2"
        onclick={() => open = !open}>
    <SkullIcon/>
    Death Menu
</Button>
<Drawer bind:open class="w-fit">
    <Heading class="mt-6">Death Menu</Heading>
    <Hr/>
    <div class="flex flex-col gap-2">
        {#each slots as slot}
        <Span class="font-xl font-bold flex justify-between items-center">{slot}
            <Button color="red" onclick={() => kill(slot)}>Send Death</Button>
        </Span>
        {/each}
    </div>
</Drawer>