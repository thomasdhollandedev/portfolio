import React from 'react';
import './IntroSection.css'

const IntroSectionComponent = () => {
    return (
        <section id='intro'>
            <div className="main_container">
                <div className="infos">
                    <h1>Thomas Dhollande</h1>
                    <h2>Développeur web</h2>
                    <p>Bienvenue sur mon portfolio !</p>
                    <p>
                        Je m'appelle Thomas Dhollande, j'ai 23 ans et je suis développeur web depuis 3 ans chez Kapela by Constellation. Vous trouverez sur ce site, mes compétences ainsi que mes projets personnels réalisés depuis que je suis développeur.
                    </p>
                    <div className="buttons">
                        <a href="/skills" className='button'>
                            <span>
                                Mes compétences
                            </span>
                            <i></i>
                        </a>
                        <a href="/projects" className='button'>
                            <span>
                                Mes projets
                            </span>
                            <i></i>
                        </a>
                    </div>
                </div>
                <div className='illustration'>
                    <img src={process.env.PUBLIC_URL + '/images/thomas-dhollande.png'} alt="Thomas Dhollande" />
                </div>
            </div>
        </section>
    );
}

export default IntroSectionComponent;
