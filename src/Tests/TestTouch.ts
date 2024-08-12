import Test from './Test.js';

/**
 * @class TestTouch
 */
export default class TestTouch extends Test {

    protected DOMPlayButton!: HTMLElement;

    constructor() {
        super();
        this.buttonTitleIdle = 'TouchReaction Time Test.';
        this.Message1TitleIdle = 'Connect a gamepad to your computer.';
        this.buttonTitleWaitingBeep = 'Click when you feel the vibration.';
        this.settingsKey = 'TouchTest_Settings';
    }

    startAction(): void {
    }

    stopAction(): void {
    }
}
