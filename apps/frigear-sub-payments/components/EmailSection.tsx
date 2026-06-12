"use client";
import { useState } from "react";
import { FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
// import { FaYoutubeSquare } from "react-icons/fa";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import AnimateSphere from "./AnimateSphereSpinner/AnimateSphereSpinner";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Navn skal være mindst 3 karakterer.",
  }),
  email: z.string().email({
    message: "Email skal være i rigtigt format",
  }),
  phone: z.string().min(8, {
    message: "Fon nummer er 8 tal",
  }),
  subject: z.string().min(2, {
    message: "Smid lige et emne!",
  }),
  content: z.string().min(2, {
    message: "Smæk lige en rigtig besked!",
  }),
});

const EmailSection = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await fetch("api/send/", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({
          name: values.name,
          emailAddress: values.email,
          phoneNumber: values.phone,
          subject: values.subject,
          content: values.content,
        }),
      });
    } catch (error) {
      toast.error("URGH! Noget gik galt. prøv lige senere.");
      return null;
    } finally {
      toast.success("Jaaasj! - Din besked er på vej til en frivillig.");
      setIsLoading(false);
      reset();
    }
  }

  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-44 gap-2 relative"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 to-transparent rounded-full h-80 w-80 blur-lg absolute top-[80%] -left-2 transform -translate-x-1/2 -translate-1/2 z-0"></div>
      <div className="z-10">
        <h5 className="text-xl font-bold text-white my-2">✉ Kontakt os</h5>
        <p className="text-[#ADB7BE] mb-2 max-w-md">
          {" "}
          Smid os en besked hvis du har nogen spørgsmål, så vender en Frigear
          frivillig tilbage ASAP 💜
        </p>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          {" "}
          Tjek vores SoMe mens du venter 🐼
        </p>
        <div className="socials flex flex-row gap-2">
          <Link
            href="https://instagram.com/frigear.nu/?viewAsMember=true"
            target="_blank"
          >
            <FaInstagramSquare className="w-10 h-10" />
          </Link>
          <Link
            href="https://www.facebook.com/Frigear.nu/?viewAsMember=true"
            target="_blank"
          >
            <FaFacebookSquare className="w-10 h-10" />
          </Link>
          <Link
            href="https://linkedin.com/company/frigear-nu/?viewAsMember=true"
            target="_blank"
          >
            <FaLinkedin className="w-10 h-10" />
          </Link>
        </div>
      </div>
      <div>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="text-white block mb-2 text-sm font-medium"
            >
              Dit seje navn
            </label>
            <input
              type="text"
              id="name"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Hei, hvad hedder du? . . put her"
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-xs text-red-600">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="text-white block mb-2 text-sm font-medium"
            >
              Dit fon nummer
            </label>
            <input
              type="tel"
              id="phone"
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Dit nummer? ..."
              {...register("phone")}
            />

            {errors?.phone && (
              <p className="px-1 text-xs text-red-600">
                {errors.phone?.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="text-white block mb-2 text-sm font-medium"
            >
              Din email
            </label>
            <input
              type="email"
              id="email"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="volunteerHero@someDomain.lol"
              {...register("email")}
            />

            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="text-white block text-sm mb-2 font-medium"
            >
              Emne
            </label>
            <input
              type="text"
              id="subject"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Ville bare lige smide et virtuelt kram :)"
              {...register("subject")}
            />

            {errors?.subject && (
              <p className="px-1 text-xs text-red-600">
                {errors.subject?.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="text-white block text-sm mb-2 font-medium"
            >
              Besked
            </label>
            <textarea
              id="message"
              rows={8}
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Jeg vil snakke om et awesome Frigear projekt ..."
              {...register("content")}
            />

            {errors?.content && (
              <p className="px-1 text-xs text-red-600">
                {errors.content?.message}
              </p>
            )}
          </div>
          {isLoading ? (
            <AnimateSphere />
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 border-2 border-transparent hover:border-indigo-300 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg w-full"
            >
              SEND BESKED
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default EmailSection;
