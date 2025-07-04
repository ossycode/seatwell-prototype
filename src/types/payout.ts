export type PayoutStatus = "pending" | "paid";

export interface Payout {
  id: string;
  amount: number;
  status: PayoutStatus;
  created_at: string;
  paid_at?: string;
  ticket_id: string;
  ticket: {
    id: string;
    game: { home_team: string; away_team: string; date: string };
    verification_code: string;
  };
  seller_id: string;
  seller_email: string;
}

export type PayoutType = "bank" | "paypal";

export interface BankDetails {
  accountNumber: string;
  routingNumber: string;
}

export interface PayPalDetails {
  email: string;
}

export interface BasePayoutMethod {
  id: string;
  is_default: boolean;
}

export interface BankPayoutMethod extends BasePayoutMethod {
  type: "bank";
  details: BankDetails;
}

export interface PayPalPayoutMethod extends BasePayoutMethod {
  type: "paypal";
  details: PayPalDetails;
}

export type PayoutMethod = BankPayoutMethod | PayPalPayoutMethod;

export interface NewMethodPayload {
  type: PayoutType;
  details: { accountNumber: string; routingNumber: string } | { email: string };
  makeDefault: boolean;
}

export interface ReleasePayload {
  gameIds: string[];
  seatInfo: Record<string, string>;
  payoutMethodId: string;
  newMethod?: NewMethodPayload;
}
