import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'

import Pages from "vite-plugin-pages";
import { extendRoutes } from "vitepress-pages";
import generateSitemap from 'vite-plugin-pages-sitemap'


export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL(".vitepress", import.meta.url)),
    },
  },
  plugins: [
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue\??/, // .vue
      ],
      imports: [
        'vue',
        {
          '@vueuse/core': ['useStorage', 'useClamp'],
        },
      ],
    }),
    Pages({
      dirs: [
        { dir: ".", baseRoute: "." },
      ],
      exclude: ['**/node_modules/**/*.*', '**/!(index).md'],
      extensions: ['md'],
      ...extendRoutes({
        mediaTypes: {
          cover: { size: 1200, height: 800, fit: "inside" },
        }
      }),
      onRoutesGenerated: routes => (generateSitemap({ routes, hostname: 'https://touchme.chromatone.center' })),
    }),
    Components({
      dirs: ['.vitepress/theme/components'],
      extensions: ['vue', 'ts', 'js'],
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      exclude: [/node_modules/, /\.git/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Icons({
      defaultStyle: 'vertical-align: middle;',
    }),
    WindiCSS({
      scan: {
        dirs: ['./', '.vitepress'],
        include: ['index.md'],
        exclude: ['**/examples/**/*', '/node_modules/'],
        fileExtensions: ['vue', 'ts', 'md'],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'TouchMe experience',
        short_name: 'Journey to the music of touch',
        description: 'Playtronica and Chromatone collaboration',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'apple-touch-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    }),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'tone', '@tonaljs/tonal', 'colord'],
  },
  //@ts-ignore
  ssr: {
    noExternal: ['tone']
  },
})
