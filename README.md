# The interactive playground

[Chromatone](https://chromatone.center) audio-visual web-experience for [Touch Me](https://shop.playtronica.com/products/touchme) - the tactile MIDI instrument by [Playtronica](https://playtronica.com).

## How to play

- Open any [WebMIDI enabled browser](https://caniuse.com/?search=midi) on any device
- Connect a MIDI-controller via USB, Bluetooth or DIN to the device
- OR just use your desktop keyboard
- Play notes and collect stats
- Hold any note for 3 seconds to have scene change randomly.

## What to try

- **Swap scenes** with icon buttons to the left. Scenes change randomly after any note being held for over 3 seconds, or pressing Spacebar or Enter key.
- **Quantize notes** to 1/8, 1/16, 1/32 or free time with the bottom-left button.
- **Offset notes** by -2,-1,0,+1 or +2 octaves with a button above.
- **Change oscillator waveform** with a wave button. It will also help you shut any hang notes that may ocasionally appear.
- **Route MIDI** from inputs to outputs, both hardware or software
- **Monitor MIDI** in message log
- **Dark mode** - turn the lights on or off with a button to the top and left.
- **Stretch to fullscreen** with the toggle in the top-right corner

## How to contribute

### JS Stack

- [webmidi.js](https://webmidijs.org/docs/) provides access to MIDI
- [tone.js](https://tonejs.github.io) is used for audio synthesis and effects
- [vue 3](https://v3.vuejs.org/) the reactive components library
  - [vite](https://vitejs.dev/) - the fast build tool
  - [vueUse](https://vueuse.org) - composables to build upon
  - [unplugin-icons](https://github.com/antfu/unplugin-icons) - free svg icons to embed
    - [Icônes](https://icones.js.org/) - the free icon catalog
- [pug](https://pugjs.org/api/getting-started.html) - the neat version of HTML
- [windi css](https://windicss.org/) - the neat version of CSS

### App structure

- `public/` - the files to be copied to the root of the built site
- `src/` - the source code
  - `components/` - Vue 3 components ready to be auto-imported in any other component
  - `scenes/` - auto-parsed `vue-router` route components with `pug` flavoured svg code, that will be used inside the main `scene` svg
  - `use/` - all the composable and utility functions for the app logic
  - `app.vue` - the main scene SVG and overlays
  - `main.js` - the Vite app entry point

### How run and build the app locally

1. Clone this repo to your computer
2. Run `pnpm i` to install all project dependencies (You may need to [install pnpm](https://pnpm.io/installation) before)
3. Run the dev script with `pnpm run dev` and visit the localhost address for development and tests
4. Run the build script with `pnpm run build` and have the `dist` folder ready to upload to your static file web hosting.

### How to host it at your Github pages (with custom domain)

1. Read the [GitHub pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
2. Fork the repo
3. Change the line 4 in the `deploy.sh` file according to your repository address

```
git remote add origin git@github.com:YourGitHubAccount/touchme.git
```

4. Change the contents of `public/CNAME` file to match the subdomain you want the app to be accessible at
5. Run `pnpm run build` to build the app to `dist/` folder
6. Run the `pnpm run deploy` to upload the built site to the `gh-pages` branch of your repo
7. Go to your repository settings and configure the GitHub pages.
8. Add a CNAME DNS record for your subdomain to `<user>.github.io`
9. Enjoy your self-hosted version of the experience.
