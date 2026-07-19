interface SocialDividerProps {
    text?: string;
}

export default function SocialDivider({ text = 'O continúa con' }: SocialDividerProps) {
    return (
        <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    {text}
                </span>
            </div>
        </div>
    );
}
