'use client';

import React from 'react';

const ActivityTypesContext = React.createContext<string[] | null>(null);

export function ActivityTypesProvider({ activities, children }: { activities: string[]; children: React.ReactNode }) {
    return <ActivityTypesContext.Provider value={activities}>{children}</ActivityTypesContext.Provider>;
}

export function useActivityTypes() {
    const activityTypes = React.useContext(ActivityTypesContext);
    if (activityTypes === null) {
        throw new Error('UseActivityTypes hook must be used within ActivityTypesProvider');
    }

    return activityTypes;
}
