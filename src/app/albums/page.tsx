"use client"

import React, { useState } from 'react'
import QRCode from "react-qr-code"

const page = () => {
    const [url, setUrl] = useState("")
    const [qrCode, setQRCode] = useState(false)

    const handleQrCodeGenerator = () => {
        console.log(url)

        if(url != "") {
            setQRCode(true)
        }
    }

    return (
        <>
            <div>albums</div>
            <div>
                <input
                    type="text"
                    placeholder="Enter a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <button onClick={handleQrCodeGenerator}>Generate QR Code</button>
            </div>

            {qrCode && <QRCode value={url} size={300} />}
        </>
    )
}

export default page