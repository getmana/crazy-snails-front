'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ErrorText, Icon, Select, TextInput } from '@/components';
import { useDictionary } from '@/context';
import { CountryList } from '@/lib';

import { CreateAlbumSchema, CreateAlbumSchemaType } from './CreateAlbumSchema';

export const CreateAlbumForm = ({ countries }: { countries: CountryList }) => {
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
            title: '',
            description: '',
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

    const onSubmit = (data: CreateAlbumSchemaType) => {
        console.log('Form data:', data);
    };

    return (
        <div className="flex flex-col items-center pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextInput label={title} {...register('title')} error={errors.title?.message} />
                <TextInput label={description} {...register('description')} error={errors.description?.message} />
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
                <button type="submit" className="btn-primary">
                    {submitBtn}
                </button>
            </form>
        </div>
    );
};
