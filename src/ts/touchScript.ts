function isFirefox(): boolean {
    return /firefox/i.test(navigator.userAgent);
}

function isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isSafariOnIOS(): boolean {
    return isIOS() && /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
}

function isWebViewOnIOS(): boolean {
    const isSafari = isSafariOnIOS();
    return isIOS() && !isSafari && (navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Version'));
}

/*
 * @function rumbleAvailableOnBrowser
 * @description Check if the browser supports gamepad vibrations throuh the gamepad API gamepad.vibrationActuator
  .playEffect
 * Now it's not supported in Firefox, Safari (on iOS) and WebView (on iOS)
 * @returns {boolean}
 */
function vibrationsAvailableOnBrowser() {
    return !(isFirefox() || isSafariOnIOS() || isWebViewOnIOS())
}

function ifVibrationsNotAvailableShowModal() {
    if (vibrationsAvailableOnBrowser())
        return;

    const modal = document.getElementById("vibration-not-supported-modal");
    modal!.style.display = "block";
    const overlay = document.getElementById("overlay");
    overlay!.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("vibration-not-supported-modal");
    modal!.style.display = "none";
    const overlay = document.getElementById("overlay");
    overlay!.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    ifVibrationsNotAvailableShowModal();
    document.getElementById("vibration-not-supported-modal-close")!.addEventListener('click', closeModal);
})