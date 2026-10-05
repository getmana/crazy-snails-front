import { Icon } from '@/components/shared/Icon/Icon';

type ErrorTextProps = { text: string; className?: string };

export const ErrorText = ({ text, className = '' }: ErrorTextProps) => {
    return (
        <div className="mt-2 flex items-center justify-start">
            <Icon icon="CircleExclamation" className="text-red-600" />
            <span className={`ml-2 text-red-600 ${className}`}>{text}</span>
        </div>
    );
};
