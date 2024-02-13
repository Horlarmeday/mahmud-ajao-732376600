import { OnEvent } from '@nestjs/event-emitter';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Activity } from '../entities/activity.entity';
import { ActivitiesService } from '../activities.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ActivityCreatedListener {
  private logger = new Logger(ActivityCreatedListener.name);
  constructor(private activitiesService: ActivitiesService) {}
  @OnEvent('new.event')
  async handleActivityCreatedEvent(events: Activity[]) {
    this.logger.log('new activity event received');
    try {
      await Promise.all(
        events.map(async (event) => {
          // check if listing exist in the tokens table
          await this.activitiesService.findOrCreateToken({
            index: event.token_index,
            contract_address: event.contract_address,
            current_price: event.listing_price,
          });
          // set to null any listing validTo less than now in the token table;
          if (dayjs(event.listing_to).isBefore(dayjs())) {
            this.logger.log(
              `NFT ${event.contract_address} listing is old setting price to null...`,
            );
            await this.activitiesService.updateListing(
              {
                index: event.token_index,
                contract_address: event.contract_address,
              },
              {
                current_price: null,
              },
            );
          }

          // fetch listing in activity table, check the one that has the lowest price
          const listings = await this.activitiesService.findNFTListing(
            event.token_index,
            event.contract_address,
          );
          // check the one that has the lowest price
          const lowestPrice = listings.reduce((minPrice, listing) => {
            return listing.listing_price < minPrice
              ? listing.listing_price
              : minPrice;
          }, Infinity);

          const price = Math.min(lowestPrice, event.listing_price);
          this.logger.log(
            `Setting lowest price ${price} for NFT ${event.contract_address}...`,
          );
          await this.activitiesService.updateListing(
            {
              index: event.token_index,
              contract_address: event.contract_address,
            },
            {
              current_price: price,
            },
          );
        }),
      );
    } catch (e) {
      this.logger.error(`An error occurred, ${e?.message}`);
      throw new InternalServerErrorException(e?.message, { cause: e });
    }
  }
}
