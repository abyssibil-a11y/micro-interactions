export default function LoadingButton(selector, options = {}) {
    const buttonEls = document.querySelectorAll(selector);
    if (!buttonEls.length) return;

    buttonEls.forEach((buttonEl) => initOneLoadingButton(buttonEl, options));
}

function initOneLoadingButton(buttonEl, options) {
    const {
        action,
        disabled: disabledOpt,
        loadingText = 'Loading…',
        toast,
        onSuccess,
        onError,
    } = options;

    const configDisabled =
        typeof disabledOpt === 'boolean'
            ? disabledOpt
            : buttonEl.classList.contains('disabled');

    let isLoading = false;

    const iconEl = buttonEl.querySelector('.icon');
    const textEl = buttonEl.querySelector('.text');

    const originalIcon = iconEl?.textContent;
    const originalText = textEl?.textContent;

    function render() {
        const isDisabled = configDisabled || isLoading;

        buttonEl.disabled = isDisabled;
        buttonEl.classList.toggle('loading', isLoading);

        if (isLoading) {
            if (iconEl) iconEl.textContent = '↻';
            if (textEl) textEl.textContent = loadingText;
        } else {
            if (iconEl) iconEl.textContent = originalIcon;
            if (textEl) textEl.textContent = originalText;
        }
    }

    async function handleClick(event) {
        if (configDisabled || isLoading) return;

        if (typeof action !== 'function') {
            console.warn('LoadingButton: options.action must be a function');
            return;
        }

        isLoading = true;
        render();

        try {
            const result = await action(buttonEl, event);

            if (typeof onSuccess === 'function') {
                onSuccess(result, buttonEl);
            }
        } catch (err) {
            if (typeof onError === 'function') {
                onError(err, buttonEl);
            } else if (typeof toast === 'function') {
                toast('Something went wrong. Please try again.', { variant: 'error' });
            } else {
                console.error(err);
            }
        } finally {
            isLoading = false;
            render();
        }
    }

    render();

    if (!configDisabled) {
        buttonEl.addEventListener('click', handleClick);
    }
}



