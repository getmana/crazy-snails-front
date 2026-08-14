export const getActivityTypes = async (): Promise<string[]> => {
    if (!process.env.CS_API) {
        console.error('CS_API is not configured, skipping activity types fetch and falling back to an empty list.');
        return [];
    }

    try {
        const response = await fetch(`${process.env.CS_API}/albums/activity-types`);
        if (!response.ok) {
            throw new Error(`Activity types request failed with status ${response.status}`);
        }
        const activityTypes = await response.json();

        return activityTypes;
    } catch (e) {
        console.error('Failed to fetch activity types, falling back to an empty list:', e);
        return [];
    }
};
