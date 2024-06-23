"use client"
import Image from "next/image";
import React from "react";
import { IoAdd } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { TbLibraryPhoto } from "react-icons/tb";
import { TiStarOutline } from "react-icons/ti";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {

  const pathname = usePathname()

  return (
    <section className="flex flex-col  items-center gap- w-full">
      <main className="p-5  px-10 flex justify-between items-center w-full">
        <Image src={"/loggo.svg"} alt="" width={50} height={100} />

        <div className="flex items-center gap-8">
          <button className="border-[#9869EB] text-[#9869EB] border-2 px-6 py-2 flex items-center gap-3">
            <IoAdd />
            <p>import</p>
          </button>
          <button className=" bg-[#9869EB] font-light text-white px-3 py-2 flex items-center gap-2">
            <IoWallet />
            <p>Connect to Wallet</p>
          </button>
        </div>
      </main>
      <main className="border-y m-3 border-gray-900  w-full flex items-center justify-center gap-16 ">
        <Link
          className={`link ${pathname === '/' ? 'flex items-center gap-2 text-[#9869EB] text border-b-2 p-4 border-[#9869EB]' : 'flex items-center gap-2 p-4'}`} href="/"  >
          <TbPhoto />
          <span> All Photos</span>
        </Link>


        <Link
          className={`link ${pathname === '/albums' ? 'flex items-center gap-2 text-[#9869EB] text border-b-2 p-4 border-[#9869EB]' : 'flex items-center gap-2   p-4'}`} href="/albums"  >
          <TbLibraryPhoto />
          <span> Albums</span>
        </Link>
        <Link
          className={`link ${pathname === '/favorites' ? 'flex items-center gap-2 text-[#9869EB] text border-b-2 p-4 border-[#9869EB]' : 'flex items-center gap-2   p-4'}`} href="/favorites"  >
          <TiStarOutline />
          <span> Favorites</span>
        </Link>



      </main>
    </section>
  );
};

export default Navbar;
