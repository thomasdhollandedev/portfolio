/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './Header.css';
import { useEffect } from 'react';
import ApiRequests from '../../api/requests/Api.requests';

const HeaderComponent = ({ switchTheme, theme }) => {
    const [datas, setDatas] = useState({
        mainMenuLinks: localStorage.mainMenuLinks ? JSON.parse(localStorage.mainMenuLinks) : null,
        error: null
    })

    useEffect(() => {
        if (datas.mainMenuLinks === null || !localStorage.mainMenuLinks || JSON.parse(localStorage.mainMenuLinks).expiration < new Date().getTime()) {
            localStorage.removeItem('mainMenuLinks')
            console.log('expiré');
            ApiRequests.getMainMenuLinks()
                .then(response => {
                    setDatas(datas => ({
                        ...datas,
                        mainMenuLinks: response
                    }))
                })
                .catch(error => {
                    setDatas(datas => ({
                        ...datas,
                        error: error.message
                    }))
                })
        }
    }, [datas.mainMenuLinks]);

    const toggleMenu = async () => {
        const btn_burger = document.querySelector('.btn_burger')
        const overlay = document.querySelector('.overlay')
        const line1 = btn_burger.querySelector('span:nth-child(1)')
        const line2 = btn_burger.querySelector('span:nth-child(2)')
        const header = document.querySelector('header')

        if (btn_burger.classList.contains('active')) {
            document.body.style.overflowY = "auto"
            line1.style.animation = "0.6s ease 0s forwards line1_reverse"
            line2.style.animation = "0.6s ease 0s forwards line2_reverse"
            overlay.style.animation = "2s ease 0s forwards close_overlay"
        } else {
            document.body.style.overflowY = "hidden"
            line1.style.animation = "0.6s ease 0s forwards line1"
            line2.style.animation = "0.6s ease 0s forwards line2"
            overlay.style.display = 'flex'
            overlay.style.animation = "2s ease 0s forwards open_overlay"
        }

        overlay.addEventListener('animationend', () => {
            if (!btn_burger.classList.contains('active')) {
                overlay.style.display = 'none'
            }
        })

        btn_burger.classList.toggle('active')
        header.classList.toggle('active')
    }

    return (
        <>
            <header>
                <div className="left">
                    <a href="/"> </a>
                    <img src={process.env.PUBLIC_URL + '/images/logo-TD.svg'} alt="logo TD" />
                </div>
                <div className="right">
                    {
                        theme === 'light'
                            ?
                            <div icon="sunny" data-label="Sunny" onClick={switchTheme}>
                                <span className="sun"></span>
                            </div>
                            :
                            <div icon="supermoon" data-label="Cool!" onClick={switchTheme}>
                                <span className="moon"></span>
                                <span className="meteor"></span>
                            </div>
                    }

                    <button className="btn_burger" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
            <nav className='overlay'>
                <div>
                    <div>
                        <ul>
                            {
                                datas.mainMenuLinks !== null &&
                                <>
                                    {
                                        datas.mainMenuLinks.data.map(page => (
                                            <li key={page.id}>
                                                <a href={`${process.env.PUBLIC_URL}${page.page_absolute_path}`}>{page.page_display_title}</a>
                                            </li>
                                        ))
                                    }
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default HeaderComponent;
