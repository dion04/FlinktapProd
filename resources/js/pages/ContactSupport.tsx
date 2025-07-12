import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Headphones, Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactSupport() {
    // Function to handle phone call
    const handleCall = () => {
        window.location.href = 'tel:+1234567890'; // Replace with actual support phone number
    };

    // Function to handle messaging
    const handleMessage = () => {
        // Replace with actual support phone number
        const phoneNumber = '+1234567890';
        const userAgent = navigator.userAgent || navigator.vendor;

        if (/android/i.test(userAgent)) {
            window.location.href = `sms:${phoneNumber}`;
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            window.location.href = `sms:${phoneNumber}`;
        } else {
            // Desktop fallback to WhatsApp Web
            window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`, '_blank');
        }
    };

    // Function to handle email
    const handleEmail = () => {
        window.location.href = 'mailto:support@flinktap.com?subject=Support Request';
    };

    return (
        <>
            <Head title="Contact Support - FlinkTap" />

            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-md">
                    {/* Go Back Button */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                    </div>

                    {/* Blue Headphones Icon */}
                    <div className="mb-6 flex justify-center">
                        <Headphones className="h-20 w-20 text-blue-500" />
                    </div>

                    {/* Contact Support Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-4 text-2xl font-bold text-gray-800">Contact Support</h1>
                        <p className="text-gray-600">You can directly contact us</p>
                    </div>

                    {/* Contact Action Buttons */}
                    <div className="mb-8 flex gap-4">
                        <div className="flex w-full flex-col items-center" onClick={handleCall}>
                            <Button
                                className="flex h-24 w-24 items-center justify-center bg-white shadow-md hover:bg-gray-50 hover:shadow-lg"
                                variant="outline"
                            >
                                <Phone className="text-blue-500" style={{ width: '42px', height: '42px' }} />
                            </Button>
                            <span className="mt-2 text-lg font-medium text-gray-800">Call</span>
                        </div>

                        <div className="flex w-full flex-col items-center" onClick={handleMessage}>
                            <Button
                                className="flex h-24 w-24 items-center justify-center bg-white shadow-md hover:bg-gray-50 hover:shadow-lg"
                                variant="outline"
                            >
                                <MessageCircle className="text-blue-500" style={{ width: '42px', height: '42px' }} />
                            </Button>
                            <span className="mt-2 text-lg font-medium text-gray-800">Message</span>
                        </div>

                        <div className="flex w-full flex-col items-center" onClick={handleEmail}>
                            <Button
                                className="flex h-24 w-24 items-center justify-center bg-white shadow-md hover:bg-gray-50 hover:shadow-lg"
                                variant="outline"
                            >
                                <Mail className="text-blue-500" style={{ width: '42px', height: '42px' }} />
                            </Button>
                            <span className="mt-2 text-lg font-medium text-gray-800">Email</span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8 space-y-4 text-center text-gray-600">
                        <p className="font-medium">Or contact us at:</p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+1 (234) 567-8900</span>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>Text: +1 (234) 567-8900</span>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>support@flinktap.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Website Footer */}
                    <div className="text-center">
                        <a
                            href="https://www.flinktap.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            www.flinktap.com
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
