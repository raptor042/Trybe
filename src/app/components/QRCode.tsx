"use client"

import React from 'react';
import { IoMdClose } from "react-icons/io";

import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";
import { IoCopy, IoDownload } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import download from "downloadjs";
import Link from 'next/link';

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

    let copied = false

    const downloadQRCode = () => {
        htmlToImage
          .toPng(document.getElementById("qr-code")!)
          .then(function (dataUrl) {
            download(dataUrl, "qr-code.png")
          })
          .catch(function (error) {
            console.error("Error generating QR code:", error);

            toast.error("Error downloading QR code.")
          });
    };

    const copyText = async () => {
        await navigator.clipboard.writeText(url)
        copied = true

        setTimeout(() => {
            copied = false
        }, 2000);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div className="relative bg-[#19191B] p-4 rounded-lg">
                <button className="absolute top-2 right-2 text-black rounded-full p-2" onClick={onClose}>
                    <IoMdClose className="text-white" />
                </button>
                <div id="qr-code" className="relative bg-[#19191B] p-4 rounded-lg mt-4 mb-2">
                    {url && <QRCode value={url} size={300} />}
                </div>
                <div className='flex items-center gap-2 m-3'>
                    <Link href={url} className='text-sm font-medium text-center text-white'>{url}</Link>
                    <button onClick={copyText} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {!copied && "Copy"}
                        {!copied && <IoCopy />}
                        {copied && "Copied"}
                    </button>
                </div>
                <div className='flex justify-center m-3'>
                    <button onClick={downloadQRCode} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Download
                        <IoDownload />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;