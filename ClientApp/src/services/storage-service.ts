import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  async get<T = string>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },

  async has(key: string): Promise<boolean> {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  },

  async getMultiple<T = string>(keys: string[]): Promise<Record<string, T | null>> {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};

    for (const [key, value] of pairs) {
      if (value === null) {
        result[key] = null;
        continue;
      }
      try {
        result[key] = JSON.parse(value) as T;
      } catch {
        result[key] = value as T;
      }
    }

    return result;
  },
};
