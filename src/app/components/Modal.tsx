"use client"

import React from 'react';
import { IoMdClose } from "react-icons/io";

import Image from 'next/image';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string | null; // Accepts null as well
    mime: string | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, url, mime }) => {
    if (!isOpen || !url) return null; // Render nothing if not open or url is null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <button
                className="absolute top-2 right-2 text-black  rounded-full p-2"
                onClick={onClose}
            >
                <IoMdClose className="text-white text-2xl" />
            </button>
            <div className="relative bg-[#19191B] p-4 rounded-lg">
                {url && (
                    <div className="flex justify-center items-center">
                        {mime?.includes("image") &&
                            <Image
                                src={url}
                                alt="Modal Image"
                                width={400}
                                height={400}
                                className="object-contain"
                            />
                        }
                        {mime?.includes("video") &&
                            <video controls width={300} height={150}>
                                <source type={mime} src={url} />
                            </video>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
