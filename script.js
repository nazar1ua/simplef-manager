window.$ = require('jquery')

const { app, BrowserWindow } = require('@electron/remote')
const { shell } = require('electron')

const addressBar = require('./utils/addressBar')
const folderView = require('./utils/folderView')

let folder, address

window.about = () => {
   const aboutWindow = new BrowserWindow({
      resizable: false,
      show: true,
      width: 400,
      height: 150,
   })
   aboutWindow.removeMenu()

   aboutWindow.loadURL('file://' + app.getAppPath() + '/about.html')
}

function iconManage (el, set = false) {
   const elClasses = $(el).attr('class')
   if (!elClasses) return

   const elClass = elClasses.split(' ')[elClasses.split(' ').length - 1]

   setTimeout(() => {
      if (set) {
         $(el).removeClass(elClass).addClass(elClass + '-fill')
      } else {
         if (elClass.substring(elClass.length - 5) === '-fill') {
            $(el).removeClass(elClass).addClass(elClass.slice(0, -5))
         }
      }
   }, 75)
}

function addFillIcon () {
   iconManage(this, true)
}

function removeFillIcon () {
   iconManage(this, false)
}

const cd = (archor) => {
   $('#sidebar li a').removeClass('active')
   $('#sidebar i').each(removeFillIcon)

   $(archor).closest('li').find('a').addClass('active')
   $(archor).find('i').each(addFillIcon)

   setPath($(archor).attr('fm-path'))
}

const setPath = (path) => {
   if (!path) return

   if (path.indexOf('~') === 0) {
      path = path.replace('~', process.env.HOME)
   }

   folder.open(path)
   address.set(path)
}

window.addEventListener('DOMContentLoaded', () => {
   folder = new folderView.Folder($('#files'))
   address = new addressBar.AddressBar($('#address-bar'))

   folder.open(process.env.HOME)
   address.set(process.env.HOME)

   folder.on('navigate', (dir, mime) => {
      if (mime.type === 'folder') {
         address.enter(mime)
      } else {
         shell.openPath(mime.path)
      }
   })

   address.on('navigate', dir => {
      setPath(dir)
   })

   $('[fm-path]').on('click', function (e) {
      e.preventDefault()
      cd(this)
   })
})
