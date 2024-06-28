"use client"
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Modal from './components/model';


// Define the type for the file objects
interface FileObject {
  url: string;
  cid: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileObject[]>([]); // Array to store uploaded files
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    const res = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const ipfsHash = await res.text();
    return { url: URL.createObjectURL(fileToUpload), cid: ipfsHash };
  };

  const handleFilesUpload = async (filesToUpload: File[]) => {
    setUploading(true);
    const uploadedFiles: FileObject[] = [];
    for (const file of filesToUpload) {
      try {
        const uploadedFile = await uploadFile(file);
        uploadedFiles.push(uploadedFile);
      } catch (e) {
        console.log(e);
        alert("Trouble uploading file");
      }
    }
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]); // Append the new files to the existing state
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(e.target.files || []);
    handleFilesUpload(filesArray);
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      const recentImageUrl = `https://ipfs.io/ipfs/${json.ipfs_pin_hash}`;
      setFiles([{ url: recentImageUrl, cid: json.ipfs_pin_hash }]);
    } catch (e) {
      console.log(e);
      alert("Trouble loading files");
    }
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
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleChange}
        multiple
        style={{ display: "none" }}
      />
      <div>

      </div>
      {files.length === 0 ? (
        <div className="mt-5 text-center flex flex-col items-center">
          <Image src={"/image.svg"} alt='' width={250} height={200} />
          <div className='flex flex-col gap-2'>
            <p className="font-bold text-3xl">No photos uploaded yet!</p>
            <p>connect your wallet to be able to upload and store your photos</p>
          </div>
          <button
            disabled={uploading}
            onClick={() => inputFile.current?.click()} // Safely use optional chaining
            className="w-[150px] bg-secondary bg-[#5773ff] text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {files.map((file, index) => (
            <div key={index} className="relative w-full h-0 pb-[66.66%]" onClick={() => openModal(file.url)}>
              <Image
                src={file.url}
                alt={`Uploaded Image ${index}`}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
      )}
    </section>
  );
}
