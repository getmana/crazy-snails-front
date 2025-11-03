import { z } from 'zod';

export const CreateAlbumSchema = z
    .object({
        // title: z.string().min(1, 'Title must be at least 1 character'),
        titleEn: z.string().optional(),
        titleUk: z.string().optional(),
        // description: z.string(),
        descriptionEn: z.string().optional(),
        descriptionUk: z.string().optional(),
        countries: z
            .array(z.object({ code: z.string() }))
            .min(1, 'At least one country field is required')
            .max(5, 'Maximum 5 countries allowed')
            .refine((countries) => countries.some((c) => c.code.length > 0), {
                message: 'At least one country must be selected',
            }),
        startDate: z.date(),
        endDate: z.date(),
        previewImage: z
            .any() // accept FileList
            .refine((fileList: FileList) => fileList?.[0] instanceof File, {
                message: 'Please upload a preview image',
            })
            .refine((fileList: FileList) => fileList[0].size <= 5 * 1024 * 1024, {
                message: 'Image must be less than 5 MB',
            })
            .refine((fileList: FileList) => fileList[0].type.startsWith('image/'), {
                message: 'Only image files are allowed',
            }),
        // z
        //         .instanceof(File, { message: 'Please upload a preview image' })
        //         .refine((file) => file.size > 0, 'Preview image is required')
        //         .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5 MB')
        //         .refine((file) => file.type.startsWith('image/'), 'Only image files are allowed'),
    })
    .refine((data) => data.titleEn || data.titleUk, {
        message: 'At least one of titleEn or titleUk must be provided',
        path: ['titleEn', 'titleUk'],
    })
    .refine((data) => data.descriptionEn || data.descriptionUk, {
        message: 'At least one of descriptionEn or descriptionUk must be provided',
        path: ['descriptionEn', 'descriptionUk'],
    });

export type CreateAlbumSchemaType = z.infer<typeof CreateAlbumSchema>;
