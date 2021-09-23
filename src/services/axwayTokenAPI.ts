import {apiClient} from './apiClient';
import {Tender_OAuth_ACCESS_TOKEN, Axway_BaseUrl} from '../utils/Constant';
import {SSOToken} from '../types/SSOToken';

export async function getAxwayAccessTokenAPI(): Promise<any> {
  let axwayTokenFormBody: any = [];

  let encodedKey = encodeURIComponent('client_id');
  let encodedValue = encodeURIComponent(Tender_OAuth_ACCESS_TOKEN.client_id);
  axwayTokenFormBody.push(encodedKey + '=' + encodedValue);
  encodedKey = encodeURIComponent('client_secret');
  encodedValue = encodeURIComponent(Tender_OAuth_ACCESS_TOKEN.client_secret);
  axwayTokenFormBody.push(encodedKey + '=' + encodedValue);
  encodedKey = encodeURIComponent('scope');
  encodedValue = encodeURIComponent(Tender_OAuth_ACCESS_TOKEN.scope);
  axwayTokenFormBody.push(encodedKey + '=' + encodedValue);
  encodedKey = encodeURIComponent('grant_type');
  encodedValue = encodeURIComponent(Tender_OAuth_ACCESS_TOKEN.grant_type);
  axwayTokenFormBody.push(encodedKey + '=' + encodedValue);

  axwayTokenFormBody = axwayTokenFormBody.join('&');

  const axwayAccessTokenData = (await apiClient(
    Axway_BaseUrl + 'sgdsi/oauth/token',
    {
      method: 'POST',
      body: axwayTokenFormBody,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )) as SSOToken;

  return axwayAccessTokenData;
}
