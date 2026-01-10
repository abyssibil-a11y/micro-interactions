export default function AsyncSwitch(selector, options = {}) {
    const switchEls = document.querySelectorAll(selector);
    if (!switchEls.length) return;

    switchEls.forEach((switchEl) => initOneAsyncSwitch(switchEl, options));
}

function initOneAsyncSwitch(switchEl, options) {
    const {
        save,
        onChange,
        disabled: disabledOpt,
        toast,
    } = options;

    const configDisabled =
        typeof disabledOpt === 'boolean'
            ? disabledOpt
            : switchEl.classList.contains('disabled');

    let isOn = switchEl.classList.contains('on');
    let isSaving = false;

    function render() {
        const isDisabled = configDisabled || isSaving;
        switchEl.classList.toggle('on', isOn);
        switchEl.classList.toggle('disabled', isDisabled);
        switchEl.classList.toggle('loading', isSaving);
    }


    // pessimistic
    async function commit(nextState) {
        if (typeof save !== 'function') return;

        isSaving = true;
        render();

        try {
            await save(nextState, switchEl);
            isOn = nextState;
        } catch (err) {
            showToast('Request failed. Please try again.');
            console.error(err);
        } finally {
            isSaving = false;
            render();
        }
    }

    function onClick() {
        if (configDisabled || isSaving) return;
        commit(!isOn);
    }

    function showToast(message) {
        if (typeof toast === 'function') {
            toast(message, { variant: 'error' });
        } else {
            console.warn(message);
        }
    }

    render();

    if (!configDisabled) {
        switchEl.addEventListener('click', onClick);
    }
}
