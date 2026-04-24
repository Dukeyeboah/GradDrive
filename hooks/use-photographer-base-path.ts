'use client';

/**
 * Photographer admin app always lives under `/photographer-admin`.
 */
const PHOTOGRAPHER_PREFIX = '/photographer-admin';

export function usePhotographerBasePath(): string {
  return PHOTOGRAPHER_PREFIX;
}
