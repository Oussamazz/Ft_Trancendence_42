import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";


const NavBarNotLogged = () => {
	const router = useRouter();
	return (
	  <div className="flex items-center place-content-evenly gap-5 min-[0px]:hidden sm:hidden md:flex">
		<Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
		  HOME
		</Link>
		<Link href="/team" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
		  OUR TEAM 
		</Link>
		<Link href="/features" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm min-[0px]:hidden md:flex">
		  FEATURES
		</Link>
		<button onClick={() => router.push('/login')} className="pink-button">PLAY NOW!</button>
	  </div>
	);
  };
  
  const NavBarLogged = () => {
	const { data: session } = useSession();
  
	// Check if session and user information are available
	if (session && session.user) {
		const { user } = session;
		
	  return (
		<div className="flex items-center place-content-evenly gap-4">
		  <Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			HOME
		  </Link>
		  <Link href="/chat" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			CHAT 
		  </Link>
		  <Link href="/leaderboard" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm min-[0px]:hidden md:flex">
			LEADERBOARD
		  </Link>
		  <button className="pink-button ">PLAY NOW!</button>
		  <button className="">
			<Image
			  src={user?.image || ''} // Assuming the avatar URL is available in user.image
			  alt="avatar"
			  width={60}
			  height={60}
			  className="ml-2 rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
			/>
		  </button>
		</div>
	  );
	}
  	return null;
  };
  
  const Navbar: React.FC = () => {
	const { data: session } = useSession();
	return (
	  <div className="flex shadow-xl bg-[#3B2A3DBF] opacity-75 justify-between p-6 m-auto mt-6 mb-6 rounded-[15px] max-w-[1500px]">
		<div className="items-center place-content-start inline-flex">
		  <Link href="/">
			<Image
			  src="/images/logo.svg"
			  alt="Logo"
			  width={180}
			  height={30}
			/>
		  </Link>
		</div>
		{session ? <NavBarLogged /> : <NavBarNotLogged />}
	  </div>
	);
  };
  

  
export default Navbar;