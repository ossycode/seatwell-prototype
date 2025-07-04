import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HomePageGamesListing from "@/components/HomePageGamesListing";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Testimonials from "@/components/Testimonials";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header />
      <main className="">
        <Hero />
        <HomePageGamesListing user={user} />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
