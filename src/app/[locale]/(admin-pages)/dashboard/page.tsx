import { Locale } from '@/i18n-config';
import { getDictionary } from '@/utils';

export default async function Dashboard(props: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await props.params;

    const { title } = await getDictionary(locale);

    return (
        <div className="section">
            <h1>{title.dashboard}</h1>
        </div>
    );
}
