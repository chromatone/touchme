const config = {
  title: "TouchMe experience",
  description: "Playtronica & Chromatone collaboration",
  lang: "en",
  head: [

  ],
  themeConfig: {
    logo: 'favicon.svg',
    icon: 'apple-touch-icon.png',
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-external-links'), {
        internalDomains: ['localhost', 'touchme.chromatone.center'],
      })
    },
  },
}

export default config
