"use client"

import Image from "next/image";
import React, { useContext, useRef, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { TbLibraryPhoto } from "react-icons/tb";
import { TiStarOutline } from "react-icons/ti";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { store } from "../context/store";
import toast, { Toaster } from 'react-hot-toast';
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers } from "ethers";
import { TRYBE_ABI, TRYBE_CA } from "../config";

const Navbar = () => {
  const pathname = usePathname()

  const [uploading, setUploading] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);

  const { dispatch } = useContext(store)!

  const { address, isConnected } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();

  let provider: BrowserProvider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider);
  }

  const addFile = (file: string) => {
    dispatch({
      type: "ADD_FILE",
      payload: file
    })
  }

  const uploadFile = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);

    const res = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const { IpfsHash } = await res.json();

    return `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${IpfsHash}`;
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);

    const signer = await provider?.getSigner();

    const trybe = new ethers.Contract(
      TRYBE_CA,
      TRYBE_ABI,
      signer
    );

    try {
      const uploadedFile = await uploadFile(file);

      await trybe.upload(uploadedFile);

      trybe.on("Upload", (user, url, createdAt, e) => {
        console.log(user, url, createdAt);

        toast.success(`You successfully created an image.`);
      })

      addFile(uploadedFile); // Append the new files to the existing state
      setUploading(false);
    } catch (e) {
      console.log(e);
      toast.error("Trouble uploading file");
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = e?.target?.files?.[0]!;
    handleFileUpload(filesArray);
  };

  return (
    <section className="flex flex-col  items-center gap- w-full">
      <Toaster />
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <main className="md:p-5 py-5 px-4  md:px-10 flex justify-between items-center w-full">
        <Image src={"/loggo.svg"} alt="" width={50} height={100} />

        <div className="flex items-center gap-4">
          {pathname === '/' &&
            <button
              disabled={uploading && !isConnected}
              onClick={() => inputFile.current?.click()} // Safely use optional chaining
              className="border-[#5773ff] text-[#5773ff] border-2 px-3 py-3 flex items-center gap-3 rounded-xl">
              {!uploading && <IoAdd />}
              {uploading &&
                <div role="status">
                  <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              }
            </button>
          }
          <button className="  font-light text-white px-4 py-1 flex items-center gap-1 rounded-xl ">
            <IoWallet />
            <w3m-button balance={"hide"} />
          </button>
        </div>
      </main>
      <main className="border-y m-3 border-gray-800  w-full flex items-center md:justify-center justify-between md:gap-16 ">
        <Link
          className={`link ${pathname === '/' ? 'flex items-center gap-2 text-[#5773ff] text border-b-2 p-4 border-[#5773ff]' : 'flex items-center gap-2 p-4'}`} href="/"  >
          <TbPhoto />
          <span> My Photos</span>
        </Link>

        <Link
          className={`link ${pathname === '/albums' ? 'flex items-center gap-2 text-[#5773ff] text border-b-2 p-4 border-[#5773ff]' : 'flex items-center gap-2   p-4'}`} href="/albums"  >
          <TbLibraryPhoto />
          <span> Albums</span>
        </Link>

      </main>
    </section>
  );
};

export default Navbar;
