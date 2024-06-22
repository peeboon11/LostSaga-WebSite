import Head from 'next/head'
import React, { useRef } from 'react'
import Nevbar from './component/Nevbar'
import style from '../styles/Donate.module.css'
import coin from '../public/coin.png'
import { useState } from 'react'
import DonateBox from './component/DonateBox'
import QRCode from 'qrcode';
import TU2 from '../public/TU2.png'

function Donate() {
    const generatePayload = require('promptpay-qr');
    const canvasRef = useRef(null);
    const donationOptions = [
        { amount: 50, cash: 5000, bonus: null },
        { amount: 100, cash: 10500, bonus: 5 },
        { amount: 200, cash: 22000, bonus: 10 },
        { amount: 300, cash: 34500, bonus: 15 },
        { amount: 500, cash: 60000, bonus: 20 },
    ];

    const [selectedDonation, setSelectedDonation] = useState({
        amount: 0,
        cash: 0,
        bonus: 0
    });

    const [datasent, setDatasent] = useState({
        username: null,
        amount: 0,
    })
    const [donateready, setDonateready] = useState(false);
    const [sentSlip, setSentSlip] = useState(false);
    const [file, setFile] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);

    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDonationClick = (option: any) => {
        setSelectedDonation(option);
        setDatasent({
            ...datasent,
            amount: option.amount
        })
        setDonateready(false);
    };

    const handleChangeUsername = (event: any) => {
        setDatasent({
            ...datasent,
            username: event.target.value
        })
    }

    const handleSentslip = () => {
        setSentSlip(true);
    }


    const handleSubmit = async () => {
        if (!datasent || !datasent.username) {
            alert('Please enter a username.');
            return;
        } else if (datasent?.amount === 0 || datasent?.amount == null) {
            alert('Please select a donation amount.');
            return;
        } else {
            try {
                const response = await fetch('/api/chackusername', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: datasent.username })
                });
                if (response.ok) {
                    const mobileNumber = process.env.NEXT_PUBLIC_MOBILE_NUMBER
                    const amount = datasent?.amount
                    const payload = generatePayload(mobileNumber, { amount })

                    QRCode.toCanvas(canvasRef.current, payload, { errorCorrectionLevel: 'H' }, function (err) {
                        if (err) throw err;
                        setDonateready(true);
                    });
                } else {
                    alert('ไม่พบ Username นี้ในระบบ');
                }
            } catch (error) {
                alert('พบปัญหาในการเชื่อมต่อกับเซิฟเวอร์');
            }

        }
    };




    return (
        <div>
            <link href='https://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet'></link>
            <Head>
                <title>Lost Saga Thailand</title>
            </Head>
            <Nevbar />

            <div className={style.donatezone}>
                <div className={style.titleDonate}>Donate</div>
                <div className={style.phase1}>
                    {donationOptions.map((option, index) => (
                        <DonateBox
                            key={index}
                            amount={option.amount}
                            cash={option.cash}
                            bonus={option.bonus}
                            onClick={() => handleDonationClick(option)}
                        />
                    ))}
                </div>
                <div className={style.phase2}>
                    {selectedDonation && selectedDonation.amount !== 0 && selectedDonation.bonus !== 0 && selectedDonation.cash !== 0 && (
                        <div className={style.form}>
                            <div className={style.titleDonate}><img src={coin.src} alt="coin" width={40} /> {selectedDonation.amount} THB</div>
                            <div className={style.detile}>
                                <div>{selectedDonation.cash} CASH {selectedDonation.bonus ? `(+${selectedDonation.bonus}%)` : ""}</div>
                            </div>
                            <div className={style.forminput}>
                                <div>Username</div>
                                <input type="text" placeholder="Username" className={style.input} onChange={handleChangeUsername} disabled={donateready} />
                                <div className={style.btndonate}>
                                    <button className={style.submit} onClick={handleSubmit}>Donate</button>
                                </div>

                                <div className={donateready ? style.qrcode : style.qrcodedisble}>
                                    <div>Scan QR Code to Donate</div>
                                    <canvas ref={canvasRef}></canvas>
                                    <div className={style.btndonate}>
                                        <button className={style.submit} onClick={handleSentslip}>
                                            Slip Verification (เช็คสลิป)
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                    {/* <pre>{JSON.stringify(datasent, null, 2)}</pre> */}
                    {sentSlip && donateready && (
                        <div className={style.slip}>
                            <div className={style.titleslip}>Slip Verification</div>
                            <div className={style.Upload}>
                                <form onSubmit={handleSubmit}>
                                    <img src={TU2.src} alt="" />
                                    <div className={style.Uploadfile}>
                                        <label>
                                            Upload Slip Image:
                                        </label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                    <div className={style.btndonate}>
                                        <button className={style.submit} type="submit">Verify</button>

                                    </div>
                                </form>
                                {verificationResult && (
                                    <div>
                                        {verificationResult === 'verified' && <div>Slip verified successfully!</div>}
                                        {verificationResult === 'invalid' && <div>Invalid slip. Please check the details and try again.</div>}
                                    </div>
                                )}
                            </div>

                        </div>

                    )}
                </div>
            </div>

        </div>
    )
}

export default Donate