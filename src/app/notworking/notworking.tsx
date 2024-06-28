"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Modal from './components/model';

// Dimport { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';
import { TRYBE_ABI, TRYBE_CA } from './config';
import toast, { Toaster } from 'react-hot-toast';

// Define the type for the file objects
interface FileObject {
    url: string;
    cid: string;
}

export default function Home() {
    // const [files, setFiles] = useState<FileObject[]>([]); // Array to store uploaded files
    // const [uploading, setUploading] = useState(false);
    // const [modalOpen, setModalOpen] = useState(false);
    // const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    // const inputFile = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [participants, setParticipants] = useState<string[]>([])
    const [url, setURL] = useState("")
    const [visibility, setVisibility] = useState(0)
    const [fee, setFee] = useState(0)

    const [creating, setCreating] = useState(false)

    const { address, isConnected } = useWeb3ModalAccount();

    const { walletProvider } = useWeb3ModalProvider();

    let provider: BrowserProvider;

    if (walletProvider) {
        provider = new ethers.BrowserProvider(walletProvider);
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = await uploadFile(e?.target?.files?.[0]!)
        console.log(uploadedFile)

        setURL(uploadedFile.url)
    };

    const uploadFile = async (fileToUpload: File) => {
        const formData = new FormData();

        formData.append("file", fileToUpload, fileToUpload.name);

        const res = await fetch("/api/files", {
            method: "POST",
            body: formData,
        });

        const { IpfsHash } = await res.json();
        console.log(IpfsHash)

        return { url: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${IpfsHash}`, cid: Ip fsHash };
    };

    // const handleFilesUpload = async (filesToUpload: File[]) => {
    //   setUploading(true);

    //   const uploadedFiles: FileObject[] = [];

    //   for (const file of filesToUpload) {
    //     try {
    //       const uploadedFile = await uploadFile(file);

    //       uploadedFiles.push(uploadedFile);
    //     } catch (e) {
    //       console.log(e);

    //       alert("Trouble uploading file");
    //     }
    //   }

    //   setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]); // Append the new files to the existing state
    //   setUploading(false);
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const filesArray = Array.from(e.target.files || []);
    //   handleFilesUpload(filesArray);
    // };

    // const loadRecent = async () => {
    //   try {
    //     const res = await fetch("/api/files");
    //     const json = await res.json();
    //     const recentImageUrl = `https://ipfs.io/ipfs/${json.ipfs_pin_hash}`;

    //     setFiles([{ url: recentImageUrl, cid: json.ipfs_pin_hash }]);
    //   } catch (e) {
    //     console.log(e);

    //     alert("Trouble loading files");
    //   }
    // };

    // const openModal = (imageUrl: string) => {
    //   setModalImageUrl(imageUrl);
    //   setModalOpen(true);
    // };

    // const closeModal = () => {
    //   setModalOpen(false);
    //   setModalImageUrl(null);
    // };

    const create = async () => {
        const signer = await provider?.getSigner();

        const trybe = new ethers.Contract(
            TRYBE_CA,
            TRYBE_ABI,
            signer
        );

        console.log(visibility, participants)

        try {
            await trybe.createAlbum(
                name,
                description,
                participants,
                url,
                visibility,
                fee
            )

            trybe.on("AlbumCreated", (creator, nameOfAlbum, albumId, e) => {
                console.log(creator, nameOfAlbum, albumId)

                toast.success(`You successfully created an album with ID of ${albumId}`)
            })
        } catch (error) {
            console.log(error)

            toast.error("An error occured while creatmg the album")
        }
    }

    return (
        <section className='p-20'>
            <Toaster />
            {/* <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleChange}
        multiple
        style={{ display: "none" }}
      /> */}
            <div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ display: "block" }}
                    className='m-2 text-black p-2'
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ display: "block" }}
                    className='m-2 text-black p-2'
                />
                <tetarea
                    value={participants}
                    cols={30}
                    rows={10}
                    onChange={(e) => setParticipants(e.target.value.split(","))}
                    style={{ display: "block" }}
                    className='m-2 text-black p-2'
                ></tetarea>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "block" }}
                    className='m-2 text-black p-2'
                />
                <select className='m-2 text-black p-2' style={{ display: "block" }} value={visibility} onChange={(e) => setVisibility(Number(e.target.value))}>
                    <option value={0}>Public</option>
                    <option value={1}>Private</option>
                </select>
                {visibility == 1 && <input
                    type="text"
                    value={fee}
                    style={{ display: "block" }}
                    className='m-2 text-black p-2'
                    onChange={(e) => setFee(Number(e.target.value))}
                />}
                {/* <button
          disabled={uploading}
          onClick={() => inputFile.current?.click()} // Safely use optional chaining
          className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button> */}
                <button
                    disabled={creating}
                    onClick={create} // Safely use optional chaining
                    className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
                >
                    {creating ? "Creating..." : "Create"}
                </button>
            </div>
            {/* {files.length === 0 ? (
        <div className="mt-5 text-center">
          <p className="font-bold text-3xl">No photos uploaded yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {files.map((file, index) => (
            <div key={index} className="relative w-full h-0 pb-[66.66%]" onClick={() => openModal(file.url)}>
              <Image
                src={file.url}
                alt={`Uploaded Image ${index}`}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          ))}
        </div>
      )} */}
            {/* {modalOpen && (
        <Modal isOpen={modalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
      )} */}
