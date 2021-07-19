import {apiClient} from './apiClient';

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
 tender_url:string
): Promise<any> {

  const apiGovtProjectDetails = await apiClient(
    tender_url,  {
      method: 'GET',
    },
  )
  console.log(apiGovtProjectDetails + '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  return apiGovtProjectDetails;
}
