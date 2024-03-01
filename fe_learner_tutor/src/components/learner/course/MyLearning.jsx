import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import feedbackService from '../../../services/feedback';
import StarRating from './StarRating';
const MyLearning = () => {

    const learnerId = localStorage.getItem('learnerId');


    const [enrollmentList, setEnrollmentList] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State variable for modal visibility

    const contentRef = useRef(null);


    useEffect(() => {
        learnerService
            .getAllEnrollmentByLearnerId(learnerId)
            .then((res) => {
                setEnrollmentList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);

    //FEEBACK
    const [feedback, setFeedback] = useState({
        feedbackContent: "",
        learnerId: "",
        courseId: "",
        rating: ""
    });

    const handleContentChange = (value) => {
        setFeedback({ ...feedback, feedbackContent: value });
    };

    const handleRatingChange = (value) => {
        setFeedback({ ...feedback, rating: value }); // Update the rating state
    };
    const handleFeedbackClick = (courseId, learnerId) => {
        setShowFeedbackModal(true);
        feedback.courseId = courseId;
        feedback.learnerId = learnerId;
    };

    const submitFeedback = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(feedback))
        // If the note is not empty, proceed with the form submission
        feedbackService
            .saveFeedback(feedback)
            .then((res) => {
                window.alert("You feedback sent! Thank you");
                setShowFeedbackModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //FEEBACK

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>My learning</h2>
                    </div>
                </div>
                {/* End Breadcrumbs */}
                {/* ======= Courses Section ======= */}
                <section id="courses" className="courses" style={{ marginTop: '-30px' }}>
                    <div className="container" data-aos="fade-up">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="myLearningTabs">
                            <li className="nav-item">
                                <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                                    All courses
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                                    Certificates
                                </a>
                            </li>

                        </ul>
                        {/* Tab Content */}
                        <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-70px' }}>

                            <div className="tab-pane fade show active" id="tab-content-1">
                                <section id="courses" className="courses">
                                    <div className="container" data-aos="fade-up">
                                        <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                            {enrollmentList.map((enrollment, index) => (
                                                <div key={enrollment.courseId} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                                    <div className="course-item">
                                                        <img src={enrollment.course.imageUrl} className="img-fluid" alt="..." />
                                                        <div className="course-content">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h4>{enrollment.course.category?.name}</h4>
                                                                <p className="price">{`$${enrollment.course.stockPrice}`}</p>
                                                            </div>
                                                            {enrollment.course.isOnlineClass && (
                                                                <h3><Link to={`/study-class/${enrollment.courseId}`}>{enrollment.course.name}</Link></h3>

                                                            )}
                                                            {!enrollment.course.isOnlineClass && (
                                                                <h3><Link to={`/study-course/${enrollment.courseId}`}>{enrollment.course.name}</Link></h3>

                                                            )}
                                                            <p>{enrollment.course.description}</p>
                                                            <div className="trainer d-flex justify-content-between align-items-center">
                                                                <div className="trainer-profile d-flex align-items-center">
                                                                    <img src={enrollment.course.tutor.account.imageUrl} className="img-fluid" alt="" />
                                                                    <span>{enrollment.course.tutor.account.fullName}</span>
                                                                </div>

                                                                <div className="trainer-rank d-flex align-items-center">
                                                                    <i className="bx bx-user" />&nbsp;30
                                                                    &nbsp;&nbsp;
                                                                    <i class="far fa-grin-stars" onClick={() => handleFeedbackClick(enrollment.courseId, learnerId)}></i>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                    <i class="fas fa-flag" ></i>
                                                                </div>
                                                            </div>
                                                            {showFeedbackModal && (
                                                                <form id="demo-form" data-parsley-validate onSubmit={(e) => submitFeedback(e)}>
                                                                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                        <div className="modal-dialog">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title">Feedback for course - <span style={{ color: '#f58d04' }}>{enrollment.course.name}</span> </h5>
                                                                                    <button type="button" className="close" onClick={() => setShowFeedbackModal(false)}>
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <StarRating onChange={handleRatingChange} />

                                                                                    <ReactQuill
                                                                                        value={feedback.feedbackContent}
                                                                                        onChange={handleContentChange}
                                                                                        modules={{
                                                                                            toolbar: [
                                                                                                [{ header: [1, 2, false] }],
                                                                                                [{ 'direction': 'rtl' }],
                                                                                                [{ 'align': [] }],
                                                                                                ['code-block'],
                                                                                                [{ 'color': [] }, { 'background': [] }],
                                                                                                ['clean']
                                                                                            ]
                                                                                        }}
                                                                                        theme="snow"
                                                                                    />
                                                                                </div>
                                                                                <div className="modal-footer">
                                                                                    <button type="button" className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>Close</button>
                                                                                    <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }} onClick={(e) => submitFeedback(e)}>Send</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>


                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>{/* End Courses Section */}
                            </div>


                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                {/* You can customize this content based on your needs */}
                            </div>

                        </div>
                    </div>
                </section>
                {/* End Courses Section */}
            </main>
            {/* End #main */}
            <Footer />
        </>
    );
};

export default MyLearning;
