const LOCAL_HOST_PATTERNS = ['localhost', '127.0.0.1', '192.168.', '172.19.'];

const isLocalHost = typeof window !== 'undefined'
    && LOCAL_HOST_PATTERNS.some((host) => window.location.hostname.startsWith(host));

export const API_BASE_URL = isLocalHost
    ? '/api'
    : 'https://makeup-appointment-app-backend.onrender.com/api';

const REMOTE_API_BASE_URL = 'https://makeup-appointment-app-backend.onrender.com/api';

const mergeSignals = (externalSignal, internalSignal) => {
    if (externalSignal && typeof AbortSignal !== 'undefined' && AbortSignal.any) {
        return AbortSignal.any([externalSignal, internalSignal]);
    }
    return externalSignal || internalSignal;
};

const buildRequestOptions = (options, signal) => ({
    ...options,
    signal,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers,
    },
});

export async function apiFetch(path, options = {}, config = {}) {
    const { timeoutMs = 10000 } = config;
    const bases = isLocalHost ? ['/api', REMOTE_API_BASE_URL] : [REMOTE_API_BASE_URL];
    let lastError = null;

    for (const base of bases) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const signal = mergeSignals(options.signal, controller.signal);

        try {
            const response = await fetch(
                `${base}${path}`,
                buildRequestOptions(options, signal)
            );

            clearTimeout(timeoutId);

            if (response.status >= 500 && base !== bases[bases.length - 1]) {
                continue;
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;

            if (base === bases[bases.length - 1]) {
                throw error;
            }
        }
    }

    throw lastError || new Error('API request failed');
}
