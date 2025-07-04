"use client";
import { montserrat } from "@/utils/fonts";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { GameCard } from "./ui/GameCard";
import { useGetGamesQuery } from "@/services/gamesApi";
import Loader from "./ui/Loader";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Routes } from "@/routes";
// import { brandName, clubName } from "@/utils/constants";

interface Props {
  user: User | null;
}

const HomePageGamesListing = ({ user }: Props) => {
  const { data: games, isLoading } = useGetGamesQuery({ futureOnly: true });
  const supabase = createClient();
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  const handleCardClick = async () => {
    if (!user) return;

    try {
      setIsFetching(true);
      const {
        data: profile,
        error,
        status,
      } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (profile?.role === "seller") {
        router.push(Routes.SELLER.path);
      } else {
        router.push(Routes.BUYER.path);
      }
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      alert("Error loading data");
    } finally {
      setIsFetching(false);
    }
  };

  if (isLoading || isFetching) return <Loader />;
  return (
    <div className="relative mx-auto text-center text-white  mt-20 w-full">
      <h3
        className={`text-4xl md:text-6xl font-bold mb-4 text-gray-500 ${montserrat.className} `}
      >
        GAMES ON THE HORIZON
      </h3>

      {/* <div className="bg-primary w-fit h-42 mx-auto rounded">
        <div className="bg-gray px-10 rounded-full h-full text-center flex items-center shadow-inner">
          <p className="text-primary font-semibold ">{clubName}</p>
        </div>
      </div> */}

      <div className="relative  overflow-hidden flex items-center justify-center mt-16">
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={16}
          loop
          speed={1000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          grabCursor
          className=" overflow-visible  w-full"
        >
          {games?.data?.map((game) => (
            <SwiperSlide
              key={game.id}
              style={{ width: 300 }}
              className="-translate-x-24"
            >
              <GameCard game={game} onClick={handleCardClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePageGamesListing;
