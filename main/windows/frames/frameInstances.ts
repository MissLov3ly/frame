import electron, { BrowserView, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron'
import path from 'path'

import { createWindow } from '../window'
import topRight from './topRight'
import store from '../../store'

import { Workspace, Nav, View } from '../workspace/types'

const isDev = process.env.NODE_ENV === 'development'

export interface FrameInstance extends BrowserWindow {
  frameId?: string
  views?: Record<string, BrowserView>
  overlays?: Record<string, BrowserView>
  overlay?: BrowserView
  showingView?: string
}

const place = (frameInstance: FrameInstance) => {
  const area = electron.screen.getDisplayNearestPoint(electron.screen.getCursorScreenPoint()).workArea
  const height = area.height - 160
  const maxWidth = Math.floor(height * 1.24)
  const targetWidth = area.width - 460
  const width = targetWidth > maxWidth ? maxWidth : targetWidth
  frameInstance.setMinimumSize(400, 300)
  frameInstance.setSize(width, height)
  const pos = topRight(frameInstance)
  frameInstance.setPosition(pos.x - 440, pos.y + 80)
}

export default {
  reposition: (frameInstance: FrameInstance) => {
    place(frameInstance)
  },
  create: (frame: Workspace) => {
    const frameInstance: FrameInstance = createWindow('frameInstance', {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      // titleBarStyle: 'hidden',
      // trafficLightPosition: { x: 20, y: 23 },
      icon: path.join(__dirname, './AppIcon.png')
    })

    // frameInstance.webContents.openDevTools({ mode: 'detach' })

    frameInstance.loadURL(
      isDev
        ? 'http://localhost:1234/workspace/index.dev.html'
        : `file://${process.env.BUNDLE_LOCATION}/workspace.html`
    )

    frameInstance.on('ready-to-show', () => {
      frameInstance.show()
    })

    frameInstance.showingView = ''
    frameInstance.frameId = frame.id
    frameInstance.views = {}

    // const template: MenuItemConstructorOptions[] = [
    //   {
    //     label: 'File',
    //     submenu: [{ role: 'quit' }]
    //   }
    // ]

    // const menu = Menu.buildFromTemplate(template)

    // frameInstance.on('blur', () => {
    //   // Menu.setApplicationMenu(null)
    //   // Menu.setApplicationMenu(emptyMenu)
    // })

    // frameInstance.on('focus', () => {
    //    Show menu on macOS
    // })

    frameInstance.on('resize', () => {
      // TODO: reflect correct state of dock
      const { width, height } = frameInstance.getBounds()
      if (frameInstance?.overlays?.dock) {
        frameInstance.overlays.dock.setBounds({
          y: height - 128 - 8,
          x: -200,
          width: width + 400,
          height: 128 + 8
        })
      }

      if (frameInstance?.overlays?.ribbon) {
        frameInstance.overlays.ribbon.setBounds({
          y: 0,
          x: -200,
          width: width + 400,
          height: 50
        })
      }

      Object.values(frameInstance.views || {}).forEach((viewInstance) => {
        const { frameId } = frameInstance
        // const { fullscreen } = store('windows.workspaces', frameId)

        viewInstance.setBounds({
          y: 56,
          x: 4,
          width: width - 4 - 4,
          height: height - 128 - 16
        })
      })
    })

    place(frameInstance)

    return frameInstance
  }
}
