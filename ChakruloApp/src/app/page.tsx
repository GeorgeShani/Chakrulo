"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const navigate = () => {
    router.push("/sign-in");
  };

  return (
    <main className="w-full relative h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 welcome-layout layout">
      <section className="relative flex flex-col px-4 lg:px-8 items-center gap-4 lg:gap-6 justify-center text-center py-8 lg:py-0">
        <div className="absolute rounded-full bg-purple-300 opacity-75 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[1024px] lg:h-[1024px] -z-10" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#4B376B] px-4">
          Welcome To Chakrulo
        </h1>
        <p className="text-[#4B376B] text-base sm:text-lg md:text-xl lg:text-2xl text-shadow-2xs px-4">
          The Song That Went to Space, Now Takes You There.
        </p>
        <button
          type="button"
          onClick={navigate}
          className="bg-[#4B376B] hover:bg-[#3E1E5C] active:opacity-85 transition-all duration-200 ease-in-out py-2.5 px-5 sm:py-3 sm:px-6 rounded-4xl text-[#e8e8e8] text-base sm:text-lg lg:text-xl mx-4"
        >
          Test your health for zero-gravity life!
        </button>
      </section>
      <section className="w-full h-full flex items-center justify-center pb-8 lg:pb-0">
        <Image
          src="/images/illustrations/astro-dude.png"
          alt="Astro Dude"
          width={384}
          height={384}
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
        />
      </section>
    </main>
  );
}
