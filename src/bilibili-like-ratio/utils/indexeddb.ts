// * --------------------------------

/** 浏览器本地 indexed db，数据统计用 */
const openDB = (dbName: string, tableName: string): Promise<IDBDatabase> =>
  new Promise((resolve) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;

      // * 检查是否已有该 store
      if (db.objectStoreNames.contains(tableName)) {
        resolve(db);
      } else {
        db.close();
        // * 没有则自动创建该表
        const newRequest = indexedDB.open(dbName, db.version + 1);
        newRequest.onupgradeneeded = (ev) => {
          // @ts-ignore
          ev.target.result.createObjectStore(tableName);
        };
        // @ts-ignore
        newRequest.onsuccess = (ev) => resolve(ev.target.result);
      }
    };
  });

// * --------------------------------

export const dbPutItem = async (dbName: string, tableName: string, key: string, value: any) =>
  new Promise(async (resolve) => {
    const db = await openDB(dbName, tableName);
    const tx = db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    store.put(value, key);
    tx.oncomplete = () => resolve(true);
  });

// * --------------------------------

export const dbGetAllItems = async <T>(dbName: string, tableName: string): Promise<T[]> =>
  new Promise(async (resolve) => {
    const db = await openDB(dbName, tableName);
    const tx = db.transaction(tableName, "readonly");
    tx.objectStore(tableName).getAll().onsuccess =
      // @ts-ignore
      (e) => resolve(e.target.result);
  });
