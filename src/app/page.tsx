"use client"
import React, { useState, useRef, useEffect, useContext } from 'react';
import Image from 'next/image';
import Modal from './components/Modal';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserProvider, ethers } from 'ethers';
import { TRYBE_ABI, TRYBE_CA } from './config';
import { store } from './context/store';

export default function Home() {
  // const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement>(null);

  const { state, dispatch } = useContext(store)!
  const { files } = state

  const { address, isConnected } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();

  let provider: BrowserProvider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider);
  }

  useEffect(() => {
    getImages()
  }, [address, isConnected])

  const setFiles = (files: string[]) => {
    dispatch({
        type : "SET_FILES",
        payload : files
    })
  }

  const addFile = (file: string) => {
    dispatch({
        type : "ADD_FILE",
        payload : file
    })
  }

  const getImages = async () => {
    const signer = await provider?.getSigner();

    const trybe = new ethers.Contract(
      TRYBE_CA,
      TRYBE_ABI,
      signer
    );

    try {
      const images = await trybe.getImages()
      console.log(images)

      setFiles(images)
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
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    const signer = await provider?.getSigner();

    const trybe = new ethers.Contract(
      TRYBE_CA,
      TRYBE_ABI,
      signer
    );

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadedFile = await uploadFile(files[i]);

        await trybe.upload(uploadedFile);

        trybe.on("Upload", (user, url, createdAt, e) => {
          console.log(user, url, createdAt);

          toast.success(`You successfully created an image.`);
        })

        addFile(uploadedFile); // Append the new files to the existing state
      }
  
      setUploading(false);
    } catch (e) {
      console.log(e);
      toast.error("Trouble uploading file");
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = e?.target?.files;
    handleFileUpload(filesArray!);
  };

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImageUrl(null);
  };

  return (
    <section className='p-10'>
      <Toaster />
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleChange}
        style={{ display: "none" }}
        multiple
      />
      <div>

      </div>
      {files.length === 0 && !loading &&
        <div className="mt-5 text-center flex flex-col items-center">
          <Image src={"/image.svg"} alt='' width={250} height={200} />
          <div className='flex flex-col gap-2 m-2'>
            <p className="font-bold text-3xl">No photos uploaded yet!</p>
            <p>connect your wallet to be able to upload and store your photos</p>
          </div>
          <button
            disabled={uploading && !isConnected}
            onClick={() => inputFile.current?.click()} // Safely use optional chaining
            className="m-2 w-[150px] bg-secondary bg-[#5773ff] text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      }
      {loading &&
        <div role="status" className="flex flex-col justify-center items-center">
            <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
      }
      {files.length > 0 && !loading &&
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-5">
          {files.map((file, index) => (
            <div key={index} className="relative w-full h-0 pb-[66.66%]" onClick={() => openModal(file)}>
              <Image
                src={file}
                alt={`Uploaded Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          ))}
        </div>
      }
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
      )}
    </section>
  );
}
