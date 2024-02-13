import axios from 'axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { SUCCESS } from '../../core/constants';
import { ResponseData } from './nftMarkets/event-response.type';

export const get = async (url: string, params = {}) => {
  const logger = new Logger('axios');
  try {
    const response = await axios.get(url, { params });
    return {
      status: SUCCESS,
      data: response.data as ResponseData,
      statusCode: response.status,
    };
  } catch (e) {
    logger.error(`error`, e);
    logger.error(`An error occurred ${e?.message}`);
    throw new BadRequestException(e.message, { cause: e });
  }
};
