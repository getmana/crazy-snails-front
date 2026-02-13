export const transformObjectToFormData = (obj: Record<string, any>): FormData => {
    const formData = new FormData();
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        const value = obj[key];
        if (typeof value === 'string' || typeof value === 'number') {
            formData.append(key, obj[key] as string);
        }
    });
    return formData;
};
