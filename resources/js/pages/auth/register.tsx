import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm } from '@inertiajs/react';
import { Headphones, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    code?: string;
};

export default function Register({ code }: { code?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        code: code || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="" description="Sign Up & Setup your Digital Business Card">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="flex justify-center">
                    <div className="full-width bold flex items-center gap-2">
                        <b>Sign up with:</b>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-10"
                            onClick={() => (window.location.href = route('socialite.redirect', 'google'))}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {code && <input type="hidden" name="code" value={code} />}
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" className="mt-2 w-1/2 bg-blue-500" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </div>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink className="text-blue-500 hover:underline" href={route('login', code ? { code } : {})} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
                <div className="mt-4 text-center">
                    <Link href={route('contact.support')}>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="text-muted-foreground w-full rounded-2xl shadow-sm transition-shadow hover:shadow-md"
                            tabIndex={7}
                        >
                            <Headphones className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
