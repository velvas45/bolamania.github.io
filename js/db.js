const dbPromised = idb.open("bola-mania", 1, function (upgradeDb) {
  const favoritesObjectStore = upgradeDb.createObjectStore("favorites", {
    keyPath: "id",
  });
  favoritesObjectStore.createIndex("name", "name", {
    unique: false,
  });
});

function saveTeamFavorite(data) {
  dbPromised
    .then(function (db) {
      const tx = db.transaction("favorites", "readwrite");
      const store = tx.objectStore("favorites");
      store.put(data);
      return tx.complete;
    })
    .then(function () {
      console.log("Data berhasil di simpan.");
    });
}

function getData() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        const tx = db.transaction("favorites", "readonly");
        const store = tx.objectStore("favorites");
        return store.getAll();
      })
      .then(function (favorites) {
        resolve(favorites);
      });
  });
}

function getTeamById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        const tx = db.transaction("favorites", "readonly");
        const store = tx.objectStore("favorites");
        return store.get(parseInt(id));
      })
      .then(function (favorites) {
        if (favorites !== undefined) {
          resolve(favorites);
        } else {
          resolve(false);
        }
      });
  });
}

function deleteById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        const tx = db.transaction("favorites", "readwrite");
        const store = tx.objectStore("favorites");
        store.delete(parseInt(id));
        return tx.complete;
      })
      .then(function () {
        resolve(true);
      });
  });
}
