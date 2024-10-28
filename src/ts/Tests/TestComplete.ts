import TestAudio from './TestAudio.js';
import TestVisual from './TestVisual.js';
import TestTouch from './TestTouch.js';
import Test from './Test.js';
import { State } from '../State.enum.js';

export default class TestComplete extends Test {
    private testAudio: TestAudio;
    private testVisual: TestVisual;
    private testTouch: TestTouch;
    private currentTest: Test;

    constructor(blueColorHex: string, greenColorHex: string) {
        super();
        this.buttonTitleIdle = 'Complete Reaction Time Test.';
        this.Message1TitleIdle = 'A random test will start when you click the button, click when you hear a beep, feel a vibration or the button turns green.';
        this.buttonTitleWaitingBeep = 'Click when you hear a beep, feel a vibration or the button turns green.';
        this.testAudio = new TestAudio();
        this.testVisual = new TestVisual(blueColorHex, greenColorHex);
        this.testTouch = new TestTouch();
        this.currentTest = this.testAudio
    }

    startAction(): void {
        this.currentTest = this.getRandomTest();
        this.currentTest.startAction();
    }

    private getRandomTest(): Test {
        let randomNumber: number = Math.floor(Math.random() * 3);
        switch (randomNumber) {
            case 0:
                return this.testAudio;
            case 1:
                return this.testVisual;
            default:
                return this.testTouch;
        }
    }

    stopAction(): void {
        this.currentTest.stopAction();
    }

    initializeDOMElements(): void {
        super.initializeDOMElements();
        this.testAudio.initializeDOMElements();
        this.testVisual.initializeDOMElements();
        this.testTouch.initializeDOMElements();
    }
}