import {apiClient} from './apiClient';

export async function getTradeFairDataAPI(
  page_size:number,
  page_number:number
): Promise<string> {
  const apiHousingData = (await apiClient(
   `http://l01svindeca0101.zl.if.atcsg.net:6565/Api/TradeFair/GetTradeFairList`,
    {
      method: 'POST',
      body:JSON.stringify(
        {page_size:page_size,
        page_number:page_number}),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
         
        }
    },
  )) as string;

  return apiHousingData;
}

export async function getTradeFairDetailsAPI(
  source_id:number,
  tradefair_id:number
): Promise<string> {
  console.log("-=-=-{{{{{{}}}}}}}}")
  const apiHousingData = (await apiClient(
    `http://l01svindeca0101.zl.if.atcsg.net:6565/Api/TradeFair/GetTradefairDetails`,
    {
      method: 'POST',
      body: JSON.stringify(
        {source_id:source_id,
          tradefair_id:tradefair_id}),
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
           
          }
    },
  )) as string;
  console.log(apiHousingData)

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