# vite-plugin-esm-to-systemjs

A Vite plugin that transforms ESM output to SystemJS format.

[![npm version](https://img.shields.io/npm/v/vite-plugin-esm-to-systemjs)](https://www.npmjs.com/package/vite-plugin-esm-to-systemjs)
[![license](https://img.shields.io/npm/l/vite-plugin-esm-to-systemjs)](LICENSE)

## 📋 Overview

`vite-plugin-esm-to-systemjs` is a Vite plugin that converts ECMAScript modules (ESM) output to [SystemJS](https://github.com/systemjs/systemjs) format.

### Why do you need this plugin?

Starting with Vite 8, the `system` output format was deprecated, leaving developers who need to generate SystemJS format bundles without native support. This plugin solves that problem by using [Babel](https://babeljs.io/) to automatically transform modules during the build phase.

**Common use cases:**
- Micro frontend applications using SystemJS as a module loader
- Legacy projects that depend on SystemJS format
- Environments that require dynamic module loading

## 🚀 Installation

```bash
# With pnpm (recommended)
pnpm add -D vite-plugin-esm-to-systemjs

# With npm
npm install --save-dev vite-plugin-esm-to-systemjs

# With yarn
yarn add --dev vite-plugin-esm-to-systemjs
```

## 📖 Basic Usage

### 1. Configure in `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginEsmToSystemjs } from 'vite-plugin-esm-to-systemjs'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginEsmToSystemjs(),
  ],
  build: {
    // Recommended configuration
    rollupOptions: {
      output: {
        format: 'es', // Modules will be output as ESM before being transformed
      }
    }
  }
})
```

### 2. Build your project

```bash
pnpm build
```

The plugin will automatically transform all ESM chunks to SystemJS format during the build.

## 💡 Practical Examples

### Example 1: Vue.js Application

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginEsmToSystemjs } from 'vite-plugin-esm-to-systemjs'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginEsmToSystemjs(),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  }
})
```

After compiling, your JavaScript files will be in SystemJS format and can be loaded with:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/systemjs@6/dist/system.js"></script>
  <script>
    System.import('./dist/main.js')
  </script>
</head>
<body></body>
</html>
```

### Example 2: Micro Frontend with single-spa

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePluginEsmToSystemjs } from 'vite-plugin-esm-to-systemjs'

export default defineConfig({
  plugins: [
    react(),
    vitePluginEsmToSystemjs(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyMicroApp',
      fileName: (format) => `my-micro-app.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

### Example 3: Angular Application

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { vitePluginEsmToSystemjs } from 'vite-plugin-esm-to-systemjs'

export default defineConfig({
  plugins: [
    vitePluginEsmToSystemjs(),
  ],
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      }
    }
  }
})
```

## 🔧 How It Works

The plugin:

1. **Applies after the main build** (`enforce: 'post'`) - ensures other plugins process first
2. **Transforms each chunk** during the rendering phase (`renderChunk`)
3. **Uses Babel** with the following plugins:
   - `@babel/plugin-transform-dynamic-import` - transforms dynamic `import()` calls
   - `@babel/plugin-transform-modules-systemjs` - transforms ESM modules to SystemJS
4. **Preserves source maps** for production debugging

## ⚙️ Configuration Options

The plugin uses Babel's default configuration:

- **Module format**: ESM → SystemJS
- **Source maps**: Enabled
- **Compact**: Disabled (more readable code)

## 📝 Requirements

- **Vite**: >= 5.0.0
- **Node.js**: >= 16.0.0

## 🤝 Dependencies

```json
{
  "@babel/core": "^7.29.7",
  "@babel/plugin-transform-dynamic-import": "^7.29.7",
  "@babel/plugin-transform-modules-systemjs": "^7.29.7"
}
```

## 🐛 Troubleshooting

### Files are still ESM after build

Make sure:
- The plugin is included in `vite.config.ts`
- The output format in `rollupOptions` is `'es'`
- You ran `pnpm build` (not just `pnpm dev`)

### Babel transformation errors

Verify that:
- You have the correct dependencies installed
- Your JavaScript code is valid
- You're not using syntax that Babel cannot transform

### Source maps not generated

Make sure your build configuration includes `sourcemap: true`:

```typescript
build: {
  sourcemap: true,
  rollupOptions: {
    output: {
      format: 'es'
    }
  }
}
```

## 📚 References

- [SystemJS Documentation](https://github.com/systemjs/systemjs)
- [Babel Documentation](https://babeljs.io/)
- [Vite Documentation](https://vitejs.dev/)
- [single-spa Documentation](https://single-spa.js.org/) - for micro frontends

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) for more details.

## 👤 Author

Alberto Cristancho

## 📦 Publishing

This package is available on [npm](https://www.npmjs.com/package/vite-plugin-esm-to-systemjs).

---

Found it useful? Consider leaving a ⭐ on [GitHub](https://github.com/AjCu/vite-plugin-esm-to-systemjs)
