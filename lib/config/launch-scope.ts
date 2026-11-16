// Keep paused experiences out of navigation while preserving their implementation.
export const PAUSED_PATHS = ['/dashboard/scholarship', '/dashboard/alum-club', '/dashboard/discounts'];
export const isPausedPath = (href: string) => PAUSED_PATHS.some(path => href === path || href.startsWith(`${path}/`));
