export const runWithConcurrencyLimit = async <T>(items: T[], limit: number, worker: (item: T, index: number) => Promise<void>) => {
    let cursor = 0;

    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (cursor < items.length) {
                const index = cursor++;
                try {
                    await worker(items[index], index);
                } catch (error) {
                    console.error('runWithConcurrencyLimit: worker failed', error);
                }
            }
        }),
    );
};
