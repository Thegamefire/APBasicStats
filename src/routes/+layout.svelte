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

<div class="bg-[#faf9ff] dark:bg-zinc-900 min-h-screen flex flex-col md:h-screen md:overflow-hidden">
    <Navbar/>
    <main class="flex-1 flex flex-col items-center min-h-0">
        {@render children()}
    </main>
    <Footer/>
</div>