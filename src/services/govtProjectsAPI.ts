import { Tender_OAuth_ACCESS_TOKEN } from '../utils/Constant';
import {apiClient} from './apiClient';


export async function getAccessTokenForAPI(): Promise<object>{
  const accessToken=(await apiClient(
`https://test.api.saint-gobain.com/sgdsi/oauth/token`,
{
  method:'POST',
  body: JSON.stringify(
    {    client_id:Tender_OAuth_ACCESS_TOKEN.client_id,
         client_secret:Tender_OAuth_ACCESS_TOKEN.client_secret,
         scope:Tender_OAuth_ACCESS_TOKEN.scope,
         
}),
      headers: {
        'Accept':       '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
       
      }
}
  )) as object;
  
  return accessToken;
}
export async function getHousingDataAxwayAPI(
  access_token:string
): Promise<object>{
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
  const axwayHousingData=(await apiClient(
`https://test.api.saint-gobain.com/sgdsi/oauth/token`,
{
  method:'POST',
  body: JSON.stringify(
    {    client_id:Tender_OAuth_ACCESS_TOKEN.client_id,
         client_secret:Tender_OAuth_ACCESS_TOKEN.client_secret,
         scope:Tender_OAuth_ACCESS_TOKEN.scope,
         
}),
      headers: {
        'Accept':       '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
       
      }
}
  )) as object;
  
  return accessToken;
}
export async function getHousingDataAPI(): Promise<string> {
  const apiHousingData = (await apiClient(
    `http://l01svindeca0101.zl.if.atcsg.net:6565/Api/Tender/GetTenderList?page_size=10&page_number=0`,
    {
      method: 'GET',
    },
  )) as string;

  return apiHousingData;
}

export async function getGovtProjectDetails(
  tender_source: any,
  tender_id: any,
): Promise<string> {
  // alert(tender_source + '---' + tender_id);

  const apiGovtProjectDetails = (await apiClient(
    `http://l01svindeca0101.zl.if.atcsg.net:6565/Api/Tender/GetTenderDetails?source_id=${tender_source}&tender_id=${tender_id}`,
    {
      method: 'GET',
    },
  )) as string;
  console.log(apiGovtProjectDetails + 'data----<>');
  return apiGovtProjectDetails;
}

export async function checkProjectDetailsURL(
  tender_url: string,
): Promise<Response> {
  return fetch(tender_url).then(response => {
    return response as Response;
  });
}
