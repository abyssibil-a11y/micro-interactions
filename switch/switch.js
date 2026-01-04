export default function Switch(selector, options = {}) {
    // DOM reference
    const switchEls = document.querySelectorAll(selector);
    if (!switchEls.length) return;

    switchEls.forEach((switchEl) => initOneSwitch(switchEl, options));
}

function initOneSwitch(switchEl, options) {
    const { onChange } = options;

    const disabled =
        typeof options.disabled === 'boolean'
            ? options.disabled
            : switchEl.classList.contains('disabled');

    let isOn = switchEl.classList.contains('on');

    switchEl.classList.toggle('disabled', disabled);

    // Behavior helper
    function setState(nextState) {
        if (disabled) return;

        isOn = nextState;
        switchEl.classList.toggle('on', isOn);

        if (typeof onChange === 'function') onChange(isOn, switchEl);
    }

    // Behavior helper
    function toggleState() {
        setState(!isOn);
    }

    // Wiring behavior to UI
    if (!disabled) {
        switchEl.addEventListener('click', toggleState);
    }
}

