"use client"

import React from 'react';
import Image from 'next/image';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null; // Accepts null as well
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen || !imageUrl) return null; // Render nothing if not open or imageUrl is null

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
            <div className="relative bg-[#19191B] p-4 rounded-lg">
                <button
                    className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2"
                    onClick={onClose}
                >
                    &times;
                </button>
                {imageUrl && (
                    <div className="flex justify-center items-center">
                        <Image
                            src={imageUrl}
                            alt="Modal Image"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
