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
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730813558/reviews/yhhtpzonmvlwlgyvthyg.png",
      rate: 5,
    },
    {
      name: "Marion Bonilla",
      feedback: dict.mainPage.testimonials.testimonial1.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727798049/1688637869155_ls44og.jpg",
      rate: 5,
    },
    {
      name: "Diego Goicoechea",
      feedback: dict.mainPage.testimonials.testimonial2.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727954734/reviews/go2xix2zet4kd6xzr3xx.jpg",
      rate: 4,
    },
    {
      name: "Cindy Clement",
      feedback: dict.mainPage.testimonials.testimonial3.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730743359/reviews/pejpz4ovgtfkscxgodlc.png",
      rate: 4,
    },
    {
      name: "Juan David Guerrero",
      feedback: dict.mainPage.testimonials.testimonial5.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1735280475/470478532_2362152754127240_6448902300653081500_n_iimxrg.jpg",
      rate: 5,
    },
    {
      name: "Shaquille Britton",
      feedback: dict.mainPage.testimonials.testimonial6.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1735281303/reviews/gpunffdotd4xeohkzdve.png",
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
