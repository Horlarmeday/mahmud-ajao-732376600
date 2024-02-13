import axios from 'axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { SUCCESS } from '../../core/constants';

export const get = async (url: string, headers: any, params = {}) => {
  const logger = new Logger();
  try {
    const response = await axios.get(url, { headers, params });
    return {
      status: SUCCESS,
      data: response.data,
      statusCode: response.status,
    };
  } catch (e) {
    logger.error(`error`, e);
    logger.error(`An error occurred ${e?.message}`);
    throw new BadRequestException(e.message);
  }
};
