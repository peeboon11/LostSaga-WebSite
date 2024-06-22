"use client";
import React, { use } from 'react'
import style from '../../styles/RegisterForm.module.css'
import { useState } from 'react'
import wallpaper from '../../public/238.png'
import ReCAPTCHA from "react-google-recaptcha";
require('dotenv').config();


function RegisterForm() {
    const [captchaValue, setCaptchaValue] = useState(null);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'default-site-key';

    const [data, setData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const handleCaptchaChange = (value: any) => {
        setCaptchaValue(value);
    };

    const handleSubmit = async (e: any) => {
        const checkNameAndUsername = () => {
            const thaiRegex = /[ก-๙]/;
            if (thaiRegex.test(data.name) || thaiRegex.test(data.username) || thaiRegex.test(data.password) || thaiRegex.test(data.email)) {
                alert('ชื่อในเกม, Username, Password, Email ไม่สามารถใช้ภาษาไทยได้');
                return;
            }
        }

        e.preventDefault();
        if (!captchaValue) {
            alert('Please complete the CAPTCHA');
            return;
        }

        const response = await fetch('/api/verifycaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: captchaValue
            })
        });

        const result = await response.json();
        if (result.success) {
            checkNameAndUsername();
            if (data.name.includes('[GM]') || data.username.includes('[GM]')) {
                alert('ชื่อในเกม หรือ username ห้ามใช้ [GM] อยู่ในชื่อ');
                return;
            }
            if (data.name.toLowerCase().startsWith('gm') || data.username.toLowerCase().startsWith('gm') || data.name.toLowerCase().startsWith('admin') || data.username.toLowerCase().startsWith('admin') || data.name.toLowerCase().startsWith('developer') || data.username.toLowerCase().startsWith('developer') || data.name.toLowerCase().startsWith('dev') || data.username.toLowerCase().startsWith('dev')) {
                alert('ชื่อในเกม หรือ username ห้ามขึ้นต้นด้วย gm , GM , admin, dev หรือ developer');
                return;
            }
            const checkFirstWord = () => {
                const firstWord = data.name.split(' ')[0];
                if (firstWord.toLowerCase() === '[GM]' || firstWord.toLowerCase() === 'gm' || firstWord.toLowerCase() === 'admin' || firstWord.toLowerCase() === 'developer' || firstWord.toLowerCase() === 'dev') {
                    alert('ชื่อในเกม หรือ username ห้ามใช้คำว่า GM, admin, dev หรือ developer อยู่ในชื่อ');
                    return;
                }
            }
            checkFirstWord();
            if (data.name.length < 3) {
                alert('ชื่อในเกม ขั้นต่ำ 3 ตัวอักษร');
                return;
            }
            if (data.name.length > 10) {
                alert('ชื่อในเกม ได้สูงสุด 10 ตัวอักษร');
                return;
            }
            if (data.username.length < 4) {
                alert('Username ขั้นต่ำ 4 ตัวอักษร');
                return;
            }
            if (data.name.length > 12) {
                alert('Username ได้สูงสุด 12 ตัวอักษร');
                return;
            }
            // Check password
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharRegex.test(data.password)) {
                alert('Password ไม่สามารถใช้อักษรพิเศษได้');
                return;
            }
            if (data.password.length < 6) {
                alert('Password ต้องมีขั้นต่ำ 6 หลัก');
                return;
            }
            if (data.password.length > 12) {
                alert('Password สูงสุด 12 หลัก');
                return;
            }
            // Check confirmPassword
            if (data.password !== data.confirmPassword) {
                alert('Confirm password does not match');
                return;
            }
            // Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Invalid email format');
                return;
            }
            try {
                const response = await fetch('/api/chackemail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: data.email, username: data.username, name: data.name })
                });
                if (response.ok) {
                    const response = await fetch('/api/sentregister', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: data.name,
                            username: data.username,
                            password: data.password,
                            email: data.email
                        })
                    });
                    if (response.ok) {
                        alert('สมัครสมาชิก สำเร็จแล้ว');
                        window.location.href = '/';
                    } else {
                        alert('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง');
                    }
                } else if (response.status === 110) {
                    alert('Email นี้เคยถูกสมัครไปแล้ว');
                } else if (response.status === 120) {
                    alert('Username นี้ถูกใช้ไปแล้ว');
                } else if (response.status === 130) {
                    alert('ชื่อในเกมนี้ถูกใช้ไปแล้ว');
                } else {
                    alert('Email Username ชื่อในเกมนี้ ถูกใช้ไปแล้ว กรุณาลองใหม่อีกครั้ง / โปรดแจ้งแอดมิน');
                }
            } catch (error) {
                console.error('Error checking email:', error);
                alert('An error occurred while checking email');
            }
        } else {
            alert('CAPTCHA verification failed');
        }

        // Check name and username

        // checkNameAndUsername();
        // if (data.name.includes('[GM]') || data.username.includes('[GM]')) {
        //     alert('ชื่อในเกม หรือ username ห้ามใช้ [GM] อยู่ในชื่อ');
        //     return;
        // }
        // if (data.name.toLowerCase().startsWith('gm') || data.username.toLowerCase().startsWith('gm') || data.name.toLowerCase().startsWith('admin') || data.username.toLowerCase().startsWith('admin') || data.name.toLowerCase().startsWith('developer') || data.username.toLowerCase().startsWith('developer') || data.name.toLowerCase().startsWith('dev') || data.username.toLowerCase().startsWith('dev')) {
        //     alert('ชื่อในเกม หรือ username ห้ามขึ้นต้นด้วย gm , GM , admin, dev หรือ developer');
        //     return;
        // }
        // const checkFirstWord = () => {
        //     const firstWord = data.name.split(' ')[0];
        //     if (firstWord.toLowerCase() === '[GM]' || firstWord.toLowerCase() === 'gm' || firstWord.toLowerCase() === 'admin' || firstWord.toLowerCase() === 'developer' || firstWord.toLowerCase() === 'dev') {
        //         alert('ชื่อในเกม หรือ username ห้ามใช้คำว่า GM, admin, dev หรือ developer อยู่ในชื่อ');
        //         return;
        //     }
        // }
        // checkFirstWord();
        // if (data.name.length < 3) {
        //     alert('ชื่อในเกม ขั้นต่ำ 3 ตัวอักษร');
        //     return;
        // }
        // if (data.name.length > 10) {
        //     alert('ชื่อในเกม ได้สูงสุด 10 ตัวอักษร');
        //     return;
        // }
        // if (data.username.length < 4) {
        //     alert('Username ขั้นต่ำ 4 ตัวอักษร');
        //     return;
        // }
        // if (data.name.length > 12) {
        //     alert('Username ได้สูงสุด 12 ตัวอักษร');
        //     return;
        // }
        // // Check password
        // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        // if (specialCharRegex.test(data.password)) {
        //     alert('Password ไม่สามารถใช้อักษรพิเศษได้');
        //     return;
        // }
        // if (data.password.length < 6) {
        //     alert('Password ต้องมีขั้นต่ำ 6 หลัก');
        //     return;
        // }
        // if (data.password.length > 12) {
        //     alert('Password สูงสุด 12 หลัก');
        //     return;
        // }
        // // Check confirmPassword
        // if (data.password !== data.confirmPassword) {
        //     alert('Confirm password does not match');
        //     return;
        // }
        // // Check email format
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(data.email)) {
        //     alert('Invalid email format');
        //     return;
        // }
        // try {
        //     const response = await fetch('/api/chackemail', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email: data.email, username: data.username, name: data.name })
        //     });
        //     if (response.ok) {
        //         const response = await fetch('/api/sentregister', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 name: data.name,
        //                 username: data.username,
        //                 password: data.password,
        //                 email: data.email
        //             })
        //         });
        //         if (response.ok) {
        //             alert('สมัครสมาชิก สำเร็จแล้ว');
        //             window.location.href = '/';
        //         } else {
        //             alert('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง');
        //         }
        //     } else if (response.status === 110) {
        //         alert('Email นี้เคยถูกสมัครไปแล้ว');
        //     } else if (response.status === 120) {
        //         alert('Username นี้ถูกใช้ไปแล้ว');
        //     } else if (response.status === 130) {
        //         alert('ชื่อในเกมนี้ถูกใช้ไปแล้ว');
        //     } else {
        //         alert('Email Username ชื่อในเกมนี้ ถูกใช้ไปแล้ว กรุณาลองใหม่อีกครั้ง / โปรดแจ้งแอดมิน');
        //     }
        // } catch (error) {
        //     console.error('Error checking email:', error);
        //     alert('An error occurred while checking email');
        // }
    }


    return (
        <div className={style.backG}>
            <img src={wallpaper.src} alt="" className={style.wallpaper} />
            <link href='https://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet'></link>
            <div className={style.main}>
                <div className={style.boxfrom}>
                    <h1 className={style.title}>Register</h1>
                    <form className={style.formmain}>
                        <div className={style.form}>
                            <label htmlFor="name">In Game Name :</label>
                            <input onChange={handleChange} type="text" id="name" name="name" required />
                        </div>
                        <div className={style.form}>
                            <label htmlFor="name">Username :</label>
                            <input onChange={handleChange} type="text" id="username" name="username" required />
                        </div>

                        <div className={style.form}>
                            <label htmlFor="password">Password :</label>
                            <input onChange={handleChange} type="password" id="password" name="password" required />
                        </div>
                        <div className={style.form}>
                            <label htmlFor="confirmPassword">Confirm Password :</label>
                            <input onChange={handleChange} type="password" id="confirmPassword" name="confirmPassword" required />
                        </div>
                        <div className={style.form}>
                            <label htmlFor="email">Email :</label>
                            <input onChange={handleChange} type="email" id="email" name="email" required />
                        </div>

                        {siteKey ? (
                            <ReCAPTCHA
                                sitekey={siteKey}
                                onChange={handleCaptchaChange}
                            />
                        ) : (
                            <p>Error: ReCAPTCHA site key is not defined</p>
                        )}
                        <br />
                        <button onClick={handleSubmit} type="submit">REGISTER</button>
                    </form>
                </div>
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </div>
        </div>
    )
}

export default RegisterForm