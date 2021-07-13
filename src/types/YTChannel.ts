export type YTChannel = {
    items: YTChannelItem[];
  };
  export type YTChannelItem = {
    etag: string;
    id: YTChannelId;
    videoId?: string;
    kind: string;
    snippet: YTChannelSnippet;
    subscribers?: number;
    views?: number;
    thumbnailC?: string;
    hiddenSubscriber: boolean;
  };
  
  export type YTChannelId = {
    kind: string;
    videoId: string;
  };
  
  export type YTChannelSnippet = {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YTThumbNail;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
  
  export type YTThumbNail = {
    default: YTThumbNailData;
    medium: YTThumbNailData;
    high: YTThumbNailData;
  };
  
  export type YTThumbNailData = {
    url: string;
    width: number;
    height: number;
  };
