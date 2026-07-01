/**
 * Solves the 0/1 Knapsack problem to find the optimal set of maintenance tasks.
 * @param {Array} items - Array of tasks (each with Duration and Impact)
 * @param {number} capacity - Available mechanic hours
 * @returns {Object} - { selectedItems: Array, totalDuration: number, totalImpact: number }
 */
function solveKnapsack(items, capacity) {
    if (!items || items.length === 0 || capacity <= 0) {
        return { selectedItems: [], totalDuration: 0, totalImpact: 0 };
    }

    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        const weight = item.Duration;
        const value = item.Impact;

        for (let w = 0; w <= capacity; w++) {
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    const selectedItems = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            const item = items[i - 1];
            selectedItems.push(item);
            w -= item.Duration;
        }
    }

    selectedItems.reverse();

    const totalImpact = dp[n][capacity];
    const totalDuration = capacity - w;

    return {
        selectedItems,
        totalDuration,
        totalImpact,
    };
}

module.exports = {
    solveKnapsack,
};
