import React, { useEffect, useState } from 'react';
import './SkillsSection.css'
import ApiRequests from '../../api/requests/Api.requests';
import FeaturesHelper from '../../helpers/Features.helper';
import IntroSectionDividerComponent from '../Dividers/IntroSectionDivider.component';

const SkillsSectionComponents = () => {
    const [datas, setDatas] = useState({
        skills: localStorage.skills ? JSON.parse(localStorage.skills) : null,
        error: null
    })

    useEffect(() => {
        if (datas.skills === null || !localStorage.skills || FeaturesHelper.needCacheUpdate(JSON.parse(localStorage.skills).expiration)) {
            localStorage.removeItem('skills')
            ApiRequests.getSkills()
                .then(response => {
                    setDatas(datas => ({
                        ...datas,
                        skills: response
                    }))
                })
                .catch(error => {
                    setDatas(datas => ({
                        ...datas,
                        error: error.message
                    }))
                })
        }
    }, [datas.skills]);


    return (
        <section id="skills">
            <IntroSectionDividerComponent />
            <div className="skills_title_container">
                <h2>Mes compétences</h2>
            </div>
            <div className="skills_main_container">
                <div className="skills_illustration">
                    <img src={process.env.PUBLIC_URL + '/images/skills-illustration.png'} alt="Skills illustration" />
                </div>
                <div className="skills_infos">
                    {
                        datas.skills !== null &&
                        <div className='skills_icons'>
                            {
                                datas.skills.data.length &&
                                datas.skills.data.map(skill => (
                                    <div className='skill_icon_container' key={skill.id}>
                                        <div dangerouslySetInnerHTML={{ __html: skill.language_svg }} className='skill_icon' />
                                        <div className="skill_name_container">
                                            <p className="skill_name" style={{"--hover-color": skill.color}}>{skill.language_name}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </section>
    );
}

export default SkillsSectionComponents;
