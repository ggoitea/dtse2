import { Inbox } from 'lucide-react';

interface Props {
    message: string;
    description?: string;
}

export function EmptyCollectionState({ message, description }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
            <div className="rounded-full bg-muted p-4">
                <Inbox className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="font-medium text-foreground">{message}</p>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
