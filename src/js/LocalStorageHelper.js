export class LocalStorageHelper {
    constructor() {
        // console.log("LS created!");
    }

    setItem(code, value) {
        localStorage.setItem(code, JSON.stringify(value));
    }

    hasItem(code) {
        return localStorage.getItem(code) !== null;
    }

    pushToItem(code, value) {
        const item = JSON.parse(localStorage.getItem(code) || []);
        item.push(value);
        localStorage.setItem(code, JSON.stringify(item));
    }

    getItem(code) {
        return JSON.parse(localStorage.getItem(code));
    }
}

