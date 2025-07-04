export type ReleasePayload = {
  gameIds: string[];
  seatInfo: Record<string, string>;
  payoutMethodId: string;
  newMethod?: {
    type: "bank" | "paypal";
    details: Record<string, string>;
    makeDefault: boolean;
  };
};
