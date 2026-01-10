// toast.js
export default function Toast(options = {}) {
    const {
        duration = 2500,
        maxToasts = 3,
    } = options;

    const container = getOrCreateContainer();

    return function showToast(message, toastOptions = {}) {
        const {
            variant = 'default', // 'default' | 'error' | 'success'
            ms = duration,
        } = toastOptions;

        // Keep the UI tidy: remove older toasts if too many
        while (container.children.length >= maxToasts) {
            container.firstElementChild?.remove();
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast toast--${variant}`;
        toastEl.textContent = message;

        container.appendChild(toastEl);

        // Trigger enter animation
        requestAnimationFrame(() => {
            toastEl.classList.add('toast--show');
        });

        // Auto-dismiss
        const timeoutId = window.setTimeout(() => {
            dismiss(toastEl);
        }, ms);

        // Click to dismiss
        toastEl.addEventListener('click', () => {
            window.clearTimeout(timeoutId);
            dismiss(toastEl);
        });
    };
}

function getOrCreateContainer() {
    let container = document.querySelector('.toast-container');
    if (container) return container;

    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function dismiss(toastEl) {
    toastEl.classList.remove('toast--show');
    toastEl.addEventListener(
        'transitionend',
        () => toastEl.remove(),
        { once: true }
    );
}
