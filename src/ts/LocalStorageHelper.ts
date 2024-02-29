export class LocalStorageHelper {
	constructor() {
		// console.log("LS created!");
	}

	setItem(code: string, value: Array<Product>): void {
		localStorage.setItem(code, JSON.stringify(value));
	}

	hasItem(code: string): boolean {
		return localStorage.getItem(code) !== null;
	}

	pushToItem(code: string, value: Product): void {
		const storageRawValue = localStorage.getItem(code);
		if (!storageRawValue) {
			throw new Error("Item is not exist");
		}
		const item = JSON.parse(storageRawValue);
		item.push(value);
		localStorage.setItem(code, JSON.stringify(item));
	}

	getItem(code: string): Array<Product> | null {
		const storageRawValue = localStorage.getItem(code);

		if (!storageRawValue) {
			return null;
		}

		return JSON.parse(storageRawValue);
	}
}
