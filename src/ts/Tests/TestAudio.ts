import Test from './Test.js';

/**
 * @class TestAudio
 */
export default class TestAudio extends Test {

    protected audioContext: AudioContext;
    protected gainNode!: GainNode;
    protected oscillator!: OscillatorNode;

    constructor() {
        super();
        this.buttonTitleIdle = 'Audio Reaction Time Test.';
        this.Message1TitleIdle = 'When the beep sounds click, as fast as you can.';
        this.buttonTitleWaitingBeep = 'Click when you hear the beep.';
        this.settingsKey = 'AudioTest_Settings';
        this.settings.audio = {
            volume: 0.5,
            frequency: 260,
            type: 'square'
        };
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext);

        document.addEventListener('mousedown', () => { this.oscillator.start() }, { once: true });
    }

    startAction(): void {
        this.gainNode.connect(this.audioContext.destination);
    }

    stopAction(): void {
        this.gainNode.disconnect(this.audioContext.destination);
    }

    private createAudioObject() {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(this.settings.audio.frequency, this.audioContext.currentTime);
        this.oscillator.type = this.settings.audio.type;
        let gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.settings.audio.volume;
        this.oscillator.connect(gainNode);
        return gainNode;
    }

    private updateAudio() {
        if (this.isTestRunning)
            this.gainNode.disconnect(this.audioContext.destination);
        this.gainNode = this.createAudioObject();
        this.oscillator.start();
        if (this.isTestRunning)
            this.gainNode.connect(this.audioContext.destination);
    }

    private updateSettingsInLocalStorageAndUpdateAudio() {
        this.updateAudio();
        super.updateSettingsInLocalStorage();
    }

    retrieveSettingsFromLocalStorage() {
        super.retrieveSettingsFromLocalStorage();
        this.gainNode = this.createAudioObject();
    }

    initializeDOMElements() {
        super.initializeDOMElements();
        const DOMWaveSelect = document.getElementById("wave-select") as HTMLSelectElement;
        const DOMPitchInput = document.getElementById("pitch-input") as HTMLInputElement;
        const DOMVolumeInput = document.getElementById("volume-input") as HTMLInputElement;

        DOMWaveSelect.value = this.settings.audio.type;
        DOMPitchInput.value = this.settings.audio.frequency;
        DOMVolumeInput.value = this.settings.audio.volume;

        DOMWaveSelect.addEventListener('change', () => {
            this.settings.audio.type = DOMWaveSelect.value;
            this.updateSettingsInLocalStorageAndUpdateAudio();

        });

        DOMPitchInput.addEventListener('change', () => {
            this.settings.audio.frequency = parseInt(DOMPitchInput.value);
            this.updateSettingsInLocalStorageAndUpdateAudio();
        });

        DOMVolumeInput.addEventListener('change', () => {
            this.settings.audio.volume = parseFloat(DOMVolumeInput.value);
            this.updateSettingsInLocalStorageAndUpdateAudio();
        });
    }
}
