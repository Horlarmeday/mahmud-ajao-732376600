export class CreateActivityDto {
  contract_address: string;
  token_index: string;
  listing_price: number;
  maker: string;
  listing_from: Date;
  listing_to: Date;
  event_timestamp: string;
}
