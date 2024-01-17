import React, { useState }  from 'react'
import { Link } from 'react-router-dom'
import './style.scss'


const StarRatings = ({ rating }) => {
    const ratingToPercent = () => {
      const score = +rating * 20;
      return score + 1.5;
    };
  
    return (
      <div className="star-ratings">
        <div
          className="star-ratings-fill space-x-2 text-lg"
          style={{ width: ratingToPercent() + '%' }}
        >
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div className="star-ratings-base space-x-2 text-lg">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
    );
  };

  

const Lecture = () => {

    const initialSectionStates = {
        section1: false,
        section2: false,
        // 추가 섹션이 있다면 여기에 추가
      };
    
      // 섹션 상태를 관리하는 state
      const [sectionStates, setSectionStates] = useState(initialSectionStates);
    
      // 각 섹션 클릭 시 상태를 토글
      const handleSectionClick = (section) => {
        setSectionStates((prevState) => ({
          ...prevState, // 이전 상태를 유지
          [section]: !prevState[section], // 클릭된 섹션만 열거나 닫기
        }));
      };

  const handleScrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
};

    return (
        <div className='lecture'>

            <div className='lecture-container'>
                <div className='lecture-imformation'>
                    <img  className='lecture-image' src="https://cdn.inflearn.com/public/courses/324951/course_cover/510c265a-6de2-456d-8e6a-351b9ce29608/nodeReactbasic.png" alt="lecture" />
                    <div className='lecture-imformation-details'>
                        <div className='lecture-category'>카테고리</div>
                        <div className='lecture-title'>따라하며 배우는 노드, 리액트 시리즈 - 기본 강의</div>
                        <div className='lecture-rating-details'>
                            <div className='lecture-rating'><StarRatings rating={4.6} /></div>
                            <div className='lecture-rating-count'>(4.6점)</div>
                        </div>
                        <div className='lecture-instructor'>John Ahn</div>
                        <div className='lecture-price'>₩10,000</div>
                        <div className='lecture-time'>강의 시간</div>
                        <div className='lecture-button'>
                            <button className='lecture-paid'>수강하기</button>
                            <button className='lecture-add-cart'>장바구니 담기</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='lecture-card'>
                <div className='lecture-card-button'>
                    <button onClick={() => handleScrollToSection('introduction')} className='lecture-card-introduction'>강의소개</button>
                    <button onClick={() => handleScrollToSection('instructor')} className='lecture-card-instructor'>강사소개</button>
                    <button onClick={() => handleScrollToSection('curriculum')} className='lecture-card-curriculum'>커리큘럼</button>
                    <button onClick={() => handleScrollToSection('comment')} className='lecture-card-comment'>수강평</button>
                </div>
            </div>
            <hr className='lecture-hr'/>

            <div className='lecture-details-container'>
                <div className='lecture-details-introcuction' id='introduction'>
                    <h3 className='lecture-details-title'>강의소개</h3>
                    <div className='lecture-details-introcuction-content'>
                        안녕하세요 ^ ^ <br />
                        이 강의에서는 리액트와 노드로 실질적인 어플리케이션을 만들기 위해 <br />
                        필요한 기본 개념들을 다루고 있습니다.
                    </div>
                </div>
                <hr className='lecture-hr'/>
                <div className='lecture-details-instructor' id='instructor'>
                    <h3 className='lecture-details-title'>강사소개</h3>
                    <div className='lecture-details-instructor-content'>
                        <div>John Ahn</div>
                        <div>john12@gmail.com</div>
                        <div>
                            안녕하세요. <br />
                            즐겁게 개발하고 있는 개발자입니다. <br />
                            앞으로 많은 도움을 드릴 수 있었으면 좋겠습니다.
                        </div>
                    </div>
                </div>
                <hr className='lecture-hr'/>
                

                <div className='lecture-details-curriculum' id='curriculum'>
                    <h3 className='lecture-details-title'>커리큘럼</h3>
                    <div className='lecture-details-curriculum-content'>
                    <div className='curriculum-item'>
                        <div
                        className='curriculum-title'
                        onClick={() => handleSectionClick('section1')}
                        style={{ cursor: 'pointer' }}
                        >
                        섹션 1: 리액트 소개
                        </div>
                        {sectionStates.section1 && (
                        <div className='sub-items'>
                            <a href='#subSection1-1'>subSection1-1</a>
                            <a href='#subSection1-2'>subSection1-2</a>
                            <a href='#subSection1-3'>subSection1-3</a>

                        </div>
                        )}
                    </div>
                    <div className='curriculum-item'>
                        <div
                        className='curriculum-title'
                        onClick={() => handleSectionClick('section2')}
                        style={{ cursor: 'pointer' }}
                        >
                        섹션 2: 리액트 기초
                        </div>
                        {sectionStates.section2 && (
                        <div className='sub-items'>
                            <a href='#subSection2-1'>subSection2-1</a>
                            <a href='#subSection2-2'>subSection2-2</a>
                            <a href='#subSection2-3'>subSection2-3</a>

                        </div>
                        )}
                    </div>
                    </div>
                </div>

                <hr className='lecture-hr'/>
                <div className='lecture-details-comment' id='comment'>
                    <h3 className='lecture-details-title'>수강평</h3>
                    <div className='lecture-details-comment-content'>
                        <div className='comment-userInfo'>
                            <img className='comment-userImage' src="https://cdn.inflearn.com/public/courses/325053/course_cover/b5fb69d7-2957-4023-82f1-76f3ff0b8860/nodeReactchatbot.png" alt="" />
                            <div className='comment-userInfo-content'>
                                <div className='comment-userNickname'>tar9et</div>
                                <div className='comment-createDate'>2024.01.01</div>
                            </div>
                        </div>
                        <div className='comment-content'>
                        초보자가 처음 듣기엔 어려울 것 같지만 챗봇을 만들어볼 수 있다는 점에서 매우 재밌어요! 그리고 영어로 설명해주시는데 어렵지 않게 설명해서 자막 켜지 않고도 이해할 수 있어서 좋아요. 영어공부 & 프로그래밍까지 1석2조
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lecture
