"use client"; // Required for interactivity

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Elevate Your Style",
    description: "Discover the latest trends in fashion with our curated collection of premium clothing.",
    image: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ctaPrimary: "Shop Collection",
    ctaPrimaryLink: "/shop",
    ctaSecondary: "New Arrivals",
    ctaSecondaryLink: "/category/new-arrivals"
  },
  {
    title: "Summer Collection",
    description: "Fresh styles for the warm season. Lightweight fabrics and vibrant colors.",
    image: "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ctaPrimary: "Shop Now",
    ctaPrimaryLink: "/shop?collection=summer",
    ctaSecondary: "View Lookbook",
    ctaSecondaryLink: "/lookbook"
  },
  {
    title: "Limited Edition",
    description: "Exclusive pieces available for a short time only. Don't miss out!",
    image: "https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ctaPrimary: "Shop Limited",
    ctaPrimaryLink: "/shop?collection=limited",
    ctaSecondary: "Learn More",
    ctaSecondaryLink: "/about"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTransitioning(false);
      }, 500); // Matches transition duration
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Slides container */}
      <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="relative flex-shrink-0 w-full h-full"
          >
            {/* Background image */}
            <div 
              className="absolute inset-0 z-[-1] bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>
        ))}
      </div>

      {/* Content (always visible) */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className={`max-w-xl text-white transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {slides[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-medium">
              <Link href={slides[currentSlide].ctaPrimaryLink}>
                {slides[currentSlide].ctaPrimary}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:text-black">
              <Link href={slides[currentSlide].ctaSecondaryLink}>
                {slides[currentSlide].ctaSecondary}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setTransitioning(true);
              setTimeout(() => {
                setCurrentSlide(index);
                setTransitioning(false);
              }, 500);
            }}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white w-6" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;