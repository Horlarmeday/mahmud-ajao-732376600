import { get } from '../axios';
import { EventObject } from './event-response.type';
import { CreateActivityDto } from '../../../modules/activities/dto/create-activity.dto';

export class NftMarketPlace {
  private baseUrl = 'https://api.reservoir.tools/';
  async askStatusChange() {
    const url = `${this.baseUrl}events/asks/v3`;
    const response = await get(url, { limit: 1000 });
    if (response.data?.events?.length) {
      const data = response.data?.events?.filter(
        ({ event }) => event.kind === 'new-order',
      );
      return this.mapEvent(data);
    }
    return [];
  }

  private mapEvent(data: EventObject[]): CreateActivityDto[] {
    return data.map((event) => ({
      contract_address: event.order.contract,
      token_index: event.order?.criteria?.data?.token?.tokenId,
      listing_price: event.order.price.amount.native,
      maker: event.order.maker,
      listing_from: new Date(event?.order?.validFrom * 1000),
      listing_to: new Date(event?.order?.validUntil * 1000),
      event_timestamp: event.event.createdAt,
    }));
  }
}
