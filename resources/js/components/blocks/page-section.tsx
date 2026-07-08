import { Head } from '@inertiajs/react';

import Heading from '../heading';

interface Props {
    children: React.ReactNode;
    pageTitle?: string;
    pageDescription?: string;
    browserTitle?: string;
    zoneActions?: React.ReactNode;
}
export default function PageSection({
    children,
    pageTitle,
    pageDescription,
    browserTitle,
    zoneActions,
}: Props) {
    return (
        <>
            {(browserTitle || pageTitle) && (
                <Head title={browserTitle || pageTitle} />
            )}
            <div className="flex grow flex-col">
                {(pageTitle || pageDescription || zoneActions) && (
                    <div className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center">
                        {(pageTitle || pageDescription) && (
                            <Heading
                                title={pageTitle ?? ''}
                                description={pageDescription}
                            />
                        )}
                        <div
                            id="zone-actions"
                            className="flex flex-col gap-4 md:flex-row"
                        >
                            {zoneActions ?? null}
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-2 p-4">{children}</div>
            </div>
        </>
    );
}
