/**
 * Get the site URL for email redirects
 * This ensures we always have the correct URL for different environments
 */
export function getSiteUrl(): string {
    // For server-side rendering, we need to use the environment variable
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    }

    // For client-side, prefer the environment variable but fallback to window.location.origin
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

/**
 * Get the full redirect URL for authentication
 */
export function getAuthRedirectUrl(path: string = '/protected'): string {
    const baseUrl = getSiteUrl();
    return `${baseUrl}${path}`;
}
