import {Axway_BaseUrl, Axway_ApiUrl} from '../utils/Constant';
import {apiClient} from './apiClient';
import {Helpers} from '../utils/Helpers';

const getCommonHeaders = async () => {
  const commonHeaders = {
    Authorization: 'Bearer ' + (await Helpers.getStoredAxwayToken()),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return commonHeaders;
};

export async function getHousingDataAxwayAPI(): Promise<string> {
  let page_size = 10;
  let page_number = 1;

  const getHousingDataBody = {
    page_size: page_size,
    page_number: page_number,
  };

  const axwayHousingData = (await apiClient(
    Axway_BaseUrl + Axway_ApiUrl + 'Tender/GetTenderList',
    {
      method: 'POST',
      body: JSON.stringify(getHousingDataBody),
      headers: await getCommonHeaders(),
    },
  )) as string;

  return axwayHousingData;
}

export async function getGovtProjectDetails(
  tender_source: any,
  tender_id: any,
): Promise<string> {
  const getGovtProjectDetailsBody = {
    source_id: tender_source,
    tender_id: tender_id,
  };

  const apiGovtProjectDetails = (await apiClient(
    Axway_BaseUrl + Axway_ApiUrl + 'Tender/GetTenderDetails',
    {
      method: 'POST',
      body: JSON.stringify(getGovtProjectDetailsBody),
      headers: await getCommonHeaders(),
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
