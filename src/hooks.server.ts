import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
    return resolve(event, {
        transformPageChunk: ({ html }) => {
            const theme =
                env.PUBLIC_DARKMODE === 'true'
                    ? 'dark'
                    : env.PUBLIC_DARKMODE === 'false'
                        ? 'light'
                        : '';

            if (!theme) return html;

            return html.replace(
                '<html',
                `<html class="${theme}"`
            );
        }
    });
};