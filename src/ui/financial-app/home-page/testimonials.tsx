import { AppDictionary } from "@/src/translations";
import React from "react";

export type TestimonialsProps = { dict: AppDictionary };

export const Testimonials = ({ dict }: TestimonialsProps) => {
  const testimonials = [
    {
      name: "Kevin Di Risi",
      feedback: dict.mainPage.testimonials.testimonial4.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730813558/reviews/yhhtpzonmvlwlgyvthyg.png",
    },
    {
      name: "Marion Bonilla",
      feedback: dict.mainPage.testimonials.testimonial1.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727798049/1688637869155_ls44og.jpg",
    },
    {
      name: "Diego Goicoechea",
      feedback: dict.mainPage.testimonials.testimonial2.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727954734/reviews/go2xix2zet4kd6xzr3xx.jpg",
    },
    {
      name: "Cindy Clement",
      feedback: dict.mainPage.testimonials.testimonial3.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730743359/reviews/pejpz4ovgtfkscxgodlc.png",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-0 text-neutral-100 tracking-tight">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-10">
          {dict.mainPage.testimonials.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-[120px] h-[120px] rounded-full mx-auto mb-4"
              />
              <p className="text-lg opacity-80 mb-4">
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
