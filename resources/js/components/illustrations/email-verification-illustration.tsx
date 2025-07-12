export default function EmailVerificationIllustration({ className = 'w-64 h-64' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <circle cx="200" cy="150" r="120" fill="url(#emailBg)" opacity="0.1" />

            {/* Email envelope */}
            <rect x="120" y="120" width="160" height="120" rx="8" fill="url(#emailGradient)" stroke="url(#emailBorder)" strokeWidth="2" />

            {/* Email flap */}
            <path d="M120 128 L200 180 L280 128" stroke="url(#emailBorder)" strokeWidth="2" fill="none" strokeLinejoin="round" />

            {/* Email content lines */}
            <rect x="140" y="160" width="80" height="4" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="140" y="170" width="120" height="4" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="140" y="180" width="100" height="4" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="140" y="190" width="60" height="4" rx="2" fill="currentColor" opacity="0.3" />

            {/* Verification checkmark circle */}
            <circle cx="260" cy="100" r="25" fill="url(#checkBg)" stroke="#10b981" strokeWidth="3" />

            {/* Checkmark */}
            <path d="M250 100 L257 107 L270 94" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Floating particles */}
            <circle cx="100" cy="80" r="3" fill="#3b82f6" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="320" cy="200" r="2" fill="#8b5cf6" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="220" r="2.5" fill="#06b6d4" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* Email waves/lines */}
            <path d="M60 100 Q80 90 100 100 T140 100" stroke="url(#waveGradient)" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M260 220 Q280 210 300 220 T340 220" stroke="url(#waveGradient)" strokeWidth="2" fill="none" opacity="0.4" />

            <defs>
                {/* Gradients */}
                <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>

                <linearGradient id="emailBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                <linearGradient id="emailBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>

                <linearGradient id="checkBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>
        </svg>
    );
}
