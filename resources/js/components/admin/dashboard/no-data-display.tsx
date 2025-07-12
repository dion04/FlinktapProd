import { Activity } from 'lucide-react';

export function NoDataDisplay() {
    return (
        <div className="py-8 text-center">
            <div className="mb-4">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Activity className="h-6 w-6 text-amber-600" />
                </div>{' '}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Analytics Data Unavailable</h3>
                <p className="text-muted-foreground mb-4">Unable to load dashboard analytics. Please check your permissions and try again.</p>
                <div className="mt-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
}
