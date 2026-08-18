<script lang="ts">
    // iconify ph:speaker-simple-high-fill
    // iconify ph:speaker-simple-x-fill


    let props = $props();

    const viewBox = '0 0 256 256';
    const content = $derived(!(props.on) ?
        `<path fill="currentColor" d="M168 32v192a8 8 0 0 1-12.91 6.31L85.25 176H40a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h45.25l69.84-54.31A8 8 0 0 1 168 32m32 64a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8m32-16a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8"/>`
        : `<path fill="currentColor" d="M163.52 24.81a8 8 0 0 0-8.43.88L85.25 80H40a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h45.25l69.84 54.31A7.94 7.94 0 0 0 160 232a8 8 0 0 0 8-8V32a8 8 0 0 0-4.48-7.19M235.31 128l18.35-18.34a8 8 0 0 0-11.32-11.32L224 116.69l-18.34-18.35a8 8 0 0 0-11.32 11.32L212.69 128l-18.35 18.34a8 8 0 0 0 11.32 11.32L224 139.31l18.34 18.35a8 8 0 0 0 11.32-11.32Z"/>`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
