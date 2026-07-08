import { useState } from 'react';
import { useDebouncer } from '@tanstack/react-pacer';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { Field } from '../ui/field';
import { Input } from '../ui/input';

interface Props {
    placeholder?: string;
    onSearch?: (value: string) => void;
    processing?: boolean;
    value?: string;
    className?: string;
}

export default function InputSimpleSearch({
    placeholder = 'Buscar...',
    onSearch,
    processing,
    value,
    className,
}: Props) {
    const [search, setSearch] = useState(value || '');

    const debouncer = useDebouncer((value: string) => onSearch?.(value), {
        wait: 700,
        leading: false,
        trailing: true,
    });

    const handleSearch = (value: string) => {
        setSearch(value);
        debouncer.maybeExecute(value);
    };

    const handleClear = () => {
        setSearch('');
        onSearch?.('');
    };

    return (
        <Field>
            {/* <FieldLabel htmlFor="input-simple-search">Search</FieldLabel> */}
            <ButtonGroup
                className={cn([
                    'rounded-lg border border-input bg-background focus-within:rounded-md focus-within:ring-2 focus-within:ring-primary dark:bg-input/30',
                    className,
                ])}
            >
                <Input
                    id="input-simple-search"
                    className="border-0 outline-none focus-visible:border-0 focus-visible:ring-0"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                />
                {search !== '' && (
                    <Button
                        variant="outline"
                        className="border-0 outline-0 focus-visible:ring-0"
                        onClick={handleClear}
                    >
                        <X />
                    </Button>
                )}
                {!processing && (
                    <Button
                        variant="outline"
                        className="border-0 outline-0 focus-visible:ring-0"
                    >
                        <Search />
                    </Button>
                )}
                {processing && (
                    <Button
                        variant="outline"
                        className="cursor-not-allowed border-0 outline-0 focus-visible:ring-0"
                        disabled
                    >
                        <svg
                            className="h-4 w-4 animate-spin text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </Button>
                )}
            </ButtonGroup>
        </Field>
    );
}
