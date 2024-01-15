import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="home">

            <div class="card-container">
                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202311/004546-476/react.png" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">The RED : 김민태의 React와 Redux로 구현하는 아키텍처와</h2>
                        <p class="card-description">프론트엔드 개발자는 언제든 리스크에 대응할 준비가 되어 있어야 합니다. 26년 실무 경험과...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202302/061341-973/%EC%B4%88%EA%B2%A9%EC%B0%A8---%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C.png" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">한 번에 끝내는 프론트엔드 개발 초격차 패키지 Online.</h2>
                        <p class="card-description">프론트엔드 공부, 뭐부터 시작해야 하지? 더 이상 고민하지 마세요! 프론트엔드 개발자가 꼭 다뤄야...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202303/045138-472/%E1%84%89%E1%85%B5%E1%84%80%E1%85%B3%E1%84%82%E1%85%B5%E1%84%8E%E1%85%A5---%E1%84%87%E1%85%A2%E1%86%A8%E1%84%8B%E1%85%A6%E1%86%AB%E1%84%83%E1%85%B3.png" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">김민태의 프론트엔드 아카데미 : 제 2강 만들어보며 이해하는 React &</h2>
                        <p class="card-description">우아한 형제들 기술이사 김민태의 아카데미 시리즈 2강!, React와 Redux를 직접 만들어보며 그 핵심...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202304/024456-472/brigethumb-digima--1---1---1---1---1-.png" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">올인원 패키지 : 만들면서 익히는 React의 모든 것 개발부터 배포까지</h2>
                        <p class="card-description">React 입문부터 실전까지! React로 개발-상태관리-스타일링-CI/CD까지 모두 한 강의에...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202310/080543-472/thumb.webp" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">7개 프로젝트로 완벽 대비하는 Next.js 실무 (ft. 성능 개선) 초격차</h2>
                        <p class="card-description">다양한 규모와 난이도의 7개 프로젝트를 통해 Next.js를 기초 개념부터 실전 활용까지 다룹니다...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

                <div class="card">
                    <img class="card-image" src="https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/2022-06-03T07:41:28Z/2022-06-03T07:41:28Z-472/%E1%84%8B%E1%85%A1%E1%84%8F%E1%85%A1%E1%84%83%E1%85%A6%E1%84%86%E1%85%B5-%E1%84%80%E1%85%B5%E1%86%B7%E1%84%86%E1%85%B5%E1%86%AB%E1%84%90%E1%85%A2.png" alt="Course Image" />
                    <div class="card-content">
                        <h2 class="card-title">김민태의 프론트엔드 아카데미 : 제 3강 시나리오로 배우는 프론트엔드</h2>
                        <p class="card-description">우아한형제들 기술이사 김민태가 직접 재구성한 프론트엔드 강의 시리즈! 제 3강에서는 실무에서...</p>
                        <button class="card-button">Learn More</button>
                    </div>
                </div>

            </div>




        </div>
    )
}

export default Home
