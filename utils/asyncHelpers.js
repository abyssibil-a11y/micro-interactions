export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function maybeFail(failureRate = 0.25) {
    if (Math.random() < failureRate) {
        throw new Error('Network error');
    }
}