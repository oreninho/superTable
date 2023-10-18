import {ICacheBehavior} from "./types";

class DataService implements ICacheBehavior {
    private _cacheBehavior?: ICacheBehavior;

    init(cacheBehavior: ICacheBehavior) {
        this._cacheBehavior = cacheBehavior;
    }

    get(key: string): Promise<string | null> {
        return this._cacheBehavior!.get(key);
    }

    set(key: string, value: string, ttl: number) {
        this._cacheBehavior!.set(key, value, ttl);
    }

    del(key: string) {
        this._cacheBehavior!.del(key);
    }

    clear() {
        this._cacheBehavior!.clear();
    }
}
export const dataService = new DataService();