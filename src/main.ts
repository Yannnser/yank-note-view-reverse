import { registerPlugin } from '@yank-note/runtime-api'

const extensionName = __EXTENSION_ID__
const STORAGE_KEY = __EXTENSION_ID__ + '.' + 'ysViewReverse'

registerPlugin({
  name: extensionName,
  register: async (ctx) => {
    const toReverseCode = `
      .content {
        flex-direction: row-reverse;
      }

      .sash-left {
        left: auto !important;
        right: 0 !important
      }

      div.content > div.preview {
        transform: translateX(0)
      }

      .markdown-view .scroll-to-top {
        bottom:40px !important
      }

      .markdown-view .markdown-body .custom-container.group .group-item-radio {
        display: none
      }
    `

    let style: HTMLStyleElement | null = null

    async function switchStyle () {
      if (style) {
        style.remove()
        style = null
      } else {
        style = await ctx.theme.addStyles(toReverseCode)
      }

      ctx.storage.set(STORAGE_KEY, !!style)
      ctx.statusBar.refreshMenu()
    }

    if (ctx.storage.get(STORAGE_KEY, false)) {
      switchStyle()
    }

    ctx.statusBar.tapMenus((menus) => {
      menus['status-bar-view'].list?.push({
        id: 'toggle-view-reverse',
        type: 'normal',
        checked: !!style,
        title: '编辑器/预览翻转',
        onClick: switchStyle,
      })
    })
  },
})
