import analytics from '@react-native-firebase/analytics';
import {
  ERROR_SIGN_IN,
  TENDER_SEARCH,
  SIGN_IN,
  TRADE_FAIR_SEARCH,
  VIDEO_SEARCH,
  VLOGGER_SEARCH,
} from './Constant';

export namespace AnalyticsHelper {
  export const logEvent = async (
    eventName: string,
    param?: Record<string, unknown>,
  ): Promise<unknown> => {
    console.log(await analytics().logEvent(eventName, param), 'Analytics Log');

    return await analytics().logEvent(eventName, param);
  };

  export const logScreenView = async (
    screen_name?: string,
  ): Promise<unknown> => {
    return await analytics().logScreenView({
      screen_name: screen_name,
    });
  };

  export const logEventSignIn = (): void => {
    logEvent(SIGN_IN, {});
  };

  export const logEventErrorSignIn = (): void => {
    logEvent(ERROR_SIGN_IN, {});
  };

  export const logEventTenderSearch = (searchString: string): void => {
    const param = {
      searchString: searchString,
    };
    logEvent(TENDER_SEARCH, param);
  };

  export const logEventTradeFairSearch = (searchString: string): void => {
    const param = {
      searchString: searchString,
    };
    logEvent(TRADE_FAIR_SEARCH, param);
  };

  export const logEventVideoSearch = (searchString: string): void => {
    const param = {
      searchString: searchString,
    };
    logEvent(VIDEO_SEARCH, param);
  };

  export const logEventVLoggerSearch = (searchString: string): void => {
    const param = {
      searchString: searchString,
    };
    logEvent(VLOGGER_SEARCH, param);
  };
}
