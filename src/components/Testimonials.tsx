"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const testimonials = [
  {
    name: "Alex P.",
    text: "Sold my tickets in minutes — so easy!",
    avatar: "/avatars/maria.jpg",
  },
  {
    name: "Maria K.",
    text: "Found great seats at half price.",
    avatar: "/avatars/alex.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
        What People Are Saying
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="p-6 bg-background rounded-lg shadow"
          >
            <p className="italic mb-4 text-gray-900">“{t.text}”</p>
            <div className="flex items-center">
              <Image
                src={t.avatar}
                alt={t.name}
                className="h-12 w-12 rounded-full mr-4 object-cover"
                width={100}
                height={100}
              />
              <span className="font-semibold text-gray-900">{t.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
