import { registerPlugin } from '@yank-note/runtime-api'

const extensionName = __EXTENSION_ID__

registerPlugin({
  name: extensionName,
  register: (ctx) => {
    if (localStorage.getItem('ysIsReverse') == null) {
      localStorage.setItem('ysIsReverse', String(0))
    }
    let ysIsReverse = Number(localStorage.getItem('ysIsReverse'))
    const toReverseCode = '.content{flex-direction:row-reverse}.sash-left{left:auto !important;right:0 !important}div.content > div.preview{transform:translateX(0)}.markdown-view .scroll-to-top{bottom:40px !important}.markdown-view .markdown-body .custom-container.group .group-item-radio{display:none}'
    const recoveredCode = '.content{flex-direction:initial}.sash-left{left:initial !important;right:initial !important}div.content > div.preview{transform:initial}.markdown-view .scroll-to-top{bottom:initial !important}.markdown-view .markdown-body .custom-container.group .group-item-radio{display:initial}'

    function loadCssCode (code) {
      const style = document.createElement('style')
      style.type = 'text/css'
      style.rel = 'stylesheet'
      style.appendChild(document.createTextNode(code))
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(style)
    }

    loadCssCode(ysIsReverse ? toReverseCode : recoveredCode)

    ctx.statusBar.tapMenus((menus) => {
      menus['plugin-view-reverse'] = {
        id: 'plugin-view-reverse',
        position: 'left',
        tips: '预览和编辑翻转',
        title: '翻转',
        onClick: () => {
          ysIsReverse = Number(!ysIsReverse)
          localStorage.setItem('ysIsReverse', String(ysIsReverse))
          loadCssCode(ysIsReverse ? toReverseCode : recoveredCode)
        },
      }
    })
  },
})
