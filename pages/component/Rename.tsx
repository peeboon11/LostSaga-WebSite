import style from '../../styles/Information.module.css'
import character from '../../public/Furious.png'
import React, { useState } from 'react';
import wallpaper from '../../public/238.png'
import Logo from '../../public/logow.png'
import Link from 'next/link';
import handler from '../api/chackemail';
import { json } from 'stream/consumers';



function Rename() {
    const [data, setData] = useState({
        username: '',
        password: '',
    })
    const [datalogin, setDatalogin] = useState({
        username: '',
        oldname: '',
    })
    const [datanewname, setDatanewname] = useState({
        newname: '',
    })
    const [modal, setModal] = useState(false)
    const [modallogin, setModallogin] = useState(true)
    const [modalconfrim, setModalconfrim] = useState(false)


    const handlerdata = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handlerdatanewname = (e: any) => {
        setDatanewname({ ...datanewname, [e.target.name]: e.target.value })
    }

    const submit = () => {
        setModalconfrim(true)
        // sentnewname(datanewname.newname)


    }

    const sentnewname = (name: any , username: any) => {
        if (name.includes('[GM]')) {
            alert('ชื่อในเกม หรือ username ห้ามใช้ [GM] อยู่ในชื่อ');
            return;
        }
        if (name.toLowerCase().startsWith('gm') || name.toLowerCase().startsWith('admin') ||
            name.toLowerCase().startsWith('developer') || name.toLowerCase().startsWith('dev')
        ) {
            alert('ชื่อในเกม หรือ username ห้ามขึ้นต้นด้วย gm , GM , admin, dev หรือ developer');
            return;
        }
        const checkFirstWord = () => {
            const firstWord = name.split(' ')[0];
            if (firstWord.toLowerCase() === '[GM]' || firstWord.toLowerCase() === 'gm' || firstWord.toLowerCase() === 'admin' || firstWord.toLowerCase() === 'developer' || firstWord.toLowerCase() === 'dev') {
                alert('ชื่อในเกม หรือ username ห้ามใช้คำว่า GM, admin, dev หรือ developer อยู่ในชื่อ');
                return;
            }
        }
        checkFirstWord();
        if (name.length < 3) {
            alert('ชื่อในเกม ขั้นต่ำ 3 ตัวอักษร');
            return;
        }
        if (name.length > 20) {
            alert('ชื่อในเกม ได้สูงสุด 20 ตัวอักษร');
            return;
        }

        try {
            fetch('/api/changename', {
                method: 'POST',
                body: JSON.stringify({ username: username, newname: name }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(res => {
                console.log(res);
                if (res.message === "Change Name Success") {
                    alert(res.message)
                    window.location.reload();
                } else {
                    alert(res.message)
                    window.location.reload();
                }
            })
        } catch (error) {
            console.log(error);
            window.location.reload();
        }
    }

    const sentlogin = () => {
        try {
            fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(res => {
                if (res.message === "login success") {
                    setModallogin(false)
                    setModal(true)
                    setDatalogin({ username: res.username, oldname: res.oldname })
                } else {
                    alert(res.message)
                    setModal(false)
                    setModallogin(true)
                }
            })
        } catch (error) {
            console.log(error);
            window.location.reload();
        }
    }


    return (
        <div style={{ backgroundColor: "black" }}>
            <link href='https://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet'></link>
            <div className={style.main}>
                <img src={wallpaper.src} alt="" className={style.wallpaper} />
                <div className={style.box3}>
                    {modallogin ?
                        <>
                            <div className={style.login}>
                                <div>
                                    <h2>Login</h2>
                                    <input type="text" name='username' placeholder="Username" onChange={handlerdata} />
                                    <input type="password" name='password' placeholder="Password" onChange={handlerdata} />
                                    <button type="submit" onClick={sentlogin}>Login</button>
                                    <p>Don't have an account? <Link href="/Register" style={{ color: "green", textDecoration: "underline" }}>Sign up</Link></p>
                                </div>
                            </div>
                        </>
                        : null}
                    {modal ? <><div className={style.login}>
                        <div>
                            <h2>Change Name</h2>
                            <h2>Old Name : {datalogin.oldname}</h2>
                            <input type="text" placeholder="New Name" name='newname' onChange={handlerdatanewname} />
                            <button type="submit" onClick={submit}>Change Name</button>
                            {/* <pre>{JSON.stringify(datanewname, null, 2)}</pre> */}
                        </div>
                    </div>

                    </> : null}

                    {
                        modalconfrim ? <>
                            <div className={style.login2}>
                                คุณต้องการเปลี่ยนชื่อเป็น {datanewname.newname} ใช่หรือไม่
                                <div className={style.confirmchangename}>
                                    <button onClick={() => sentnewname(datanewname.newname, datalogin.username)} className={style.confirmchangenamebutton1}>ใช่</button>
                                    <button onClick={() => setModalconfrim(false)} className={style.confirmchangenamebutton2}>ไม่</button>
                                </div>

                            </div>

                        </> : null
                    }

                </div>
            </div>
        </div>
    )
}

export default Rename