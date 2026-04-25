"use client";

const runWithConcurrency = async <T,>(tasks: Array<() => Promise<T>>, limit = 4): Promise<T[]> => {
    if (tasks.length === 0) return [];

    const results: T[] = new Array(tasks.length);
    let nextTaskIndex = 0;

    const worker = async () => {
        while (true) {
            const currentIndex = nextTaskIndex;
            nextTaskIndex += 1;

            if (currentIndex >= tasks.length) {
                break;
            }

            results[currentIndex] = await tasks[currentIndex]();
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
    );

    return results;
};

export default runWithConcurrency;