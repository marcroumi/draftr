import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args))
  },
  exportPdf: (html: string, filename: string) =>
    ipcRenderer.invoke('export-pdf', html, filename),
  db: {
    list:      ()                              => ipcRenderer.invoke('db:proposals:list'),
    get:       (id: string)                   => ipcRenderer.invoke('db:proposals:get', id),
    upsert:    (payload: unknown)             => ipcRenderer.invoke('db:proposals:upsert', payload),
    delete:    (id: string)                   => ipcRenderer.invoke('db:proposals:delete', id),
    duplicate: (id: string)                   => ipcRenderer.invoke('db:proposals:duplicate', id),
    rename:    (id: string, title: string)    => ipcRenderer.invoke('db:proposals:rename', id, title),
  },
})
