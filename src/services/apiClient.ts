const checkHTTPStatus = (response: Response, method?: string) =>
  new Promise((resolve, reject) => {
    if (__DEV__) {
      /* eslint-disable no-console */
      console.log(response.status, response);
    }

    if (response.ok) {
      return resolve(response);
    }

    response.text().then((text: string) => {
      if (__DEV__) {
        /* eslint-disable no-console */
        console.log('Rejected', text);
      }
// response.status


if (response.status!=200 ) {
  return resolve(response);
}
      reject({
        message: text,
        status: response.status,
        url: response.url,
        method,
      });
    });
  });

const toJson = (response: unknown) => {
  return new Promise(resolve => {
    (response as Response)
      .json()
      .then((json: unknown) => {
        if (__DEV__) {
          /* eslint-disable no-console */
          console.log('JSON', json);
        }

        resolve(json);
      })
      .catch(() => {
        resolve({});
      });
  });
};

export const apiClient = async (
  url: string,
  requestConfig: RequestInit,
): Promise<unknown> => {
  if (__DEV__) {
    console.log('fetch', url,"=-=--", requestConfig);
  }

  const timeoutValue = 60000;

  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, timeoutValue);

  return fetch(url, {
    ...requestConfig,
  })
    .then((response: Response) =>
      checkHTTPStatus(response, requestConfig.method),
    )
    .then(toJson);
};
