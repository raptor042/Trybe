"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';
import { TRYBE_ABI, TRYBE_CA } from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import { IoAdd } from 'react-icons/io5';
import { useParams, useRouter } from 'next/navigation';

const Page = () => {
    const [album, setAlbum] = useState<string[]>([])
    const [joining, setJoining] = useState(false)
    const [loading, setLoading] = useState(true)

    const { address, isConnected } = useWeb3ModalAccount();

    const { walletProvider } = useWeb3ModalProvider();

    let provider: BrowserProvider;

    if (walletProvider) {
        provider = new ethers.BrowserProvider(walletProvider);
    }

    const params = useParams();
    const id = params.id;
    console.log(id)

    useEffect(() => {
        getAlbum()
    }, [address, isConnected])

    const getAlbum = async () => {
        const signer = await provider?.getSigner();
    
        const trybe = new ethers.Contract(
            TRYBE_CA,
            TRYBE_ABI,
            signer
        );
    
        try {
            const album = await trybe.getAlbum(Number(id))
            console.log(album)
    
            setAlbum(album)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const joinAlbum = async () => {
        const signer = await provider?.getSigner();
    
        const trybe = new ethers.Contract(
            TRYBE_CA,
            TRYBE_ABI,
            signer
        );

        setJoining(true)
    
        try {
            const fee = Number(ethers.formatEther(album[2]))
            console.log(fee)

            await trybe.joinAlbum(id, { value: ethers.parseEther(`${fee}`) })
            
            trybe.on("JoinedAlbum", (participant, timeJoined, e) => {
                console.log(participant, timeJoined);
        
                toast.success(`You successfully joined the ${album[4]} album`)

                setTimeout(() => {
                    if(album[1]) {
                        window.location.assign(`/albums/public/${id}`)
                    } else {
                        window.location.assign(`/albums/private/${id}`)
                    }
                }, 2000);
            })

            setJoining(false)
            // setTimeout(() => {
            //     if(album[1]) {
            //         window.location.assign(`/albums/public/${id}`)
            //     } else {
            //         window.location.assign(`/albums/private/${id}`)
            //     }
            // }, 3000);
        } catch (error) {
            console.log(error)

            setJoining(false)

            toast.error("An error occured while joining the album")
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <Toaster />
            {!loading &&
                <main className='flex flex-col items-center w-full m-2'>
                    <Image src={album[6]} alt='' width={300} height={200} />
                    <div className='flex flex-col gap-1 items-center'>
                        <p className='font-bold text-2xl'>{album[4]}</p>
                        {!album[1] && <p className='text-gray-400 md:text-md text-xs'>Fee: {ethers.formatEther(album[2])} ETH</p>}
                        <p className='text-sm'>{album[5]}</p>
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

            {!loading &&
                <button className='flex items-center p-1 rounded-2xl gap-3 px-5 bg-[#5773ff] m-2' onClick={joinAlbum}>
                    {!joining && <IoAdd />}
                    {!joining && <p>Join Album</p>}
                    {joining &&
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
    )
}

export default Page;