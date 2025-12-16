// tabs.js
export function createTabs(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Scope our selections to the container only
    const tabs = container.querySelectorAll('.tab');
    const indicator = container.querySelector('.tab-indicator');
    const panels = container.querySelectorAll('.tab-panel');

    function moveIndicator(tab) {
        if (!tab || !indicator) return;

        const tabRect = tab.getBoundingClientRect();
        const listRect = tab.parentElement.getBoundingClientRect();

        indicator.style.width = `${tabRect.width}px`;
        indicator.style.transform = `translateX(${tabRect.left - listRect.left}px)`;

        indicator.style.opacity = "1";
        indicator.style.transform += " scaleX(1)";
    }

    function init() {
        // Initial setup
        const activeTab = container.querySelector('.tab.active');
        if (activeTab) moveIndicator(activeTab);

        // Add event listeners
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                // Update active classes for tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                moveIndicator(tab);

                // Update panels
                panels.forEach(panel => {
                    panel.classList.toggle('active', panel.dataset.panel === target);
                });
            });
        });

        // Optional: Update indicator if window resizes
        window.addEventListener('resize', () => {
            const currentActive = container.querySelector('.tab.active');
            moveIndicator(currentActive);
        });
    }

    // Run initialization
    init();
}