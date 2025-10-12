"use client";
import Image from "next/image";
import React from "react";

export default function NasaCommunityPage() {
  const navigateToDiscord = () => {
    window.open("https://discord.gg/dVYCd46GXD", "_blank");
  };
  
  return (
    <section className="w-full h-full flex items-center justify-center nasa-community-layout layout">
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-2 text-center">
        <Image
          src="/images/logos/discord.svg"
          alt="Discord Logo"
          width={64}
          height={64}
        />
        <p className="text-[#1D083D] text-2xl font-semibold">
          Join the NASA Community on Discord! <br />Our official community space and
          activities are now moving to Discord.
        </p>
        <p className="text-[#572525] text-lg">Here you’ll find:</p>
        <ul className="w-full flex flex-col items-start justify-center gap-2 list-disc">
          <li className="text-[#290D55]">
            Direct conversations with other members
          </li>
          <li className="text-[#290D55]">
            Themed channels about science, space, and technology
          </li>
          <li className="text-[#290D55]">Quick updates on news and events</li>
        </ul>
        <p className="text-[#572525] text-lg">How to join:</p>
        <div className="w-full flex items-center justify-between">
          <ol className="w-full flex flex-col items-start justify-center gap-2 list-decimal">
            <li className="text-[#290D55]">
              Click the “Join Discord” button (link below).
            </li>
            <li className="text-[#290D55]">
              If you already have a Discord account – just log in.
            </li>
            <li className="text-[#290D55]">
              If not, you can easily create a new account in seconds.
            </li>
            <li className="text-[#290D55]">
              Enter our server and start connecting with the NASA Community!
            </li>
          </ol>
          <Image
            src="/images/qr/discord_qr.png"
            alt="Discord QR Code"
            width={100}
            height={100}
          />
        </div>
        <button
          className="bg-[#6665D2E5] rounded-3xl px-6 py-3 text-black mt-4"
          onClick={navigateToDiscord}
        >
          Join Discord
        </button>
      </div>
    </section>
  );
}
