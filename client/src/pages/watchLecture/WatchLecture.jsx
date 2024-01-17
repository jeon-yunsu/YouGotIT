import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS를 프로젝트에 추가해주세요
import './style.scss';

const WatchLecture = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className='watch-lecture'>
            <div className={`container-fluid watch-lecture ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className='sidebar-toggle' >
                    {/* 사이드바 열기 전에 메뉴를 보여주는 버튼 */}
                    <div className='menu-item'>
                        <div className='menu-item-container' onClick={toggleSidebar}>
                            <img className='menu-item-image' src="https://cdn2.iconfinder.com/data/icons/audio-file-extension-line/64/AUDIO_FILE_EXTENSION_TOC-512.png" alt="" />
                            <div className='menu-item-title'>커리큘럼</div>
                        </div>
                    </div>
                </div>
                {sidebarOpen && (
                    <div className='sidebar fixed-sidebar'>
                        {/* Sidebar 컨텐츠를 여기에 추가하세요 */}
                        <p>Sidebar Contents</p>

                    </div>
                )}
                <div className={`content ${sidebarOpen ? 'content-sidebar-open' : ''}`}>
                    <hr className='my-4' />
                    <div className='row toc-container'>
                        <div className='col-10 toc-title'>제목</div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <video
                                id="my-video"
                                className="video-js w-100"
                                controls
                                preload="auto"
                                poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                                data-setup=''
                                loop
                            >
                                <source
                                    src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4"
                                    type='video/mp4'
                                />
                            </video>
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className='col-6 text-center'>
                            <button className='btn btn-outline-secondary w-100'>Prev</button>
                        </div>
                        <div className='col-6 text-center'>
                            <button className='btn btn-outline-secondary w-100'>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchLecture;
