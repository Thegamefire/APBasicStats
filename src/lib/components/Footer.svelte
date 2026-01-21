<script lang="ts">
    import { PUBLIC_APP_VERSION } from '$env/static/public';
    import SvelteIcon from '$lib/assets/svelte.svg';
</script>

<div class="w-full flex flex-row px-6 mb-3">
    <a href="https://github.com/Thegamefire/APBasicStats" class="hover:underline">
        <img class="inline size-4" src={SvelteIcon} alt="Svelte" />
        v{PUBLIC_APP_VERSION}
    </a>
</div>