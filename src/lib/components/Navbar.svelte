<script>
    import AudioBar from "$lib/components/AudioBar.svelte";
    import {page} from "$app/state";
</script>

<div class="w-screen h-16 mb-6 md:mb-12 flex flex-row shrink-0 items-center bg-violet-400 justify-between px-3">
    <a class="font-black text-white text-4xl" href="/">
        AP Basic Stats
    </a>
    {#if page.url.pathname === "/"}
        <AudioBar/>
    {/if}
</div>
