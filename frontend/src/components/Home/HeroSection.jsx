import React from "react";
import modelImg from "../../assets/cover-model-transparent.png";

const HeroSection = () => {
    return (
        <section className="relative w-full bg-white overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] sm:w-[600px] sm:h-[600px] lg:w-[720px] lg:h-[720px] rounded-full bg-red-600/10 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="relative z-0 w-full flex justify-center items-center sm:items-baseline select-none whitespace-nowrap overflow-hidden font-extrabold uppercase leading-none tracking-tight text-black/5 text-[11vw] sm:text-[15vw] lg:text-[150px] pt-12 sm:pt-10 lg:pt-12"
            >
                <span className="-translate-x-[5%] sm:-translate-x-[16%] lg:-translate-x-[14%]">
                    SHIFT
                </span>
                <span className="translate-x-[5%] sm:translate-x-[16%] lg:translate-x-[14%]">
                    LIFESTYLE
                </span>
            </div>

            <div className="relative z-0 max-w-[1440px] mx-auto px-6 lg:px-12 -mt-16 sm:-mt-24 lg:-mt-28 min-h-[400px] sm:min-h-[580px] lg:min-h-[680px] flex flex-col justify-end items-center">
                <div className="relative flex justify-center items-end flex-1 w-full pointer-events-none">
                    <img
                        src={modelImg}
                        alt="Model wearing premium headphones"
                        width={1024}
                        height={1024}

                        className="h-[300px] sm:h-[500px] md:h-[580px] lg:h-[660px] w-auto max-w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] pb-12 sm:pb-16"
                    />
                </div>
            </div>
            <div className="absolute bottom-4 sm:bottom-10 left-0 w-full bg-black py-4 sm:py-5 overflow-hidden select-none z-10 pointer-events-none transform -rotate-1 sm:-rotate-2 scale-105 shadow-xl">
                <div className="flex w-max min-w-full uppercase font-black text-white tracking-widest text-sm sm:text-lg animate-[marquee_20s_linear_infinite] gap-16 px-8">
                    <div className="flex justify-around min-w-full shrink-0 gap-16">
                        <span>•</span>
                        <span>Premium Sound</span>
                        <span>•</span>
                        <span>Next Gen Smart Watches</span>
                        <span>•</span>
                        <span>Shift Your Lifestyle</span>
                        <span>•</span>
                        <span>Wireless Freedom</span>
                    </div>
                    <div className="flex justify-around min-w-full shrink-0 gap-16" aria-hidden="true">
                        <span>•</span>
                        <span>Premium Sound</span>
                        <span>•</span>
                        <span>Next Gen Smart Watches</span>
                        <span>•</span>
                        <span>Shift Your Lifestyle</span>
                        <span>•</span>
                        <span>Wireless Freedom</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;