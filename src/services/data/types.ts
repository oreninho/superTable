export interface ICacheBehavior {
    get(key: string): Promise<string|null>;
    set(key: string, value: string, ttl: number): void;
    del(key: string): void;
    clear(): void;

}