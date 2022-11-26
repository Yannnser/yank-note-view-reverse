import { registerPlugin } from '@yank-note/runtime-api'

const extensionName = __EXTENSION_ID__
const STORAGE_VIEW_KEY = __EXTENSION_ID__ + '.' + 'ysViewReverse'
const STORAGE_SIDEBAR_KEY = __EXTENSION_ID__ + '.' + 'ysSidebarReverse'

registerPlugin({
  name: extensionName,
  register: async (ctx) => {
    const viewReverseCode = `
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
    const sidebarReverseCode = `
      .main {
        flex-direction: row-reverse;
        overflow: hidden;
      }

      .sash-right {
        left: 0 !important;
        right: auto !important;
      }
    `

    let viewStyle: HTMLStyleElement | null = null
    let sidebarStyle: HTMLStyleElement | null = null

    async function switchViewStyle () {
      if (viewStyle) {
        viewStyle.remove()
        viewStyle = null
      } else {
        viewStyle = await ctx.theme.addStyles(viewReverseCode)
      }

      ctx.storage.set(STORAGE_VIEW_KEY, !!viewStyle)
      ctx.statusBar.refreshMenu()
    }

    async function switchSidebarStyle () {
      if (sidebarStyle) {
        sidebarStyle.remove()
        sidebarStyle = null
      } else {
        sidebarStyle = await ctx.theme.addStyles(sidebarReverseCode)
      }

      ctx.storage.set(STORAGE_SIDEBAR_KEY, !!sidebarStyle)
      ctx.statusBar.refreshMenu()
    }

    if (ctx.storage.get(STORAGE_VIEW_KEY, false)) {
      switchViewStyle()
    }

    if (ctx.storage.get(STORAGE_SIDEBAR_KEY, false)) {
      switchSidebarStyle()
    }

    ctx.statusBar.tapMenus((menus) => {
      menus['status-bar-view'].list?.push({
        id: 'toggle-view-reverse',
        type: 'normal',
        checked: !!viewStyle,
        title: '编辑器/预览翻转',
        onClick: switchViewStyle,
      },
      {
        id: 'toggle-sidebar-reverse',
        type: 'normal',
        checked: !!sidebarStyle,
        title: '侧边栏/内容区翻转',
        onClick: switchSidebarStyle,
      })
    })
  },
})
