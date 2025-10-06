export type LocalStorageKey = "theme";

export type ThemeValue = "system" | "light" | "dark";
export type LocalStorageValue<T extends LocalStorageKey> = T extends "theme"
  ? ThemeValue
  : string;

class Wrapper implements Storage {
  public setItem<K extends LocalStorageKey, V extends LocalStorageValue<K>>(
    key: K,
    value: V,
  ): void {
    return localStorage.setItem(key, value);
  }

  public getItem<K extends LocalStorageKey, V extends LocalStorageValue<K>>(
    key: K,
  ): V | null {
    return localStorage.getItem(key) as V | null;
  }

  public removeItem(key: LocalStorageKey): void {
    return localStorage.removeItem(key);
  }

  public clear(): void {
    return localStorage.clear();
  }

  public get length(): number {
    return localStorage.length;
  }

  public key(index: number): LocalStorageKey | null {
    return localStorage.key(index) as LocalStorageKey | null;
  }
}

const localStorageWrapper = new Wrapper();

export default localStorageWrapper;
