import { transformAsync } from '@babel/core';
import type { Plugin } from 'vite';

/**
 * Vite plugin that transforms ESM output to SystemJS format using Babel.
 * This is needed because Vite 8 deprecated the 'system' output format.
 * The plugin runs during the build phase and converts each chunk from
 * ES modules to SystemJS via @babel/plugin-transform-modules-systemjs.
 */
export function vitePluginEsmToSystemjs(): Plugin {
	return {
		name: 'vite-plugin-esm-to-systemjs',
		apply: 'build',
		enforce: 'post',
		async renderChunk(code, chunk) {
			const result = await transformAsync(code, {
				plugins: [
					'@babel/plugin-transform-dynamic-import',
					'@babel/plugin-transform-modules-systemjs',
				],
				filename: chunk.fileName,
				sourceMaps: true,
				compact: false,
			});

			if (!result?.code) {
				return null;
			}

			return {
				code: result.code,
				map: result.map ?? undefined,
			};
		},
	};
}
