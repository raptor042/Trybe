"use client"

import React, { useRef } from 'react';
import { IoMdClose } from "react-icons/io";

import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";
import { IoDownload } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import download from "downloadjs";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string | null; // Accepts null as well
}

const QRCodeModal: React.FC<ModalProps> = ({ isOpen, onClose, url }) => {
    if (!isOpen || !url) return null; // Render nothing if not open or url is null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const qrCodeRef = document.getElementById("code")!;

    const downloadQRCode = () => {
        htmlToImage
          .toPng(qrCodeRef)
          .then(function (dataUrl) {
            download(dataUrl, "qr-code.png")
          })
          .catch(function (error) {
            console.error("Error generating QR code:", error);

            toast.error("Error downloading QR code.")
          });
      };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <Toaster />
            <button
                className="absolute top-2 right-2 text-black  rounded-full p-2"
                onClick={onClose}
            >
                <IoMdClose className="text-white text-2xl" />
            </button>
            <div id="code" className="relative bg-[#19191B] p-4 rounded-lg m-2">
                {url && <QRCode value={url} size={300} />}
            </div>
            <div className='flex justify-center m-2'>
                <button onClick={downloadQRCode} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Download
                    <IoDownload />
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;