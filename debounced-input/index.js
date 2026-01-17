export default function DebouncedInput(selector, options = {}) {
    const rootEls = document.querySelectorAll(selector);
    if (!rootEls.length) return;

    rootEls.forEach((rootEl) => initOneDebouncedInput(rootEl, options));
}

function initOneDebouncedInput(rootEl, options) {
    // Find required elements
    const inputEl = rootEl.querySelector('.input');
    const statusEl = rootEl.querySelector('.status');
    const resultsEl = rootEl.querySelector('.results');

    if (!inputEl || !statusEl || !resultsEl) {
        console.warn(
            'DebouncedInput: missing .input, .status, or .results inside:',
            rootEl
        );
        return;
    }

    // Options (configuration / facts)
    const {
        delayMs = 300,
        minLength = 2,
        disabled: disabledOpt,
        search,
        onResults,
        onError,
        onSelect,
    } = options;

    const configDisabled =
        typeof disabledOpt === 'boolean'
            ? disabledOpt
            : rootEl.classList.contains('disabled') || inputEl.disabled;


    // Set initial disabled state
    inputEl.disabled = configDisabled;

    // Context object
    const ctx = {
        rootEl,
        inputEl,
        statusEl,
        resultsEl,
        delayMs,
        minLength,
        search,
        onResults,
        onError,
        configDisabled,
    };

    // State
    let timerId = null;
    let isLoading = false;
    let lastRequestedId = 0;
    let lastResults = [];


    // Render helpers
    function setStatus(text) {
        statusEl.textContent = text || '';
    }

    function setLoading(next) {
        isLoading = next;
        rootEl.classList.toggle('loading', isLoading);
    }

    function clearResults() {
        resultsEl.innerHTML = '';
    }

    function renderResults(items) {
        clearResults();

        if (!items || !items.length) return;

        items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.label;
            li.dataset.id = item.id;
            resultsEl.appendChild(li);
        });
    }

    // Debounce core
    function scheduleSearch(query) {
        // Clear pending search
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }

        // If disabled, do nothing
        if (configDisabled) return;

        const trimmed = query.trim();

        // If too short, reset UI
        if (trimmed.length < minLength) {
            setLoading(false);
            setStatus('');
            clearResults();
            lastResults = [];
            return;
        }

        timerId = setTimeout(() => {
            runSearch(trimmed);
        }, delayMs);
    }

    function onInput() {
        scheduleSearch(inputEl.value);
    }

    // Initial UI
    renderResults([]);
    setStatus('');

    // Wire event listener
    inputEl.addEventListener('input', onInput);

    function onResultsClick(event) {
        if (configDisabled) return;

        const li = event.target.closest('li');
        if (!li || !resultsEl.contains(li)) return;

        const id = li.dataset.id;
        const selected = lastResults.find((item) => item.id === id);

        // If we can't find it, bail safely
        if (!selected) return;

        // Put selection into input
        inputEl.value = selected.label;
        inputEl.focus();

        // Clear dropdown/results
        clearResults();
        lastResults = [];
        setStatus('');

        // Cancel any pending debounce timer
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }

        // Optional consumer callback
        if (typeof onSelect === 'function') {
            onSelect(selected, ctx);
        }
    }

    resultsEl.addEventListener('click', onResultsClick);



    async function runSearch(query) {
        if (typeof search !== 'function') {
            console.warn('DebouncedInput: options.search must be a function');
            return;
        }

        const requestId = ++lastRequestedId;

        setLoading(true);
        setStatus('Loading...');

        try {
            const results = await search(query, ctx);

            // Ignore stale results
            if (requestId !== lastRequestedId) return;

            setLoading(false);

            if (!results || results.length === 0) {
                setStatus('No results');
                clearResults();
                lastResults = [];
                if (typeof onResults === 'function') onResults([], ctx);
                return;
            }

            setStatus('');
            lastResults = results;
            renderResults(results);

            if (typeof onResults === 'function') {
                onResults(results, ctx);
            }
        } catch (err) {
            // Ignore stale errors too
            if (requestId !== lastRequestedId) return;

            setLoading(false);
            setStatus('Something went wrong');

            if (typeof onError === 'function') {
                onError(err, ctx);
            } else {
                console.error(err);
            }
        }
    }


    statusEl.textContent = '';
    resultsEl.innerHTML = '';


}

