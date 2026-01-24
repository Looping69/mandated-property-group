import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

export const GlobalErrorHandler = () => {
    const { showToast } = useToast();

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            // Ignore subtle errors
            if (event.message?.includes('ResizeObserver')) return;

            console.error('Global Error:', event.error);
            showToast(
                event.error?.message || 'An unexpected error occurred. Please try again.',
                'error'
            );
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled Promise Rejection:', event.reason);

            // Extract readable message
            const message = event.reason?.message ||
                (typeof event.reason === 'string' ? event.reason : 'Network or server error');

            // Specifically handle CORS or Network errors
            if (message.includes('fetch') || message.includes('CORS') || message.includes('Failed to fetch')) {
                showToast('Connection error. Please check your internet or try again later.', 'error');
                return;
            }

            showToast(message, 'error');
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, [showToast]);

    return null;
};
