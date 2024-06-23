import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex items-center justify-center pt-14 gap-5 flex-col">
      <Image
        src={"/image.svg"}
        alt=""
        width={250}
        height={100}
        className="w-86"
      />
      <div className="flex flex-col gap-4 items-center">
        <p className="font-bold text-3xl">No Photos uploaded yet!</p>
        <p>Connect your wallet to be able to upload and store your photos</p>
      </div>
    </div>
  );
}
