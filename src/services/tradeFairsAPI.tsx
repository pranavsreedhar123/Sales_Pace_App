import {apiClient} from './apiClient';
import {Helpers} from '../utils/Helpers';
import {Axway_BaseUrl, Axway_ApiUrl} from '../utils/Constant';

const getCommonHeaders = async () => {
  const commonHeaders = {
    Authorization: 'Bearer ' + (await Helpers.getStoredAxwayToken()),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return commonHeaders;
};

export async function getTradeFairDataAPI(
  page_size: number,
  page_number: number,
): Promise<string> {
  const getTradeFairDataBody = {
    page_size: page_size,
    page_number: page_number,
  };

  const apiHousingData = (await apiClient(
    Axway_BaseUrl + Axway_ApiUrl + 'TradeFair/GetTradeFairList',
    {
      method: 'POST',
      body: JSON.stringify(getTradeFairDataBody),
      headers: await getCommonHeaders(),
    },
  )) as string;

  return apiHousingData;
}

export async function getTradeFairDetailsAPI(
  source_id: number,
  tradefair_id: number,
): Promise<string> {
  const getTradeFairDetailsBody = {
    source_id: source_id,
    tradefair_id: tradefair_id,
  };

  const apiHousingData = (await apiClient(
    Axway_BaseUrl + Axway_ApiUrl + 'TradeFair/GetTradefairDetails',
    {
      method: 'POST',
      body: JSON.stringify(getTradeFairDetailsBody),
      headers: await getCommonHeaders(),
    },
  )) as string;

  return apiHousingData;
}

// export async function getGovtProjectDetails(
//   tender_source: any,
//   tender_id: any,
// ): Promise<string> {
//   // alert(tender_source + '---' + tender_id);

//   const apiGovtProjectDetails = (await apiClient(
//     `http://l01svindeca0101.zl.if.atcsg.net:6565/Api/Tender/GetTenderDetails?source_id=${tender_source}&tender_id=${tender_id}`,
//     {
//       method: 'GET',
//     },
//   )) as string;
//   console.log(apiGovtProjectDetails + 'data----<>');
//   return apiGovtProjectDetails;
// }
