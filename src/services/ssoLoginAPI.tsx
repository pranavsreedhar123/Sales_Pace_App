import { SSO_OAuth_Get_ACCESS_TOKEN } from '../utils/Constant';
import {apiClient} from './apiClient';

export async function getAccessToken(
userName:string,
password:string


): Promise<object> {
  let formBody :any= [];
 
   
  let encodedKey = encodeURIComponent('client_id');
  let encodedValue = encodeURIComponent(SSO_OAuth_Get_ACCESS_TOKEN.clientId);
  formBody.push(encodedKey + "=" + encodedValue);
   encodedKey = encodeURIComponent('client_secret');
   encodedValue = encodeURIComponent(SSO_OAuth_Get_ACCESS_TOKEN.clientSecret);
  formBody.push(encodedKey + "=" + encodedValue);
   encodedKey = encodeURIComponent('scope');
   encodedValue = encodeURIComponent(SSO_OAuth_Get_ACCESS_TOKEN.scope);
  formBody.push(encodedKey + "=" + encodedValue);
   encodedKey = encodeURIComponent('grant_type');
   encodedValue = encodeURIComponent(SSO_OAuth_Get_ACCESS_TOKEN.grant_type);
  formBody.push(encodedKey + "=" + encodedValue);
   encodedKey = encodeURIComponent('username');
   encodedValue = encodeURIComponent(userName);
  formBody.push(encodedKey + "=" + encodedValue);
  encodedKey = encodeURIComponent('password');
  encodedValue = encodeURIComponent(password);
 formBody.push(encodedKey + "=" + encodedValue);
  

 formBody = formBody.join("&");

    const accessTokenData = (await apiClient(
        `https://uat.cloudgateway.saint-gobain.com/openam/oauth2/access_token?realm=${SSO_OAuth_Get_ACCESS_TOKEN.realm}`, 
        {
          method: 'POST',

          
          body: formBody,
              headers: {
                'Accept':       '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
               
              }
        },
      )) as object;
    
      return accessTokenData;
}
