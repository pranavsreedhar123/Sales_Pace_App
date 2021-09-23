import EncryptedStorage from 'react-native-encrypted-storage';
import {StorageValueType} from '../types/StorageValueType';

export namespace AppSecuredStorage {
  export const getItem = async (
    key: string,
    valueType?: StorageValueType,
  ): Promise<string | unknown> => {
    try {
      const val = await EncryptedStorage.getItem(key);
      return valueType === StorageValueType.OBJECT
        ? JSON.parse(val || '')
        : val;
    } catch (e) {
      return undefined;
    }
  };

  export const setItem = async (
    key: string,
    val: string | unknown,
  ): Promise<string | unknown> => {
    try {
      const valueToSet =
        typeof val === 'object'
          ? JSON.stringify(val)
          : typeof val === 'string'
          ? val.toString()
          : '';
      await EncryptedStorage.setItem(key, valueToSet);
      return await getItem(key, typeof val as StorageValueType);
    } catch (e) {
      return '';
    }
  };

  export const removeItem = async (key: string): Promise<void> => {
    try {
      return await EncryptedStorage.removeItem(key);
    } catch (e) {
      return;
    }
  };
}
