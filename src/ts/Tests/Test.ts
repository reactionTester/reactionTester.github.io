import { State } from "../State.enum.js"

/**
 * abstract @class Test taht represents a test.
 * It can be audio, visual or physical.
 */
export default abstract class Test {

    protected timeoutId: number;
    protected isTestRunning: boolean;
    protected testStartTimeStamp: number;
    protected lastReactionTimeInMs: number;
    protected totalReactionTimeInMs: number;
    protected numberOfReactions: number;
    protected settings: any;
    protected settingsKey: string;
    protected buttonTitleIdle: string = '';
    protected Message1TitleIdle: string = '';
    protected buttonTitleWaitingBeep: string = '';

    constructor() {
        this.settingsKey = 'CompleteTest_Settings';
        this.timeoutId = 0;
        this.isTestRunning = false;
        this.testStartTimeStamp = 0;
        this.lastReactionTimeInMs = 0;
        this.totalReactionTimeInMs = 0;
        this.numberOfReactions = 0;
        this.settings = {
            test: {
                numberOfTries: 5,
                timeBetweenTriesInSecondsMin: 3,
                timeBetweenTriesInSecondsMax: 12
            }
        };
        document.addEventListener('DOMContentLoaded', () => {
            this.retrieveSettingsFromLocalStorage();
            this.initializeDOMElements();
        });
    }

    getNumberOfReactions() {
        return this.numberOfReactions;
    }

    getLastReactionTimeInMs() {
        return this.lastReactionTimeInMs;
    }

    getTotalReactionTimeInMs() {
        return this.totalReactionTimeInMs;
    }

    getSettings() {
        return this.settings;
    }

    getIsTestRunning() {
        return this.isTestRunning;
    }

    getButtonTitle(state: State) {
        switch (state) {
            case State.IDLE:
                return this.buttonTitleIdle;
            case State.WAITING_BEEP:
                return this.buttonTitleWaitingBeep;
            default:
                return '';
        }
    }

    getMessage1Title(state: State) {
        switch (state) {
            case State.IDLE:
                return this.Message1TitleIdle;
            default:
                return '';
        }
    }

    /**
     * Initializes the DOM elements.
     * This method is called in the constructor when the DOM is loaded.
     * @returns {void}
     */
    initializeDOMElements() {
        const DOMMinimumDelayInput = document.getElementById("minimum-delay-input") as HTMLInputElement;
        const DOMMaximumDelayInput = document.getElementById("maximum-delay-input") as HTMLInputElement;
        const DOMNumberOfTriesInput = document.getElementById("number-of-tries-input") as HTMLInputElement;

        DOMMinimumDelayInput.value = this.settings.test.timeBetweenTriesInSecondsMin.toString();
        DOMMaximumDelayInput.value = this.settings.test.timeBetweenTriesInSecondsMax.toString();
        DOMNumberOfTriesInput.value = this.settings.test.numberOfTries.toString();

        DOMMinimumDelayInput!.addEventListener('change', () => {
            this.settings.test.timeBetweenTriesInSecondsMin = parseInt(DOMMinimumDelayInput!.value);
            this.updateSettingsInLocalStorage();
        });
        DOMMaximumDelayInput!.addEventListener('change', () => {
            this.settings.test.timeBetweenTriesInSecondsMax = parseInt(DOMMaximumDelayInput!.value);
            this.updateSettingsInLocalStorage();
        });
        DOMNumberOfTriesInput!.addEventListener('change', () => {
            this.settings.test.numberOfTries = parseInt(DOMNumberOfTriesInput!.value);
            this.updateSettingsInLocalStorage();
        });
    }

    /**
     * Starts the test in a random time and get a timestamp.
     * @returns {void}
     */
    startRandom() {
        const randomDelay = getRandomInt(this.settings.test.timeBetweenTriesInSecondsMin * 1000, this.settings.test.timeBetweenTriesInSecondsMax * 1000);
        this.timeoutId = setTimeout(() => {
            this.startAction();
            this.testStartTimeStamp = performance.now()
            this.isTestRunning = true;
        }, randomDelay);
    };

    /**
     * Action to be executed when the test is stopped (e.g. start the audio).
     * @returns {void}
     * @abstract
     */
    abstract startAction(): void;

    /**
     * Stops the test.
     * @returns {void}
     */
    stop() {
        let timeStampClick = performance.now();
        this.lastReactionTimeInMs = timeStampClick - this.testStartTimeStamp;
        this.totalReactionTimeInMs += this.lastReactionTimeInMs;
        this.stopAction();
        this.isTestRunning = false;
        this.numberOfReactions++;
    }

    /**
     * Action to be executed when the test is stopped (e.g. stop the audio).
     * @returns {void}
     * @abstract   
     */
    abstract stopAction(): void;

    /**
     * Cancels the test start.
     * @returns {void}
     */
    cancelStart() {
        clearTimeout(this.timeoutId);
    }

    /**
     * Resets the test.
     * @returns {void}
     */
    reset() {
        this.isTestRunning = false;
        this.lastReactionTimeInMs = 0;
        this.totalReactionTimeInMs = 0;
        this.numberOfReactions = 0;
    }

    retrieveSettingsFromLocalStorage() {
        const settingsJson = localStorage.getItem(this.settingsKey);
        if (settingsJson)
            this.settings = JSON.parse(settingsJson);
    }

    /**
     * Updates the settings in local storage.
     * @returns {void}
     * @abstract
     */
    updateSettingsInLocalStorage() {
        localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    }
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}