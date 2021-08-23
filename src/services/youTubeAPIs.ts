import {YTChannelItem, YTChannel} from '../types/YTChannel';
import {YT_API_KEY} from '../utils/Constant';
import {apiClient} from './apiClient';

export async function getYouTubeChannelsAPI(
  videoSearchText: string,
): Promise<YTChannel> {
  const apiYouTubeChannel = (await apiClient(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${videoSearchText}&regionCode=IN&key=AIzaSyDfwWkbHpiXqYxwan_6K_TutDk9Kg7IxsI`,
    {
      method: 'GET',
    },
  )) as YTChannel;

  return apiYouTubeChannel;
}
export async function getYouTubeVideosAPI(
  channelId: string,
  query: string,
): Promise<YTChannel> {
  const apiYouTubeChannel = (await apiClient(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${query}&order=date&key=AIzaSyDfwWkbHpiXqYxwan_6K_TutDk9Kg7IxsI`,
    {
      method: 'GET',
    },
  )) as YTChannel;

  return apiYouTubeChannel;
}

export async function getYTChannelsStatsticsAPI(
  channelId: string,
): Promise<any> {
  const apiYouTubeChannelStatistics: any = await apiClient(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyDfwWkbHpiXqYxwan_6K_TutDk9Kg7IxsI`,
    {
      method: 'GET',
    },
  );

  return apiYouTubeChannelStatistics;
}
export async function getYTChannelsSnippetAPI(channelId: string): Promise<any> {
  const apiYouTubeChannelSnippet: any = await apiClient(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=AIzaSyDfwWkbHpiXqYxwan_6K_TutDk9Kg7IxsI`,
    {
      method: 'GET',
    },
  );
  return apiYouTubeChannelSnippet;
}
