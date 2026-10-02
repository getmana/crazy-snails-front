import { Icon } from '@/components';

export const ErrorText = ({ text, className = '' }: { text: string; className?: string }) => {
    return (
        <div className="mt-2 flex items-center justify-start">
            <Icon icon="CircleExclamation" className="text-red-600" />
            <span className={`ml-2 text-red-600 ${className}`}>{text}</span>
        </div>
    );
};
