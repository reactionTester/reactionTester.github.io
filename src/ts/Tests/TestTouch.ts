import Test from './Test.js';

/**
 * @class TestTouch
 */
export default class TestTouch extends Test {

    protected gamepads: (Gamepad | null)[] = [];
    protected selectedGamepad: Gamepad | null = null;

    constructor() {
        super();
        this.buttonTitleIdle = 'Touch Reaction Time Test.';
        this.Message1TitleIdle = 'Connect a gamepad to your computer (You may need to press a button if it\'s connected and don\'t show up in the settings).';
        this.buttonTitleWaitingBeep = 'Click when you feel the vibration.';
        this.settingsKey = 'TouchTest_Settings';
        window.addEventListener('gamepadconnected', (e) => { this.addGamepad(e.gamepad) });
        window.addEventListener('gamepaddisconnected', (e) => { this.removeGamepad(e.gamepad) });
        this.settings.gamepad = {
            gamepadId: 'Select your gamepad',
            durationInSeconds: 1,
            vibrationStrength: 0.5,
        };
    }

    startAction(): void {
        if (this.selectedGamepad === null) {
            alert('No gamepad connected.');
            return;
        }

        if (this.selectedGamepad.vibrationActuator === undefined) {
            alert('Gamepad does not support vibration.');
            return;
        }


        this.selectedGamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: this.settings.gamepad.durationInSeconds * 1000,
            weakMagnitude: this.settings.gamepad.vibrationStrength,
            strongMagnitude: this.settings.gamepad.vibrationStrength,
            leftTrigger: 1,
            rightTrigger: 1
        });
    }

    stopAction(): void {
        this.selectedGamepad?.vibrationActuator.reset();
    }

    initializeDOMElements(): void {
        super.initializeDOMElements();
        const DOMGamepadSelect = document.getElementById('gamepad-select') as HTMLSelectElement;
        const DOMVibrationStrengthInput = document.getElementById('vibration-strength-input') as HTMLInputElement;
        const DOMVibrationDurationInput = document.getElementById('vibration-duration-input') as HTMLInputElement;

        DOMVibrationStrengthInput.value = this.settings.gamepad.vibrationStrength;
        DOMVibrationDurationInput.value = this.settings.gamepad.durationInSeconds;
        DOMGamepadSelect.value = this.getGamepadIfExist(this.settings.gamepad.gamepadId)?.id || 'Select your gamepad';

        DOMGamepadSelect.addEventListener('change', () => {
            this.settings.gamepad.gamepadId = DOMGamepadSelect.value;
            this.selectedGamepad = this.getGamepadIfExist(this.settings.gamepad.gamepadId);
            this.updateSettingsInLocalStorage();
        });

        DOMVibrationStrengthInput.addEventListener('change', () => {
            this.settings.gamepad.vibrationStrength = parseFloat(DOMVibrationStrengthInput.value);
            this.updateSettingsInLocalStorage();
        });

        DOMVibrationDurationInput.addEventListener('change', () => {
            this.settings.gamepad.durationInSeconds = parseFloat(DOMVibrationDurationInput.value);
            this.updateSettingsInLocalStorage();
        });
    }

    /*
    * @function getGamepadIfExist
    * @description Check if a gamepad exists in the gamepads array and return it if it does exist or null if it does not
    * @param {any} gamepadId - The id of the gamepad to check
    * @returns {Gamepad | null} the gamepad if it exists or null if it does not
    */
    private getGamepadIfExist(gamepadId: any): Gamepad | null {
        console.log(this.gamepads);
        return this.gamepads?.find(gamepad => gamepad?.id === gamepadId) || null
    }

    private addGamepad(gamepad: Gamepad) {
        this.gamepads.push(gamepad);
        if (this.selectedGamepad === null)
            this.selectedGamepad = gamepad;

        const DOMGamepadSelect = document.getElementById('gamepad-select') as HTMLSelectElement;
        const option = document.createElement('option');
        option.value = gamepad.id;
        option.textContent = gamepad.id;
        DOMGamepadSelect.appendChild(option);
    }

    private removeGamepad(gamepad: Gamepad) {
        this.gamepads = this.gamepads.filter(g => g?.id !== gamepad.id);
        if (this.selectedGamepad === gamepad) {
            this.selectedGamepad = this.gamepads.length > 0 ? this.gamepads[0] : null;
        }

        const DOMGamepadSelect = document.getElementById('gamepad-select') as HTMLSelectElement;
        for (let i = 0; i < DOMGamepadSelect.options.length; i++) {
            const option = DOMGamepadSelect.options[i];

            if (option.value === gamepad.id) {
                DOMGamepadSelect.remove(i);
                break;
            }
        }
    }
}
