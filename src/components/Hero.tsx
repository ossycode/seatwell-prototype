"use client";
import { brandName } from "@/utils/constants";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import CustomLink from "./ui/CustomLink";
import { Routes } from "@/routes";
import { montserrat } from "@/utils/fonts";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-primary to-green-400">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 opacity-20 animate-[float_6s_ease-in-out_infinite]"
        style={{
          backgroundImage: 'url("/stadium-bg.jpg")',
          backgroundSize: "cover",
        }}
      />
      <div className="relative container mx-auto text-center text-white px-6">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-4xl md:text-5xl font-bold mb-4 ${montserrat.className}`}
        >
          {brandName}: Get Your Seat and Game on!
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-sm md:text-lg max-w-2xl mx-auto mb-12 `}
        >
          Do you want to attend a game but it is sold out? We got you covered!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center space-x-4"
        >
          <CustomLink href={`${Routes.BUYER.path}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className={`px-8 py-3 bg-primary text-gray rounded-sm font-semibold shadow-lg text-sm border border-gray cursor-pointer transition `}
            >
              Buy a Ticket
            </motion.button>
          </CustomLink>
          <Link href={`${Routes.SELLER.path}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="px-8 py-3 bg-gray text-primary rounded-sm font-semibold shadow-lg text-sm border border-primary cursor-pointer"
            >
              Sell a Ticket
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
