import type { StoryPreview } from './story';

export type SearchParams = {
    toast?: string;
};

export type AdminTheme = 'dark' | 'light';

export type SelectOption = {
    id: number;
    name: string;
};

export type AdminListItem = Pick<
    StoryPreview,
    'id' | 'title' | 'titleEn' | 'titleUk' | 'subtitle' | 'subtitleEn' | 'subtitleUk' | 'photo' | 'isPublished'
>;
