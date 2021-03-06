import {AppSecuredStorage} from './AppSecuredStorage';
import {AXWAY_TOKEN_STORAGE_KEY} from './Constant';

export namespace Helpers {
  export const getUniqueArray = (
    redundantArray: any,
    distinctKey: string,
  ): any => {
    const result = [];
    const distinctArray = new Map();
    for (const item of redundantArray) {
      if (!distinctArray.has(item[distinctKey])) {
        distinctArray.set(item[distinctKey], true);
        result.push(item);
      }
    }
    return result;
  };

  export const sortArrayByKey = (array: any, key: string) => {
    return array.sort((a: any, b: any) => {
      return a[key] - b[key];
    });
  };
  export const sortArrayByDate = (
    array: any,
    key: string,
    asc: boolean,
    key2?: string,
  ) => {
    return array.sort((a: any, b: any) => {
      let firstDate = new Date(
        key2 ? a[key] + '/' + a[key2] : a[key],
      ).getTime();
      let secondDate = new Date(
        key2 ? b[key] + '/' + b[key2] : b[key],
      ).getTime();

      console.log(
        firstDate,
        secondDate,
        '*********Dates **************',
        new Date('23/Jan/2022'),
      );

      let sortedDate: any = asc
        ? firstDate - secondDate
        : secondDate - firstDate;

      return sortedDate;
    });
  };

  export const reverseArray = (array: any) => {
    return array.reverse();
  };

  export const formatDate = (dateString: string): string => {
    let date = new Date(dateString);
    var year = date.getFullYear();
    /// Add 1 because JavaScript months start at 0
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month;
  };

  export const getColorLuminance = (hex: string, lum: number): string => {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    let rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
  };

  export const extractDomain = (url: string) => {
    let result;
    let match;
    if (
      (match = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im,
      ))
    ) {
      result = match[0];
      if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
        result = match[0];
      }
    }
    return result;
  };

  export const getStoredAxwayToken = async () => {
    const storedAxwayToken = (await AppSecuredStorage.getItem(
      AXWAY_TOKEN_STORAGE_KEY,
    )) as string;

    return storedAxwayToken;
  };
}
