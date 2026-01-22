const DB_NAME = "find-media"
const DB_VERSION = 1
const STORE_NAME = "images"

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const dataUrlToBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl)
  return response.blob()
}

export const saveImages = async (homeId: string, dataUrls: string[]) => {
  const db = await openDb()
  const keys: string[] = []
  await Promise.all(
    dataUrls.map(async (dataUrl, index) => {
      const key = `${homeId}_${Date.now()}_${index}`
      const blob = await dataUrlToBlob(dataUrl)
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite")
        const store = tx.objectStore(STORE_NAME)
        store.put(blob, key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      keys.push(key)
    })
  )
  return keys
}

export const getImageUrl = async (key: string) => {
  if (key.startsWith("data:image/")) {
    return key
  }
  const db = await openDb()
  return new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => {
      const blob = request.result as Blob | undefined
      resolve(blob ? URL.createObjectURL(blob) : null)
    }
    request.onerror = () => reject(request.error)
  })
}

export const deleteImages = async (keys: string[]) => {
  if (!keys.length) return
  const db = await openDb()
  await Promise.all(
    keys.map(
      (key) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite")
          const store = tx.objectStore(STORE_NAME)
          store.delete(key)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
    )
  )
}
