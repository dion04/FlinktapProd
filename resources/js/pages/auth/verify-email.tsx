// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

import EmailVerificationIllustration from '@/components/illustrations/email-verification-illustration';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify your email" description="">
            <Head title="Email verification" />

            <div className="animate-in fade-in-0 slide-in-from-bottom-4 space-y-2 duration-500">
                {/* Illustration */}
                <div className="animate-in fade-in-0 slide-in-from-top-4 flex justify-center delay-200 duration-700">
                    <EmailVerificationIllustration className="h-36 w-48 text-slate-600" />
                </div>

                {/* Main content */}
                <Card className="animate-in fade-in-0 slide-in-from-bottom-4 border-0 bg-transparent shadow-none delay-300 duration-700">
                    <CardContent className="space-y-6 p-0">
                        {/* Status message */}
                        {status === 'verification-link-sent' && (
                            <div className="animate-in fade-in-0 slide-in-from-top-4 relative duration-500">
                                <div className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-r from-green-50 to-emerald-50"></div>
                                <div className="relative rounded-lg border border-green-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="rounded-full bg-green-100 p-1">
                                                <Shield className="h-4 w-4 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-green-800">
                                            <p className="mb-1 font-semibold">Verification link sent!</p>
                                            <p className="text-green-700">
                                                A new verification link has been sent to your email address. Please check your inbox and spam folder.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1 text-center">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
                                <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-600">
                                    Click the verification link in the email we sent you to complete your account setup. The link will expire in 24
                                    hours.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <Button
                                disabled={processing}
                                variant="outline"
                                className="h-11 w-full font-medium transition-all duration-200 hover:scale-[1.02] hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Sending...' : 'Resend verification email'}
                            </Button>

                            <div className="text-center">
                                <TextLink
                                    href={route('logout')}
                                    method="post"
                                    className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700"
                                >
                                    Sign out
                                </TextLink>
                            </div>
                        </form>

                        <div className="border-t border-gray-100 pt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Didn't receive the email? Check your spam folder or try resending the verification link.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
