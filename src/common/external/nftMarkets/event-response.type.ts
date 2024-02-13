type Currency = {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
};

type Amount = {
  raw: string;
  decimal: number;
  usd: number;
  native: number;
};

type Price = {
  currency: Currency;
  amount: Amount;
};

type Event = {
  id: string;
  kind: string;
  txHash: string | null;
  txTimestamp: number | null;
  createdAt: string;
};

type Order = {
  id: string;
  status: string;
  contract: string;
  maker: string;
  price: Price;
  quantityRemaining: number;
  nonce: string;
  validFrom: number;
  validUntil: number;
  rawData: {
    kind: string;
    salt: string;
    zone: string;
    offer: Array<{
      token: string;
      itemType: number;
      endAmount: string;
      startAmount: string;
      identifierOrCriteria: string;
    }>;
    counter: string;
    endTime: number;
    offerer: string;
    partial: boolean;
    zoneHash: string;
    orderType: number;
    startTime: number;
    conduitKey: string;
    consideration: Array<{
      token: string;
      itemType: number;
      endAmount: string;
      recipient: string;
      startAmount: string;
      identifierOrCriteria: string;
    }>;
  };
  kind: string;
  source: string;
  isDynamic: boolean;
  criteria: {
    kind: string;
    data: {
      token: {
        tokenId: string;
      };
    };
  };
};

export type EventObject = {
  order: Order;
  event: Event;
};

export type ResponseData = {
  events: EventObject[];
};
