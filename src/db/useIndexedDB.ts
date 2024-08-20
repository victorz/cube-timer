async function addData<T>(
  db: IDBDatabase,
  storeName: string,
  data: T,
  oncomplete?: (e: Event) => any
): Promise<unknown> {
  const transaction = db.transaction(storeName, 'readwrite')
  transaction.oncomplete = oncomplete ?? null
  transaction.onerror = (e: Event) => {
    throw new Error('could not complete transaction:' + e)
  }

  const request = transaction.objectStore(storeName).add(data)

  return new Promise((resolve, reject) => {
    request.onsuccess = resolve
    request.onerror = reject
    transaction.onabort = reject
  })
}

export function useIndexedDB<T = any>(
  dbId: string,
  storeName: string,
  version = 1
): {
  addData: (storeName: string, data: T) => Promise<unknown>
} {
  const dbRequest = indexedDB.open(dbId, version)

  let db: IDBDatabase

  dbRequest.onsuccess = () => {
    db = dbRequest.result

    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName)
    }
  }

  dbRequest.onupgradeneeded = (event) => {
    db = dbRequest.result
    db.createObjectStore(storeName, { autoIncrement: true })
  }

  dbRequest.onerror = () => {
    throw new Error('could not create database')
  }

  return { addData: (storeName: string, data: T) => addData(db, storeName, data) }
}
