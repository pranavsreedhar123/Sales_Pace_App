import {YTChannelItem, YTChannel} from '../types/YTChannel';
import {apiClient} from './apiClient';

export async function getYouTubeChannelsAPI(
  videoSearchText: string,
): Promise<YTChannel> {
  const apiYouTubeChannel = (await apiClient(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${videoSearchText}&regionCode=IN&key=AIzaSyBZ3PGw-NX1QRy8uvKKsgUOhVtdwGqk_sw`,
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
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyBZ3PGw-NX1QRy8uvKKsgUOhVtdwGqk_sw`,
    {
      method: 'GET',
    },
  );

  return apiYouTubeChannelStatistics;
}

export async function getYTChannelsSnippetAPI(channelId: string): Promise<any> {
  const apiYouTubeChannelSnippet: any = await apiClient(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=AIzaSyBZ3PGw-NX1QRy8uvKKsgUOhVtdwGqk_sw`,
    {
      method: 'GET',
    },
  );
  return apiYouTubeChannelSnippet;
}