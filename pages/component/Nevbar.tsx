import Link from 'next/link'
import React from 'react'
import style from '../../styles/Nevbar.module.css'
import logo from '../../public/logow.png'
import { useState } from 'react';

function Nevbar() {
    const [showMenu, setShowMenu] = useState(false)


    return (
        <div className={style.main}>
            <div className={style.linkleft}>
                <Link href="/">
                    <img src={logo.src} alt="" className={`${style.imagelogo} ${style.imagelogoFlip}`} />
                </Link>
                <div className={style.burgerMenu} onClick={() => setShowMenu(!showMenu)}>
                    <div className={style.burgerLine}></div>
                    <div className={style.burgerLine}></div>
                    <div className={style.burgerLine}></div>
                </div>
                <div className={`${style.links} ${showMenu ? style.showMenu : ''}`}>
                    <div className={style.linkright}>
                        <Link href="/" className={style.defaultbtn}>
                            <div>
                                HOME
                            </div>
                        </Link>
                        <Link href="https://discord.gg/DUrCkHs2m6" className={style.defaultbtn}>
                            <div>
                                DISCORD
                            </div>
                        </Link>

                        <Link href="/Register" className={style.registerbtnleft}>
                            <div>
                                REGISTER
                            </div>
                        </Link>
                        {/* <Link href="https://drive.google.com/file/d/1nyOGPkI5doLNrEZrYbI1MneEDG_n5m0G/view?usp=sharing">
                            <div className={style.downloadbtnleft}>
                                DOWNLOAD
                            </div>
                        </Link> */}
                    </div>
                    <div className={style.linkright}>
                        <Link href="/Register" className={style.registerbtn}>
                            <div>
                                REGISTER
                            </div>
                        </Link>
                        {/* <Link href="https://drive.google.com/file/d/1nyOGPkI5doLNrEZrYbI1MneEDG_n5m0G/view?usp=sharing">
                            <div className={style.downloadbtn}>
                                DOWNLOAD
                            </div>
                        </Link> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Nevbar