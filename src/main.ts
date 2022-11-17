import { registerPlugin } from '@yank-note/runtime-api'

const extensionName = __EXTENSION_ID__

registerPlugin({
  name: extensionName,
  register: async (ctx) => {
    let ysViewReverse = Boolean(ctx.storage.get('ysViewReverse', false))

    const toReverseCode =
      '.content{flex-direction:row-reverse}.sash-left{left:auto !important;right:0 !important}div.content > div.preview{transform:translateX(0)}.markdown-view .scroll-to-top{bottom:40px !important}.markdown-view .markdown-body .custom-container.group .group-item-radio{display:none}'

    let style
    async function addStyle () {
      if (!ysViewReverse) {
        style.remove()
        return
      }
      style = await ctx.theme.addStyles(toReverseCode)
    }

    addStyle()

    ctx.statusBar.tapMenus((menus) => {
      menus['status-bar-view'].list?.push({
        id: 'toggle-view-reverse',
        type: 'normal',
        checked: ysViewReverse,
        title: '编辑器/预览翻转',
        onClick: () => {
          ysViewReverse = !ysViewReverse
          ctx.storage.set('ysViewReverse', ysViewReverse)
          ctx.statusBar.refreshMenu()
          addStyle()
        },
      })
    })
  },
})
