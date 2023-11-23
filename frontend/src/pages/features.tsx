import next from "next";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Navbar from "@/components/Layout/NavBar";

const Features: React.FC = () => {
	return (
		<div>
			<Navbar/>
			<div className="header p-4 md:p-8 flex">
				<div className="flex flex-col justify-center mx-auto my-20 m-12">
					<div className="features-bar">
					<div className="text-white text-center pt-2 text-[40px] font-semibold font-Manrope">FEATURES</div>
					</div>
					<div className="features-container flex justify-between m-8">
          {/* Left Bars */}
          <div className="flex flex-col items-center">
		  <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/online.png"
				alt="online"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Unleash the thrill of real-time battles</h3>
				<h3 className="text-white text-xl font-semibold">where every move counts</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/friends.png"
				alt="firends"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Forge bonds and strategize with your</h3>
				<h3 className="text-white text-xl font-semibold">crew in dedicated chat channels</h3>
				</div>
			</div>
			</div>
			
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/message.png"
				alt="message"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Connect, banter, and cheer on your</h3>
				<h3 className="text-white text-xl font-semibold">teammates with our chat system.</h3>
				</div>
			</div>
			</div>
          </div>

          {/* Right Bars */}
          <div className="flex flex-col items-center">
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/leaderboard.png"
				alt="leaderboard"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Rise to the top and let the world know</h3>
				<h3 className="text-white text-xl font-semibold">who dominates the arena!</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/arcade.png"
				alt="arcade"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Dive into a world where every battle</h3>
				<h3 className="text-white text-xl font-semibold">is an adventure that keeps you hooked</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/medal.png"
				alt="medal"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Celebrate every victory, big or small! </h3>
				<h3 className="text-white text-xl font-semibold">Achievements for each milestone</h3>
				</div>
			</div>
			</div>
          </div>
        </div>
				</div>
			</div>
		</div>
	);
};

export default Features;