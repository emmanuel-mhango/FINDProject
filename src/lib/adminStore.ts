const DB_NAME = "find-admin"
const DB_VERSION = 1
const STORE_NAME = "kv"

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

const setValue = async (key: string, value: unknown) => {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    store.put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

const getValue = async <T,>(key: string, fallback: T) => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => {
      resolve((request.result as T) ?? fallback)
    }
    request.onerror = () => reject(request.error)
  })
}

export const getAdminHomes = () => getValue<any[]>("adminHomes", [])
export const setAdminHomes = (homes: any[]) => setValue("adminHomes", homes)
