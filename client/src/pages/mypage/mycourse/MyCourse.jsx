import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';

const MyCourse = ({ mycourses }) => {
  const calculateProgressBarStyle = (progress) => {
    return {
      width: `${progress}%`,
    };
  };

  return (
    <div className='my-course'>
      <h3 className='list-title'>수강중인 강의</h3>
      <div className='my-course-card'>
        <img className='my-course-image' src={mycourses.imageSrc} alt="" />
        <div className='my-course-title'>{mycourses.title}</div>
        <div className='progress-bar-container'>
          <div className='my-course-progress' style={calculateProgressBarStyle(mycourses.progress)}>
            {mycourses.progress}%
          </div>
        </div>
        <button className='btn btn-primary my-course-continue'>다시보기</button>
      </div>
    </div>
  );
}

export default MyCourse;
