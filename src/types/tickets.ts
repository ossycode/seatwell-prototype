import { Team } from "./team";

export type TicketStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "payout_issued";

export interface Ticket {
  id: string;
  game_id: string;
  seller_id: string;
  price?: number;
  status: TicketStatus;
  seat_info?: string;
  verification_code: string;
  created_at: string;
  seller_email?: string;
}

export interface NewTicket {
  game_id: string;
  seller_id: string;
  price: number;
  seat_info?: string;
}

export interface BuyTicketArgs {
  ticketId: string;
  buyerId: string;
}

export type GetTicketsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  gameId?: string;
  sellerEmail?: string;
};

// export type TicketWithGame = {
//   id: string;
//   status: TicketStatus;
//   price: number | null;
//   verification_code: string;
//   game: Array<{
//     home_team: string;
//     away_team: string;
//     date: string;
//   }>;
// } | null;
export type TicketWithGame = {
  id: string;
  status: TicketStatus;
  price: number;
  seat_info?: string;
  verification_code: string;
  game: {
    home_team: Team;
    away_team: Team;
    date: string;
    id: string;
  };
  // seller: {
  //   email: string;
  // };
  seller_email?: string;
};
