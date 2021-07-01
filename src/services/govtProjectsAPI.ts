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
