<script lang="ts">
    import {Button} from "flowbite-svelte";
    import AudioIcon from "$lib/components/icons/AudioIcon.svelte";

    import {audioManager} from '$lib/audioManager';

    let volume = $state(70);


    $effect(() => audioManager.setVolume(volume));
</script>


<span class="flex items-center gap-2">
    <span class="flex items-center w-32">
        <input class="bg-zinc-200" style="appearance: auto" type="range" bind:value={volume} min="0" max="100"/>
    </span>
    <Button color="light" class="p-2" onclick={() => volume === 0? volume = 70: volume = 0}>
        <AudioIcon class="size-5" on={volume === 0}/>
    </Button>
</span>

<style>
    input[type=range] {
        width: 100%;
        margin: 6.25px 0;
        background-color: transparent;
        -webkit-appearance: none;
        appearance: none;
    }

    input[type=range]:focus {
        outline: none;
    }

    input[type=range]::-webkit-slider-runnable-track {
        background: #ffffff;
        border: 0;
        border-radius: 6.2px;
        width: 100%;
        height: 12.5px;
        cursor: pointer;
    }

    input[type=range]::-webkit-slider-thumb {
        margin-top: -6.25px;
        width: 25px;
        height: 25px;
        background: #ffffff;
        border-radius: 50px;
        cursor: pointer;
        -webkit-appearance: none;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
        background: #ffffff;
    }

    input[type=range]::-moz-range-track {
        background: #ffffff;
        border: 0;
        border-radius: 6px;
        width: 100%;
        height: 13px;
        cursor: pointer;
    }

    input[type=range]::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #ffffff;
        border-radius: 50px;
        cursor: pointer;
    }

    input[type=range]::-ms-track {
        background: transparent;
        border-color: transparent;
        border-width: 6.25px 0;
        color: transparent;
        width: 100%;
        height: 12.5px;
        cursor: pointer;
    }

    input[type=range]::-ms-fill-lower {
        background: #f2f2f2;
        border: 0;
        border-radius: 12.4px;
    }

    input[type=range]::-ms-fill-upper {
        background: #ffffff;
        border: 0;
        border-radius: 12.4px;
    }

    input[type=range]::-ms-thumb {
        width: 25px;
        height: 25px;
        background: #ffffff;
        border-radius: 50px;
        cursor: pointer;
        margin-top: 0;
        /*Needed to keep the Edge thumb centred*/
    }

    input[type=range]:focus::-ms-fill-lower {
        background: #ffffff;
    }

    input[type=range]:focus::-ms-fill-upper {
        background: #ffffff;
    }

</style>