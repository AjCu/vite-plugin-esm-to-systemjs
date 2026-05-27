import { describe, it, expect } from 'vitest';
import { vitePluginEsmToSystemjs } from '../src/index';

describe('vitePluginEsmToSystemjs', () => {
	it('should return a plugin object with correct name', () => {
		const plugin = vitePluginEsmToSystemjs();
		expect(plugin.name).toBe('vite-plugin-esm-to-systemjs');
	});

	it('should apply only during build', () => {
		const plugin = vitePluginEsmToSystemjs();
		expect(plugin.apply).toBe('build');
	});

	it('should enforce post order', () => {
		const plugin = vitePluginEsmToSystemjs();
		expect(plugin.enforce).toBe('post');
	});

	it('should have a renderChunk hook', () => {
		const plugin = vitePluginEsmToSystemjs();
		expect(plugin.renderChunk).toBeTypeOf('function');
	});

	describe('renderChunk', () => {
		it('should transform ESM export to SystemJS format', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `export const foo = 'bar';`;
			const chunk = { fileName: 'test.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.code).toContain('System.register');
			expect(result.code).not.toContain('export const');
		});

		it('should transform ESM import to SystemJS format', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `import { something } from './other';\nconsole.log(something);`;
			const chunk = { fileName: 'test.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.code).toContain('System.register');
			expect(result.code).toContain('./other');
		});

		it('should transform dynamic imports', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `export const load = () => import('./lazy');`;
			const chunk = { fileName: 'test.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.code).toContain('System.register');
			expect(result.code).toContain('./lazy');
		});

		it('should include source map when transformation succeeds', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `export default function hello() { return 'world'; }`;
			const chunk = { fileName: 'hello.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.map).toBeDefined();
		});

		it('should handle re-exports', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `export { default as foo } from './foo';`;
			const chunk = { fileName: 'index.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.code).toContain('System.register');
		});

		it('should preserve the filename in transformation', async () => {
			const plugin = vitePluginEsmToSystemjs();
			const renderChunk = plugin.renderChunk as Function;

			const esmCode = `export const x = 1;`;
			const chunk = { fileName: 'my-module.js' };

			const result = await renderChunk.call({}, esmCode, chunk);

			expect(result).not.toBeNull();
			expect(result.map).toBeDefined();
			expect(result.map.sources).toContain('my-module.js');
		});
	});
});
