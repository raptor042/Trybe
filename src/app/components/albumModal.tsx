"use client"
import { IoMdClose } from "react-icons/io";
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AlbumModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div className="relative bg-[#19191B] p-4 rounded-lg">
                <button className="absolute top-2 right-2 text-black rounded-full p-2" onClick={onClose}>
                    <IoMdClose className="text-white" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default AlbumModal;
