"use client"
import { IoMdClose } from "react-icons/io";
import React from 'react';
import Link from "next/link";
import { IoDownload } from "react-icons/io5";
import Image from "next/image";
import download from "downloadjs";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string | null;
    date: string | null;
}

const ImageModal: React.FC<ModalProps> = ({ isOpen, onClose, url, date }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const downloadIMG = () => {
        download(url!, "photo.png")
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div className="relative bg-[#19191B] p-4 rounded-lg">
                <button className="absolute top-2 right-2 text-black rounded-full p-2" onClick={onClose}>
                    <IoMdClose className="text-white" />
                </button>
                <div id="qr-code" className="relative bg-[#19191B] p-4 rounded-lg mt-4 mb-2">
                    {url && <Image src={url} width={300} height={150} alt="" />}
                </div>
                <div className='flex items-center justify-between m-3'>
                    {date && <p className='text-sm font-medium text-center text-white'>{date}</p>}
                    <div className='flex justify-center m-3'>
                        <button onClick={downloadIMG} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Download
                            <IoDownload />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;