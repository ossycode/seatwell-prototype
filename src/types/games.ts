import { Team } from "./team";

export interface Game {
  id: string;
  date: string;
  venue: string;
  home_team_id: string;
  away_team_id: string;
  home_team?: Team;
  away_team?: Team;
  available_ticket_count?: number;
}
