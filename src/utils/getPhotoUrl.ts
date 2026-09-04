export const getPhotoUrl = (key: string): string => `${process.env.NEXT_PUBLIC_CS_API}/uploads/${key}`;
