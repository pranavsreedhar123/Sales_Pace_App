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

  export const reverseArray = (array: any) => {
    return array.reverse();
  };
}
