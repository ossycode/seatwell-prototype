"use client";
import { motion } from "framer-motion";
import { BellIcon, ShieldCheckIcon, TicketIcon } from "lucide-react";
import React from "react";

const features = [
  {
    icon: TicketIcon,
    title: "Quick Listing",
    desc: "List tickets in under 30 seconds.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Private",
    desc: "Your data and payments are safe.",
  },
  {
    icon: BellIcon,
    title: "Real-Time Alerts",
    desc: "Get notified on new listings.",
  },
];

const Features = () => {
  return (
    <section className="container mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
        Why Seatwell?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.2 }}
            className="p-6 bg-background rounded-xl shadow hover:shadow-xl transition"
          >
            <f.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {f.title}
            </h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
