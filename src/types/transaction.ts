import { TicketStatus } from "./tickets";

export interface Transaction {
  id: string;
  ticket_id: string;
  buyer_id: string;
  buyer_email: string;
  seller_email: string;
  ticket_seat_info: string;
  ticket_price: number;
  game_date: string;
  game_title: string;
  purchased_at: string;
}

export interface DetailedTransaction {
  id: string;
  purchased_at: string;
  ticket: {
    id: string;
    seat_info: string;
    price: number;
    game: {
      id: string;
      home_team: string;
      away_team: string;
      date: string;
    };
    seller: {
      id: string;
      email: string;
    };
  };
  buyer: {
    id: string;
    email: string;
  };
  date: string;
}

export interface BuyerTransaction {
  id: string;
  purchased_at: string;
  ticket: {
    id: string;
    seat_info: string;
    price: number;
    status: TicketStatus;
    game: {
      id: string;
      date: string;
      venue: string;
      home_team: {
        id: string;
        name: string;
        logo_url: string;
      };
      away_team: {
        id: string;
        name: string;
        logo_url: string;
      };
    };
  };
}
