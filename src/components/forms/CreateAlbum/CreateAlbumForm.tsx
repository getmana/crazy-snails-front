'use client';

import { useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createAlbumWithRedirect } from '@/actions/createAlbum';
import { ErrorText, Icon, Select, TextInput } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDictionary, useToastMessageContext } from '@/context';
import { i18n, Locale } from '@/i18n-config';
import { CountryList } from '@/lib';
import { getLocalizedDescription, getLocalizedTitle, transformObjectToFormData } from '@/utils';

import { CreateAlbumSchema, CreateAlbumSchemaType } from './CreateAlbumSchema';

export const CreateAlbumForm = ({ countries, locale }: { countries: CountryList; locale: Locale }) => {
    const [isPending, startTransition] = useTransition();

    const { setToastMessage } = useToastMessageContext();

    const {
        createAlbumForm: { title, description, countriesLabel, countryPlaceholder, addCountryBtn, startDate, endDate, submitBtn },
    } = useDictionary();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateAlbumSchemaType>({
        resolver: zodResolver(CreateAlbumSchema),
        defaultValues: {
            titleEn: '',
            titleUk: '',
            descriptionEn: '',
            descriptionUk: '',
            countries: [{ code: '' }],
            startDate: undefined,
            endDate: undefined,
        },
    });

    const { fields, append, remove } = useFieldArray<CreateAlbumSchemaType>({
        control,
        name: 'countries',
    });

    console.log('fields', fields);

    const onSubmit = async (data: CreateAlbumSchemaType) => {
        console.log('Form data:', data);

        const { countries, endDate, startDate, ...rest } = data;

        // TODO Add logic to add default items - they should be of users preffered locale. Otherwise - EN. Otherwise use any filled option.
        // User model needs locale and theme properties to be added to show the same settings from any device when logged in
        const title = data.titleEn || data.titleUk || '';
        const description = data.descriptionEn || data.descriptionUk || '';

        const apiFormData = transformObjectToFormData(rest);

        apiFormData.append('title', title);
        apiFormData.append('description', description);
        apiFormData.append('countries', JSON.stringify(countries));
        apiFormData.append('startDate', startDate.toISOString());
        apiFormData.append('endDate', endDate.toISOString());
        startTransition(async () => {
            const result = await createAlbumWithRedirect(apiFormData);
            if (result) {
                setToastMessage({ message: result, type: 'error' });
            }
        });
    };

    const orderedLocales = [locale, ...i18n.locales.filter((l) => l !== locale)] as const;

    return (
        <div className="flex max-w-full flex-col pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue={locale}>
                    <TabsList>
                        {orderedLocales.map((l) => (
                            <TabsTrigger key={l} value={l}>
                                {l.toUpperCase()}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {orderedLocales.map((l) => (
                        <TabsContent key={l} value={l}>
                            <TextInput
                                label={title}
                                placeholder={`${l.toUpperCase()} ${title}`}
                                {...register(getLocalizedTitle(l))}
                                error={errors[getLocalizedTitle(l)]?.message}
                            />
                            <TextInput
                                placeholder={`${l.toUpperCase()} ${description}`}
                                label={description}
                                {...register(getLocalizedDescription(l))}
                                error={errors[getLocalizedDescription(l)]?.message}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
                <div>
                    <label className="mb-1 block">{countriesLabel}</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-2 flex items-start space-x-2">
                            <Controller
                                control={control}
                                name={`countries.${index}.code`}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        error={errors.countries?.[index]?.code?.message}
                                        options={countries}
                                        placeholder={countryPlaceholder}
                                    />
                                )}
                            />
                            {fields.length > 1 && (
                                <button type="button" onClick={() => remove(index)} className="pt-1 pl-2">
                                    <Icon icon="TrashBin" className="fill-foreground size-8" />
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.countries?.root && <ErrorText text={errors.countries.root.message || 'Error when selecting country'} />}
                    {fields.length < 5 && (
                        <button type="button" onClick={() => append({ code: '' })} className="btn-primary">
                            {addCountryBtn}
                        </button>
                    )}
                </div>
                <TextInput
                    label={startDate}
                    type="date"
                    {...register('startDate', {
                        setValueAs: (value) => (value ? new Date(value) : undefined),
                    })}
                    error={errors.startDate?.message}
                />
                <TextInput
                    label={endDate}
                    type="date"
                    {...register('endDate', {
                        setValueAs: (value) => (value ? new Date(value) : undefined),
                    })}
                    error={errors.endDate?.message}
                />
                <button type="submit" className="btn-primary" disabled={isPending}>
                    {submitBtn}
                </button>
            </form>
        </div>
    );
};
