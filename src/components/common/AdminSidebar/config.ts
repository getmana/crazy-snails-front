import { Aperture, BookText, BookType, Camera, Image, Settings, SquareUserRound, Tent } from 'lucide-react';

import { Locale } from '@/i18n-config';
import { DictionaryType } from '@/utils';

import { type ColapsibleItem, type MenuItem } from './AdminSidebar';

const getContentItems = (locale: Locale, dictionary: DictionaryType): ColapsibleItem[] => {
    const {
        adminSidebar: { contentAlbums, contentCustom, contentPhotos, contentStories },
    } = dictionary;
    return [
        {
            title: contentAlbums.title,
            icon: Camera,
            subItems: [
                { title: contentAlbums.list, url: `/${locale}/dashboard/albums` },
                { title: contentAlbums.create, url: `/${locale}/dashboard/create-album` },
            ],
        },
        {
            title: contentStories.title,
            icon: BookType,
            subItems: [
                { title: contentStories.list, url: `/${locale}/dashboard/stories` },
                { title: contentStories.create, url: `/${locale}/dashboard/create-story` },
            ],
        },
        {
            title: contentCustom.title,
            icon: Tent,
            subItems: [
                { title: contentCustom.settings, url: `/${locale}/dashboard/custom-settings` },
                { title: contentCustom.custom, url: `/${locale}/dashboard/custom-album` },
            ],
        },
        {
            title: contentPhotos.title,
            icon: Image,
            subItems: [
                { title: contentPhotos.list, url: `/${locale}/dashboard/photos` },
                { title: contentPhotos.create, url: `/${locale}/dashboard/upload-photo` },
            ],
        },
    ];
};

const getPageItems = (locale: Locale, dictionary: DictionaryType): MenuItem[] => {
    const {
        adminSidebar: { albumsTitle, storiesTitle, customTitle },
    } = dictionary;

    return [
        {
            title: albumsTitle,
            url: `/${locale}/albums`,
            icon: Aperture,
        },
        {
            title: storiesTitle,
            url: `/${locale}/stories`,
            icon: BookText,
        },
        {
            title: customTitle,
            url: `/${locale}/grandpa`,
            icon: Tent,
        },
    ];
};

const getAccountItems = (locale: Locale, dictionary: DictionaryType): MenuItem[] => {
    const {
        adminSidebar: { accountTitle, settingsTitle },
    } = dictionary;
    return [
        {
            title: accountTitle,
            url: `/${locale}/dashboard/account`,
            icon: SquareUserRound,
        },
        {
            title: settingsTitle,
            url: `/${locale}/dashboard/settings`,
            icon: Settings,
        },
    ];
};

export const sidebarConfig = (locale: Locale, dictionary: DictionaryType) => {
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
