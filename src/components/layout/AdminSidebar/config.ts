import { Aperture, BookText, BookType, Camera, Image, Settings, SquareUserRound, Tent } from 'lucide-react';

import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

import { type CollapsibleItem, type MenuSection, type RegularMenuItem } from './types';

const getContentItems = (locale: Locale, dictionary: DictionaryType): CollapsibleItem[] => {
    const {
        adminSidebar: { contentAlbums, contentCustom, contentPhotos, contentStories },
    } = dictionary;
    return [
        {
            type: 'collapsible',
            title: contentAlbums.title,
            icon: Camera,
            subItems: [
                { title: contentAlbums.list, url: `/${locale}/dashboard/albums` },
                { title: contentAlbums.create, url: `/${locale}/dashboard/create-album` },
            ],
        },
        {
            type: 'collapsible',
            title: contentStories.title,
            icon: BookType,
            subItems: [
                { title: contentStories.list, url: `/${locale}/dashboard/stories` },
                { title: contentStories.create, url: `/${locale}/dashboard/create-story` },
            ],
        },
        {
            type: 'collapsible',
            title: contentCustom.title,
            icon: Tent,
            subItems: [
                { title: contentCustom.settings, url: `/${locale}/dashboard/custom-settings` },
                { title: contentCustom.custom, url: `/${locale}/dashboard/custom-album` },
            ],
        },
        {
            type: 'collapsible',
            title: contentPhotos.title,
            icon: Image,
            subItems: [
                { title: contentPhotos.list, url: `/${locale}/dashboard/photos` },
                { title: contentPhotos.create, url: `/${locale}/dashboard/upload-photo` },
            ],
        },
    ];
};

const getPageItems = (locale: Locale, dictionary: DictionaryType): RegularMenuItem[] => {
    const {
        adminSidebar: { albumsTitle, storiesTitle, customTitle },
    } = dictionary;

    return [
        {
            type: 'regular',
            title: albumsTitle,
            url: `/${locale}/albums`,
            icon: Aperture,
        },
        {
            type: 'regular',
            title: storiesTitle,
            url: `/${locale}/stories`,
            icon: BookText,
        },
        {
            type: 'regular',
            title: customTitle,
            url: `/${locale}/grandpa`,
            icon: Tent,
        },
    ];
};

const getAccountItems = (locale: Locale, dictionary: DictionaryType): RegularMenuItem[] => {
    const {
        adminSidebar: { accountTitle, settingsTitle },
    } = dictionary;
    return [
        {
            type: 'regular',
            title: accountTitle,
            url: `/${locale}/dashboard/account`,
            icon: SquareUserRound,
        },
        {
            type: 'regular',
            title: settingsTitle,
            url: `/${locale}/dashboard/settings`,
            icon: Settings,
        },
    ];
};

export const getSidebarConfig = (locale: Locale, dictionary: DictionaryType): MenuSection[] => {
    const {
        adminSidebar: { sectionContentTitle, sectionAccountTitle, sectionPagesTitle },
    } = dictionary;

    const contentSection = {
        title: sectionContentTitle,
        items: getContentItems(locale, dictionary),
    };

    const accountSection = {
        title: sectionAccountTitle,
        items: getAccountItems(locale, dictionary),
    };

    const pagesSection = {
        title: sectionPagesTitle,
        items: getPageItems(locale, dictionary),
    };

    return [contentSection, accountSection, pagesSection];
};
