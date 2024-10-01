import { AppDictionary } from "@/src/translations";
import React from "react";

export type TestimonialsProps = { dict: AppDictionary };

export const Testimonials = ({ dict }: TestimonialsProps) => {
  const testimonials = [
    {
      name: dict.mainPage.testimonials.testimonial1.name,
      feedback: dict.mainPage.testimonials.testimonial1.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727798049/1688637869155_ls44og.jpg",
    },
    {
      name: dict.mainPage.testimonials.testimonial2.name,
      feedback: dict.mainPage.testimonials.testimonial2.feedback,
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727798049/1688637869155_ls44og.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-100 px-4 sm:px-0">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">
          {dict.mainPage.testimonials.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-[120px] h-[120px] rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 mb-4">"{testimonial.feedback}"</p>
              <h4 className="text-xl font-semibold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
