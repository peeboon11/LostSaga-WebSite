import React from 'react'
import style from '../../styles/News.module.css'
import character from '../../public/238text.png'


function News() {
    return (
        <>
        <link href='https://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet'></link>
            <div className={style.title}>
                <h1>News</h1>
            </div>
            <div className={style.newsbox}>
                <div className={style.news}>
                    <div className={style.newsimg}>
                        <img src={character.src} alt="" />
                    </div>
                    <div className={style.newstext}>
                        <h1>New Hero Furious</h1>
                        <p>Update 12/07/2021</p>
                    </div>
                </div>
                <div className={style.news}>
                    <div className={style.newsimg}>
                        <img src={character.src} alt="" />
                    </div>
                    <div className={style.newstext}>
                        <h1>New Hero Furious</h1>
                        <p>Update 12/07/2021</p>
                    </div>
                </div>
                <div className={style.news}>
                    <div className={style.newsimg}>
                        <img src={character.src} alt="" />
                    </div>
                    <div className={style.newstext}>
                        <h1>New Hero Furious</h1>
                        <p>Update 12/07/2021</p>
                    </div>
                </div>
                <div className={style.news}>
                    <div className={style.newsimg}>
                        <img src={character.src} alt="" />
                    </div>
                    <div className={style.newstext}>
                        <h1>New Hero Furious</h1>
                        <p>Update 12/07/2021</p>
                    </div>
                </div>
                <div className={style.news}>
                    <div className={style.newsimg}>
                        <img src={character.src} alt="" />
                    </div>
                    <div className={style.newstext}>
                        <h1>New Hero Furious</h1>
                        <p>Update 12/07/2021</p>
                    </div>
                </div>
            </div>
        </>

    )
}

export default News