import Test from './Test.js';
import TestAudio from './TestAudio.js';
import TestVisual from './TestVisual.js';
import TestTouch from './TestTouch.js';
import TestComplete from './TestComplete.js';

export default class TestFactory {
    private page: string;

    constructor(page: string) {
        this.page = page;
    }

    /*
    * @function createTest
    * @description Create a test in function of the page the user is on
    * @returns {Test} the test created
    */
    public createTest(): Test {
        switch (this.page) {
            case 'audio':
                return new TestAudio();
            case 'visual':
                return new TestVisual('#007bff', '#42f554'); // blueColorHex et greenColorHex
            case 'touch':
                return new TestTouch();
            case 'complete':
                return new TestComplete('#007bff', '#42f554');
            default:
                return new TestTouch();
        }
    }
}