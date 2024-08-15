import TestFactory from "./Tests/TestFactory.js"
import Test from "./Tests/Test.js"
import { State } from "./State.enum.js"

const blueColorHex = '#007bff';
const orangeColorHex = '#f59e42';
const redColorHex = '#ff4c4c';
const greenColorHex = '#28a745';
const lastTriesKey = 'CompleteTest_LastTries';

let test: Test = getTest();
let state = State.IDLE;
let lastTries: number[] = [];

function getTest(): Test {
    // @ts-ignore
    const testFactory = new TestFactory(page);
    return testFactory.createTest();
}

document.addEventListener('DOMContentLoaded', function () {

    const DOMTitle = document.getElementById("title") as HTMLElement;
    const DOMMessage1 = document.getElementById("message1") as HTMLElement;
    const DOMMessage2 = document.getElementById("message2") as HTMLElement;
    const DOMplayButton = document.getElementById("play-beep") as HTMLElement;
    const DOMTriesList = document.getElementById("tries-list") as HTMLElement;

    initializeLastTries();

    document.addEventListener('keydown', (handleSpacebarPress));
    DOMplayButton!.addEventListener('mousedown', handleClick);

    function handleSpacebarPress(event: KeyboardEvent) {
        if (event.code === 'Space') {
            handleClick();
            event.preventDefault();
        }
    }

    function handleClick() {
        switch (state) {
            case State.IDLE:
                transitionToWaitingBeep();
                break;
            case State.WAITING_BEEP:
                if (!test.getIsTestRunning())
                    transitionToFalseStart();
                else if (test.getNumberOfReactions() >= test.getSettings().test.numberOfTries - 1)
                    transitionToFinalResult();
                else
                    transitionToResult();
                break;
            case State.RESULT:
                transitionToWaitingBeep();
                break;
            case State.FALSE_START:
                transitionToWaitingBeep();
                break;
            case State.FINAL_RESULT:
                transitionToIdle();
                break;
            default:
                console.log(`Error, state is: ${state}.`);
        }
    }

    function transitionToWaitingBeep() {
        state = State.WAITING_BEEP;
        test.startRandom();
        DOMplayButton.style.backgroundColor = orangeColorHex;
        DOMTitle.textContent = test.getButtonTitle(state);
        DOMMessage1.textContent = '';
        DOMMessage2.textContent = '';
    }

    function transitionToResult() {
        state = State.RESULT;
        test.stop();
        DOMplayButton!.style.backgroundColor = blueColorHex;
        DOMTitle!.textContent = Math.floor(test.getLastReactionTimeInMs()) + ' ms';
        DOMMessage1!.textContent = 'Click to try again.';
        DOMMessage2!.textContent = '';
    }

    function transitionToFalseStart() {
        state = State.FALSE_START;
        test.cancelStart();
        DOMplayButton!.style.backgroundColor = redColorHex;
        DOMTitle!.textContent = 'Too soon!';
        DOMMessage1!.textContent = 'Click to try again.';
        DOMMessage2!.textContent = '';
    }

    function transitionToFinalResult() {
        state = State.FINAL_RESULT;
        test.stop();
        DOMplayButton.style.backgroundColor = blueColorHex;
        let averageReactionTimeInMs = Math.floor(test.getTotalReactionTimeInMs() / test.getSettings().test.numberOfTries);
        DOMTitle!.textContent = 'Average result: ' + averageReactionTimeInMs + ' ms';
        DOMMessage1!.textContent = 'Click to try again the test.';
        DOMMessage2!.textContent = '';
        lastTries.push(averageReactionTimeInMs);
        addTrieToListDOM(averageReactionTimeInMs);
        localStorage.setItem(lastTriesKey, JSON.stringify(lastTries));
    }

    function transitionToIdle() {
        state = State.IDLE;
        test.reset();
        DOMplayButton!.style.backgroundColor = blueColorHex;
        DOMTitle!.textContent = test.getButtonTitle(state);
        DOMMessage1!.textContent = test.getMessage1Title(state);
        DOMMessage2!.textContent = 'Click to begin.';
    }

    function addTrieToListDOM(reactionTimeInMs: number) {
        const li = document.createElement('li');
        li.textContent = reactionTimeInMs + ' ms';
        DOMTriesList!.insertBefore(li, DOMTriesList!.firstChild);
    }

    function createTriesList() {
        DOMTriesList!.innerHTML = '';
        lastTries.forEach((time) => {
            addTrieToListDOM(time);
        });
    }

    function initializeLastTries() {
        const lastTriesJson = localStorage.getItem(lastTriesKey);
        if (lastTriesJson)
            lastTries = JSON.parse(lastTriesJson);
        createTriesList();
    }
});