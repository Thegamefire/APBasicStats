<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.webp';
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let {children} = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
    <title>AP Basic Stats</title>
</svelte:head>

<div class="bg-[#faf9ff] dark:bg-[#16141f] min-h-screen flex flex-col">
    <Navbar/>
    {@render children()}
    <div class="grow"></div>
    <Footer />
</div>