import { Head } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

export default function NotFound({ message = 'The requested resource was not found.' }) {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center">
            <Head title="Not Found" />
            <div className="max-w-md p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <AlertCircle className="text-destructive h-20 w-20" />
                </div>
                <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <a href="/" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
                    Return Home
                </a>
            </div>
        </div>
    );
}
