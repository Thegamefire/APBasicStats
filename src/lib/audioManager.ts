// audioManager.ts
export const audioManager = {
    volume: 70,

    setVolume(volume: number) {
        this.volume = volume;
    },

    play(sound: string) {
        const audio = new Audio(sound);
        audio.volume = this.volume / 100;
        audio.play();
    }
};