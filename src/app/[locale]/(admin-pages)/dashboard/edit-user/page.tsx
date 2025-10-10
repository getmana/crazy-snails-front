import { EditUserForm } from '@/components';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function CreateAlbum(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="section flex w-full flex-col items-center px-8">
            <h1>{title.editUser}</h1>
            <div className="w-full bg-white py-12 md:w-2xl">
                <EditUserForm locale={locale} />
            </div>
        </div>
    );
}
