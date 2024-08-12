
/**
 * abstract @class Test taht represents a test.
 * It can be audio, visual or physical.
 */
export default abstract class Test {

    timeoutId: number;
    isTestRunning: boolean;
    testStartTimeStamp: number;
    lastReactionTimeInMs: number;
    totalReactionTimeInMs: number;
    numberOfReactions: number;
    settings: any;
    DOMMinimumDelayInput!: HTMLInputElement;
    DOMMaximumDelayInput!: HTMLInputElement;
    DOMNumberOfTriesInput!: HTMLInputElement;
    settingsKey: string;

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


    /**
     * Initializes the DOM elements.
     * The DOM elements are the inputs that the user can interact with in the settings card.
     * value of the inputs are set to the values of the settings retrieved from local storage.
     * Event listeners are added to the inputs to update the settings in local storage.
     * @returns {void}
     */
    initializeDOMElements() {
        this.DOMMinimumDelayInput = document.getElementById("minimum-delay-input") as HTMLInputElement;
        this.DOMMaximumDelayInput = document.getElementById("maximum-delay-input") as HTMLInputElement;
        this.DOMNumberOfTriesInput = document.getElementById("number-of-tries-input") as HTMLInputElement;

        this.DOMMinimumDelayInput.value = this.settings.test.timeBetweenTriesInSecondsMin.toString();
        this.DOMMaximumDelayInput.value = this.settings.test.timeBetweenTriesInSecondsMax.toString();
        this.DOMNumberOfTriesInput.value = this.settings.test.numberOfTries.toString();

        this.DOMMinimumDelayInput!.addEventListener('change', () => {
            this.settings.test.timeBetweenTriesInSecondsMin = parseInt(this.DOMMinimumDelayInput!.value);
            this.updateSettingsInLocalStorage();
        });
        this.DOMMaximumDelayInput!.addEventListener('change', () => {
            this.settings.test.timeBetweenTriesInSecondsMax = parseInt(this.DOMMaximumDelayInput!.value);
            this.updateSettingsInLocalStorage();
        });
        this.DOMNumberOfTriesInput!.addEventListener('change', () => {
            this.settings.test.numberOfTries = parseInt(this.DOMNumberOfTriesInput!.value);
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
        this.lastReactionTimeInMs = timeStampClick - this.testStartTimeStamp - 10;
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