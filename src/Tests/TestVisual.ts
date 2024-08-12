import Test from './Test.js';

/**
 * @class TestVisual
 */
export default class TestVisual extends Test {

    protected greenColorHex;
    protected blueColorHex;
    protected DOMPlayButton!: HTMLElement;

    constructor(blueColorHex: string, greenColorHex: string) {
        super();
        this.buttonTitleIdle = 'Visual Reaction Time Test.';
        this.Message1TitleIdle = 'When the button turns green, click as fast as you can.';
        this.buttonTitleWaitingBeep = 'Click when the button turns green.';
        this.settingsKey = 'VisualTest_Settings';
        this.greenColorHex = greenColorHex;
        this.blueColorHex = blueColorHex;
    }

    startAction(): void {
        this.DOMPlayButton.style.backgroundColor = this.greenColorHex;
    }

    stopAction(): void {
        this.DOMPlayButton.style.backgroundColor = this.blueColorHex;
    }

    initializeDOMElements(): void {
        super.initializeDOMElements();
        this.DOMPlayButton = document.getElementById("play-beep") as HTMLElement;
    }
}
