export function horizontalScroll(evt: WheelEvent, scrollTarget: EventTarget | HTMLElement | null, invert?: boolean) {
    // Source - https://stackoverflow.com/a/76111298

    if (scrollTarget == null) return;

    const rScrollTarget = scrollTarget as HTMLElement;

    evt.preventDefault();

    if (evt.deltaY >= -15 && evt.deltaY <= 15) {
        rScrollTarget.scrollLeft += evt.deltaY * 40 * (invert?-1:1);
    } else {
        rScrollTarget.scrollLeft += evt.deltaY * 5 * (invert?-1:1);
    }
}