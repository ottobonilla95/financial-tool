import { AppDictionary } from "@/src/translations";
import React from "react";

export type TestimonialsProps = {
  dict: AppDictionary;
  variant?: "default" | "light";
};

export const Testimonials = ({ dict, variant }: TestimonialsProps) => {
  const testimonials = [
    {
      name: "Kevin Gonzales",
      feedback: dict.mainPage.testimonials.testimonial4.feedback,
      image: "/images/reviews/4410s08633_n.png",
      rate: 5,
    },
    {
      name: "Marion Bonilla",
      feedback: dict.mainPage.testimonials.testimonial1.feedback,
      image: "/images/reviews/Snapinst1080.jpg",
      rate: 5,
    },
    {
      name: "Diego Goicoechea",
      feedback: dict.mainPage.testimonials.testimonial2.feedback,
      image: "/images/reviews/4410086233_n.png",
      rate: 4,
    },
    {
      name: "Cindy Clement",
      feedback: dict.mainPage.testimonials.testimonial3.feedback,
      image: "/images/reviews/4410208633_n.png",
      rate: 4,
    },
    {
      name: "Juan David Guerrero",
      feedback: dict.mainPage.testimonials.testimonial5.feedback,
      image: "/images/reviews/441008633_n.jpg",
      rate: 5,
    },
    {
      name: "Shaquille Britton",
      feedback: dict.mainPage.testimonials.testimonial6.feedback,
      image: "/images/reviews/44100811633_n.png",
      rate: 4,
    },
  ];

  return (
    <section className="pb-10 px-4 sm:px-0 text-neutral-100 tracking-tight">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          {dict.mainPage.testimonials.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-[120px] h-[120px] rounded-full mx-auto mb-4 object-cover"
              />
              <div className="flex justify-center">
                {Array.from({ length: testimonial.rate }).map((_, index) => (
                  <div>⭐</div>
                ))}
              </div>
              <p className="text-base opacity-80 mb-4">
                "{testimonial.feedback}"
              </p>
              <h4 className="text-xl font-semibold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
