import TestAudio from './TestAudio.js';
import TestVisual from './TestVisual.js';
import TestTouch from './TestTouch.js';
import Test from './Test.js';

export default class TestComplete extends Test {
    private testAudio: TestAudio;
    private testVisual: TestVisual;
    private testTouch: TestTouch;
    private currentTest: Test;

    constructor(blueColorHex: string, greenColorHex: string) {
        super();
        this.testAudio = new TestAudio();
        this.testVisual = new TestVisual(blueColorHex, greenColorHex);
        this.testTouch = new TestTouch();
        this.currentTest = this.testAudio
    }

    startAction(): void {
        this.currentTest = this.runRandomTest();
    }

    /*
    * @function runRandomTest
    * @description Run a random test and return it
    * @returns {Test} the test that was run
    */
    private runRandomTest(): Test {
        let randomTest = Math.floor(Math.random() * 3);
        switch (randomTest) {
            case 0:
                this.currentTest = this.testAudio;
                break;
            case 1:
                this.currentTest = this.testVisual;
                break;
            case 2:
                this.currentTest = this.testTouch;
                break;
        }
        return this.currentTest;
    }

    stopAction(): void {
        this.currentTest.stopAction();
    }

    initializeDOMElements(): void {
        this.testAudio.initializeDOMElements();
        this.testVisual.initializeDOMElements();
        this.testTouch.initializeDOMElements();
    }
}