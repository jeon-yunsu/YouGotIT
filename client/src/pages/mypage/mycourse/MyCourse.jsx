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
      <div className='list-title'>수강중인 강의</div>
      {mycourses.map((course, index) => (
        <div key={index} className='my-course-card'>
          <img className='my-course-image' src={course.imageSrc} alt="" />
          <div className='my-course-title'>{course.title}</div>
          <div className='progress-bar-container'>
            <div className='my-course-progress' style={calculateProgressBarStyle(course.progress)}>
              {course.progress}%
            </div>
          </div>
          <button className='btn btn-primary my-course-continue'>다시보기</button>
        </div>
      ))}
    </div>
  );
}

export default MyCourse;
