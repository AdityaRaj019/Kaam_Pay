import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary/30 selection:text-primary transition-colors bg-background text-foreground">
      <Navbar />
      <Hero />
      <div className="relative z-10">
        <Categories />
        <Features />
        <Testimonials />
        <Footer />
      </div>
    </main>

  );
}
