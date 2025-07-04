import { Game } from "@/types/games";
import Image from "next/image";
import React from "react";
import CustomLink from "./CustomLink";
import { Routes } from "@/routes";

export interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const formatted = new Date(game?.date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className="w-full max-w-2xs h-[400px] bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden flex flex-col relative "
    >
      <Image
        src="/images/stadium-celebrate.jpg"
        alt="Background"
        fill
        className="object-cover "
        priority // optional: only use if it's above the fold
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-green-600 z-10" />
      <div className="relative z-10 text-white p-4">
        <div className="flex items-center mt-5">
          <div className=" w-full flex items-center  flex-col justify-center py-2 ">
            <Image
              src={`${game.home_team?.logo_url}`}
              alt={`${game.home_team?.name}`}
              width={60}
              height={60}
              className="rounded-md"
            />
            <span className="text-white mt-2 truncate">
              {game.home_team?.name}
            </span>
          </div>

          <div className="text-2xl ">vs</div>
          <div className="w-full flex items-center  flex-col justify-center py-2">
            <Image
              src={`${game.away_team?.logo_url}`}
              alt={`${game.away_team?.name}`}
              width={60}
              height={60}
              className="rounded-md"
            />
            <span className="text-white mt-2 truncate">
              {game.away_team?.name}
            </span>
          </div>
        </div>
        <div className="mt-6 ">
          <p className="font-extralight">{game.venue}</p>
          <div className="mt-4 border-b-8 border-accent w-fit mx-auto px-1 pb-1">
            {" "}
            <p className="text-accent">{formatted}</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-12 ">
          <CustomLink
            href={Routes.BUYER.path}
            className="px-3 py-2 text-center bg-green-800 hover:bg-green-900 font-medium rounded-md text-sm"
          >
            Buy a Ticket
          </CustomLink>
          <CustomLink
            href={Routes.SELLER.path}
            className="text-primary px-3 py-2 text-center text-sm bg-green-200 hover:bg-green-300 font-medium rounded-md shadow-2xl"
          >
            Sell a Ticket
          </CustomLink>
        </div>
      </div>
    </div>
  );
};
