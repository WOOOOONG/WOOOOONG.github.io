import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { Content } from 'vitepress'
import type { Theme } from 'vitepress'
import './style.css'

import Prompt from './components/Prompt.vue'
import Neofetch from './components/Neofetch.vue'
import AsciiBanner from './components/AsciiBanner.vue'
import LsOutput from './components/LsOutput.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h('div', { class: 'VPPage' }, [h(Content)])
    })
  },
  enhanceApp({ app }) {
    app.component('Prompt', Prompt)
    app.component('Neofetch', Neofetch)
    app.component('AsciiBanner', AsciiBanner)
    app.component('LsOutput', LsOutput)
  }
} satisfies Theme
