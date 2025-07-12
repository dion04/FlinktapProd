import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NoCodeProvidedProps {
    message: string;
    redirectUrl: string;
    redirectText: string;
}

export default function NoCodeProvided({ message, redirectUrl, redirectText }: NoCodeProvidedProps) {
    return (
        <>
            <Head title="No Code Provided" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <Card className="shadow-lg">
                        <CardHeader className="pb-4 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                <AlertCircle className="h-8 w-8 text-yellow-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">No Resolve Code Provided</CardTitle>
                            <CardDescription className="text-gray-600">{message}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-center">
                                <p className="text-sm text-gray-500">To create a profile, you need a valid resolve code. You can get one by:</p>
                                <ul className="space-y-1 text-left text-sm text-gray-500">
                                    <li>• Scanning an NFC card or QR code</li>
                                    <li>• Following a direct link with a code</li>
                                    <li>• Contact an administrator for a new code</li>
                                </ul>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Link href={redirectUrl}>
                                    <Button className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {redirectText}
                                    </Button>
                                </Link>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-400">Need help? Contact support for assistance.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
