let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('transactions', { autoIncrement: true }
    )
};

request.onerror = (event) => {
    console.log("Error!" + event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

function saveRecord(item) {
    const transaction = db.transaction(["storedItem"], "readwrite");
    const newStore = transaction.objectStore("storedItem");
    newStore.add(item);
};

function checkDatabase() {
    const transaction = db.transaction(["storedItem"], "readwrite");
    const newStore = transaction.objectStore("storedItem");
    constgetAll = newStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["storedItem"], "readwrite");
                const newStore = transaction.objectStore("storedItem");
                newStore.clear();
            })
        }
    }
};

window.addEventListener('online', checkDatabase);