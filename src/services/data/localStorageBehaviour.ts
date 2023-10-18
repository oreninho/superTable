import {ICacheBehavior} from "./types";

export class LocalStorageBehaviour implements ICacheBehavior{

    async get(key: string): Promise<string | null> {
        console.log('LocalStorageBehaviour get', key);
        return localStorage.getItem(key);
    }

    set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    del(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

