"use client"

import Image from 'next/image';
import React, { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import AlbumModal from '../components/albumModal';
import { TbLibraryPhoto } from "react-icons/tb";

const Page = () => {
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsAlbumModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAlbumModalOpen(false);
    };

    return (
        <>
            <section className='p-3 md:px-44'>
                <main className="flex justify-between w-full">
                    <div>
                        <p className='font-bold text-xl '>Albums</p>
                        <p className='text-gray-400'>Create, view and share your albums</p>
                    </div>

                    <button className='flex items-center p-1 rounded-2xl gap-3 px-5 bg-[#5773ff]' onClick={handleOpenModal}>
                        <IoAdd />
                        <p>New Album</p>
                    </button>
                </main>

                <main className='flex flex-col items-center w-full '>
                    <Image src={"/album.svg"} alt='' width={300} height={200} />
                    <div className='flex flex-col gap-1 items-center'>
                        <p className='font-bold text-2xl'>No album created yet!!</p>
                        <p className='text-sm '>New albums will appear on this page</p>
                    </div>
                </main>
            </section>

            <AlbumModal isOpen={isAlbumModalOpen} onClose={handleCloseModal}>
                <div className="p-4">
                    <div className='flex flex-col items-center gap-3'>
                        <TbLibraryPhoto className='text-6xl' />
                        <h2 className="text-md font-medium mb-4">Create New Album</h2>
                    </div>

                    <form>
                        <div className="mb-4 flex flex-col gap-3">
                            <input
                                type="text"
                                id="Title"
                                name="Title"
                                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight  bg-[#37373b]"
                                placeholder="Title"
                            />

                            <input placeholder="Caption (Optional)" type="text" id="caption" className="block w-full p-4 text-gray-700 rounded-lg bg-[#37373b] text- " />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                className="bg-blue-500 rounded-md hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 w-full"
                                onClick={handleCloseModal}
                            >
                                Create Album
                            </button>
                        </div>
                    </form>
                </div>
            </AlbumModal>
        </>
    );
}

export default Page;
