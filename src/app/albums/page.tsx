"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IoAdd } from "react-icons/io5";
import AlbumModal from '../components/albumModal';
import { TbLibraryPhoto } from "react-icons/tb";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';
import { TRYBE_ABI, TRYBE_CA } from '../config';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import QRCodeModal from '../components/QRCode';

const Page = () => {
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [albums, setAlbums] = useState<[]>([]);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [participants, setParticipants] = useState<string[]>([])
    const [url, setURL] = useState("")
    const [visibility, setVisibility] = useState(0)
    const [fee, setFee] = useState(0)
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(true);
    const [ID, setID] = useState<number>()

    const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

    const { address, isConnected } = useWeb3ModalAccount();

    const { walletProvider } = useWeb3ModalProvider();

    let provider: BrowserProvider;

    if (walletProvider) {
        provider = new ethers.BrowserProvider(walletProvider);
    }

    useEffect(() => {
        getAlbums()
    }, [address, isConnected])

    const getAlbums = async () => {
        const signer = await provider?.getSigner();
    
        const trybe = new ethers.Contract(
          TRYBE_CA,
          TRYBE_ABI,
          signer
        );
    
        try {
          const albums = await trybe.getAlbums()
          console.log(albums)
    
          setAlbums(albums)
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
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
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesArray = e?.target?.files?.[0]!;
        handleFileUpload(filesArray);
    }

    const handleFileUpload = async (file: File) => {
        const uploadedFile = await uploadFile(file)
        console.log(uploadedFile)

        setURL(uploadedFile)
        setUploading(false)
    }

    const create = async () => {
        const signer = await provider?.getSigner();
    
        const trybe = new ethers.Contract(
          TRYBE_CA,
          TRYBE_ABI,
          signer
        );
    
        console.log(visibility, participants)
        setCreating(true)
    
        try {
            if(fee > 10) {
                toast.error("Fee cannot be greater than 10 ETH.")
            } else if(fee < 0.001) {
                toast.error("Fee cannot be less than 0.001 ETH.")
            }

            await trybe.createAlbum(
                name,
                description,
                participants,
                url,
                visibility,
                fee * 1000
            )
    
            trybe.on("AlbumCreated", (creator, nameOfAlbum, albumId, e) => {
                console.log(creator, nameOfAlbum, albumId)

                setID(albumId)

                setCreating(false)
        
                toast.success(`You successfully created an album with ID of ${albumId}`)

                handleCloseModal()

                setTimeout(() => {
                    handleOpenQRCodeModal()
                }, 1500);
            })
        } catch (error) {
          console.log(error)
        
          setCreating(false)

          toast.error("An error occured while creating the album")
        }
    }

    const handleOpenModal = () => {
        setIsAlbumModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAlbumModalOpen(false);
    };

    const handleOpenQRCodeModal = () => {
        setIsQRCodeModalOpen(true);
    };

    const handleCloseQRCodeModal = () => {
        setIsQRCodeModalOpen(false);

        window.location.reload();
    };

    return (
        <>
            <Toaster />
            <section className='p-3 md:px-44'>
                <main className="flex justify-between w-full m-2">
                    <div>
                        <p className='font-bold text-xl'>Albums</p>
                        <p className='text-gray-400'>Create, view and share your albums</p>
                    </div>

                    <button className='flex items-center p-1 rounded-2xl gap-3 px-5 bg-[#5773ff]' onClick={handleOpenModal}>
                        <IoAdd />
                        <p>New Album</p>
                    </button>
                </main>

                {albums.length === 0 && !loading &&
                    <main className='flex flex-col items-center w-full'>
                        <Image src={"/album.svg"} alt='' width={300} height={200} />
                        <div className='flex flex-col gap-1 items-center'>
                            <p className='font-bold text-2xl'>No album created yet!!</p>
                            <p className='text-sm '>New albums will appear on this page</p>
                        </div>
                    </main>
                }

                {loading &&
                    <div role="status" className="flex flex-col justify-center items-center m-4">
                        <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                }

                {albums.length > 0 && !loading &&
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 m-4'>
                        {albums.map((album, index) => (
                            <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <Link href={album[1] == 0 ? `/albums/public/${album[0]}` : `/albums/private/${album[0]}`}>
                                    <Image
                                        className="rounded-t-lg" 
                                        src={album[6]} 
                                        alt=""
                                        width={400}
                                        height={50}
                                    />
                                </Link>
                                <div className="p-5">
                                    <Link href={album[1] == 0 ? `/albums/public/${album[0]}` : `/albums/private/${album[0]}`}>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album[4]}</h5>
                                    </Link>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album[5]}</p>
                                    <Link href={album[1] == 0 ? `/albums/public/${album[0]}` : `/albums/private/${album[0]}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Get Album
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </section>

            <AlbumModal isOpen={isAlbumModalOpen} onClose={handleCloseModal}>
                <div className="p-4">
                    <div className='flex flex-col items-center gap-3'>
                        <TbLibraryPhoto className='text-6xl' />
                        <h2 className="text-md font-medium mb-4">Create New Album</h2>
                    </div>

                    <form>
                        <div className="mb-4 flex flex-col gap-3">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none  rounded w-full py-2 px-3 text-white leading-tight  bg-[#37373b]"
                                placeholder="Title"
                            />
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" type="text" className="mb-2 block w-full p-4 text-white rounded-lg bg-[#37373b] text- " />

                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Collaborators</label>
                            <input value={participants} onChange={(e) => setParticipants(e.target.value.split(","))} placeholder="Add collaborators" type="text" className="block mb-2 w-full p-4 text-white rounded-lg bg-[#37373b] text- " />

                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                            <input onChange={handleChange} className="block mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />


                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Select type of album</label>
                            <select value={visibility} onChange={(e) => setVisibility(Number(e.target.value))} className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value={0}>Public</option>
                                <option value={1}>Private</option>
                            </select>

                            {visibility == 1 && <label className="block text-sm font-medium text-gray-900 dark:text-white">Fee</label>}
                            {visibility == 1 && <input value={fee} onChange={(e) => setFee(Number(e.target.value))} placeholder="fee" type="number" max={10} min={0.001} step={0.001} className="block mb-2 w-full p-4 text-white rounded-lg bg-[#37373b] text- " />}
                        </div>
                        <div className="flex items-center justify-between">
                            {!uploading &&
                                <button
                                    type="button"
                                    className="bg-blue-500 rounded-md hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 w-full flex justify-center"
                                    onClick={create}
                                    disabled={creating}
                                >
                                    {!creating && "Create Album"}
                                    {creating &&
                                        <div role="status">
                                            <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    }
                                </button>
                            }
                        </div>
                    </form>
                </div>
            </AlbumModal>

            <QRCodeModal isOpen={isQRCodeModalOpen} onClose={handleCloseQRCodeModal} url={`https://trybe-eight.vercel.app/album/${ID}`} />
        </>
    );
}

export default Page;
