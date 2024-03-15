import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import feedbackService from '../../../services/feedback.service';
import reportService from '../../../services/report.service';
import StarRating from './StarRating';
import Dropzone from "react-dropzone";
import courseService from '../../../services/course.service';
import enrollmentService from '../../../services/enrollment.service';
import refundRequestService from '../../../services/refund-request.service';
import moduleService from '../../../services/module.service';


const MyLearning = () => {

    const learnerId = localStorage.getItem('learnerId');


    const [enrollmentList, setEnrollmentList] = useState([]);
    const [profileCertificateList, setProfileCertificateList] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State variable for modal visibility
    const [showReportModal, setShowReportModal] = useState(false); // State variable for modal visibility
    const [learnersCount, setLearnersCount] = useState({});
    const [showRefundModal, setShowRefundModal] = useState(false); // State variable for modal visibility
    const [selectedCourseName, setSelectedCourseName] = useState(''); // State variable to store the name of the selected course
    const [courseScore, setCourseScore] = useState(0); // State variable to store the name of the selected course
    const [learningeScore, setLearningScore] = useState(0); // State variable to store the name of the selected course

    const contentRef = useRef(null);


    useEffect(() => {
        learnerService
            .getAllEnrollmentByLearnerId(learnerId)
            .then(async (res) => {
                setEnrollmentList(res.data);
                const learnersCounts = {}; // Object to store number of learners for each course
                for (const enrollment of res.data) {
                    try {
                        const learnersResponse = await courseService.getAllEnrollmentsByCourse(enrollment.transaction?.courseId);
                        const learnersOfCourse = learnersResponse.data;
                        learnersCounts[enrollment.transaction?.courseId] = learnersOfCourse.length; // Store learner count for the course

                        //CHECK PROGRESSING
                        if (!enrollment.transaction?.course?.isOnlineClass) {
                            const courseScoreResponse = await enrollmentService.getCourseScoreByEnrollmentId(enrollment.id);
                            console.log("course Score: " + courseScoreResponse.data)
                            setCourseScore(courseScoreResponse.data);

                            const learningScoreResponse = await enrollmentService.getLearningScoreByEnrollmentId(enrollment.id);
                            console.log("learning Score: " + learningScoreResponse.data)
                            setLearningScore(learningScoreResponse.data);
                        }

                    } catch (error) {
                        console.error(`Error fetching learners for course ${enrollment.course?.name}:`, error);
                    }
                }
                setLearnersCount(prevState => ({ ...prevState, ...learnersCounts })); // Update state with learners count
            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);

    useEffect(() => {
        learnerService
            .getAllProfileCertificateByLearnerId(learnerId)
            .then((res) => {
                setProfileCertificateList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);


    //FEEBACK
    const [feedback, setFeedback] = useState({
        feedbackContent: "",
        transaction: "",
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
        setShowReportModal(false);
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

    //REPORT
    const [report, setReport] = useState({
        reason: "",
        learnerId: "",
        courseId: "",
        imageUrl: ""
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const handleReportClick = (courseId, learnerId) => {
        setShowReportModal(true);
        setShowFeedbackModal(false);
        report.courseId = courseId;
        report.learnerId = learnerId;
    };

    const handleReasonChange = (value) => {
        setReport({ ...report, reason: value });
    };

    const submitReport = async (e) => {
        e.preventDefault();
        let imageUrl = report.imageUrl; // Keep the existing imageUrl if available

        if (file) {
            // Upload image and get the link
            const imageData = new FormData();
            imageData.append("file", file);
            const imageResponse = await courseService.uploadImage(imageData);

            // Update the imageUrl with the link obtained from the API
            imageUrl = imageResponse.data;

        }

        // Save course
        const reportData = { ...report, imageUrl }; // Create a new object with updated imageUrl

        // If the note is not empty, proceed with the form submission
        reportService
            .saveReport(reportData)
            .then((res) => {
                window.alert("You Report sent! Thank you");
                setShowReportModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //REPORT

    //REFUND
    const [refund, setRefund] = useState({
        reason: "",
        enrollmentId: "",
    });

    const [refundSurvey, setRefundSurvey] = useState({
        reason: "",
        refundRequestId: "",
    });

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    //class topics by classLessonId
    const [classTopicList, setClassTopicList] = useState([]);
    const [combinedList, setCombinedList] = useState([]);
    const [filteredCombinedList, setFilteredCombinedList] = useState([]);
    useEffect(() => {
        const fetchModules = async () => {
            try {
                // Create an array of promises for each module fetch operation
                const promises = enrollmentList.map(async (enrollment) => {
                    const res = await courseService.getAllModulesByCourse(enrollment.transaction?.courseId);
                    return res.data || []; // Ensure moduleList is initialized with an empty array if res.data is undefined
                });

                // Wait for all promises to resolve
                const moduleLists = await Promise.all(promises);

                // Combine all module lists into a single array
                const combinedModuleList = moduleLists.reduce((acc, modules) => acc.concat(modules), []);

                // Set the combined module list
                setModuleList(combinedModuleList);
            } catch (error) {
                console.log(error);
            }
        };

        // Call the fetchModules function
        fetchModules();
    }, [enrollmentList]); // Add enrollmentList to the dependency array

    useEffect(() => {
        // Fetch lessons, assignments, and quizzes for each module
        Promise.all(moduleList.map(module => {
            return Promise.all([
                moduleService.getAllLessonsByModule(module.id),
                moduleService.getAllAssignmentsByModule(module.id),
                moduleService.getAllQuizzesByModule(module.id)
            ]);
        })).then(responses => {
            const allLessons = responses.flatMap(response => response[0].data);
            const allAssignments = responses.flatMap(response => response[1].data);
            const allQuizzes = responses.flatMap(response => response[2].data);
            setLessonList(allLessons);
            setAssignmentList(allAssignments);
            setQuizList(allQuizzes);
        }).catch((error) => {
            console.log(error);
        });
    }, [moduleList]);

    // Function to handle tab switching
    const handleTabClick = (event, moduleId) => {
        // Prevent the default behavior of the link
        event.preventDefault();


        // Remove the "active" class from all tab links
        const filteredList = combinedList.filter(item => item.moduleId === moduleId);
        setFilteredCombinedList(filteredList);
    };




    useEffect(() => {
        // Combine lessons, assignments, and quizzes into a single array
        const combined = [
            ...lessonList.map(lesson => ({ ...lesson, type: 'lesson' })),
            ...assignmentList.map(assignment => ({ ...assignment, type: 'assignment' })),
            ...quizList.map(quiz => ({ ...quiz, type: 'quiz' }))
        ];
        // Sort the combined array based on your preferred logic

        setCombinedList(combined);

    }, [lessonList, assignmentList, quizList]);

    const handleReasonRefundChange = (value) => {
        setRefund({ ...refund, reason: value });
    };

    const handleRefundClick = (enrollmentId) => {
        setShowRefundModal(true);
        refund.enrollmentId = enrollmentId;
        enrollmentService.getEnrollmentById(enrollmentId)
            .then((res) => {
                setSelectedCourseName(res.data.transaction?.course?.name); // Update the selected course name

            })

    };


    const submitRefund = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(refund))
        // If the note is not empty, proceed with the form submission
        refundRequestService
            .saveRefundRequest(refund)
            .then((res) => {
                window.alert("You refund sent! Wait for us");
                setShowRefundModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Function to check if the transaction date exceeds 2 days
    const isTransactionDateValid = (transactionDate) => {
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - new Date(transactionDate);
        const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    };


    //CHECK PROGRESSING

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs" >
                    <div className="container" >
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
                                            {
                                                enrollmentList.length > 0 && enrollmentList.map((enrollment, index) => (
                                                    <div key={enrollment.transaction?.courseId} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                                        <div className="course-item " id='iitem'>
                                                            <img src={enrollment.transaction?.course?.imageUrl} className="img-fluid" alt="..." />
                                                            <div className="course-content">
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h4>{enrollment.transaction.course?.category?.name}</h4>
                                                                    <p className="price">{parseFloat(enrollment.transaction?.course?.rating).toFixed(0)} <i class="fas fa-star text-warning "></i></p>
                                                                    <p className="price">{`$${enrollment.transaction?.course?.stockPrice}`}</p>
                                                                </div>
                                                                {enrollment.transaction?.course?.isOnlineClass && (
                                                                    <h3><Link to={`/study-class/${enrollment.transaction?.courseId}`}>{enrollment.transaction?.course?.name}</Link></h3>

                                                                )}
                                                                {!enrollment.transaction.course.isOnlineClass && (
                                                                    <h3><Link to={`/study-course/${enrollment.transaction?.courseId}`}>{enrollment.transaction?.course?.name}</Link></h3>

                                                                )}
                                                                <p>{enrollment.transaction?.course?.description}</p>
                                                                <div className="trainer d-flex justify-content-between align-items-center">
                                                                    <div className="trainer-profile d-flex align-items-center">
                                                                        <img src={enrollment.transaction?.course?.tutor?.account?.imageUrl} className="img-fluid" alt="" />
                                                                        <span>{enrollment.transaction?.course?.tutor?.account?.fullName}</span>
                                                                    </div>

                                                                    <div className="trainer-rank d-flex align-items-center">
                                                                        <i className="bx bx-user" />&nbsp;{learnersCount[enrollment.transaction?.course?.id]}
                                                                        &nbsp;&nbsp;
                                                                        <i class="far fa-grin-stars" onClick={() => handleFeedbackClick(enrollment.transaction?.courseId, learnerId)}></i>
                                                                        &nbsp;&nbsp;&nbsp;
                                                                        <i class="fas fa-flag" onClick={() => handleReportClick(enrollment.transaction?.courseId, learnerId)}></i>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    !enrollment.transaction?.course?.isOnlineClass && (
                                                                        <div className="progress-container mt-3">
                                                                            <div className="left-title" style={{ fontWeight: 'bold' }}>{learningeScore}</div>
                                                                            <div className="progress-wrapper">
                                                                                <progress className="orange-progress-bar" value={learningeScore} max={courseScore}></progress>
                                                                            </div>
                                                                            <div className="right-title" style={{ fontWeight: 'bold' }}> {courseScore}</div>
                                                                        </div>
                                                                    )
                                                                }

                                                                {isTransactionDateValid(enrollment.enrolledDate) && (
                                                                    <a className='btn btn-primary' style={{ backgroundColor: '#f58d04' }} onClick={() => handleRefundClick(enrollment.id)}>
                                                                        I want return
                                                                    </a>
                                                                )}

                                                                {showFeedbackModal && (
                                                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitFeedback(e)}>
                                                                        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                            <div className="modal-dialog  modal-dialog-scrollable">
                                                                                <div className="modal-content">
                                                                                    <div className="modal-header">
                                                                                        <h5 className="modal-title">Feedback for course - <span style={{ color: '#f58d04' }}>{enrollment.transaction?.course?.name}</span> </h5>
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
                                                                                            preserveWhitespace={true} // Add this line to preserve whitespace

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
                                                                {showReportModal && (
                                                                    <form method="post"
                                                                        className="dropzone"
                                                                        id="myAwesomeDropzone"
                                                                        data-plugin="dropzone"
                                                                        data-previews-container="#file-previews"
                                                                        data-upload-preview-template="#uploadPreviewTemplate"
                                                                        data-parsley-validate onSubmit={(e) => submitReport(e)}>
                                                                        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                            <div className="modal-dialog modal-dialog-scrollable"> {/* Add 'modal-dialog-scrollable' class */}
                                                                                <div className="modal-content">
                                                                                    <div className="modal-header">
                                                                                        <h5 className="modal-title">Report course - <span style={{ color: '#f58d04' }}>{enrollment.transaction?.course?.name}</span> </h5>
                                                                                        <button type="button" className="close" onClick={() => setShowReportModal(false)}>
                                                                                            <span aria-hidden="true">&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Set maxHeight and overflowY */}
                                                                                        <ReactQuill
                                                                                            value={report.reason}
                                                                                            onChange={handleReasonChange}
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
                                                                                            preserveWhitespace={true}
                                                                                        />
                                                                                        <Dropzone
                                                                                            onDrop={handleFileDrop}
                                                                                            accept="image/*"
                                                                                            multiple={false}
                                                                                            maxSize={5000000}
                                                                                        >
                                                                                            {({ getRootProps, getInputProps }) => (
                                                                                                <div {...getRootProps()} className="fallback">
                                                                                                    <input {...getInputProps()} />
                                                                                                    <div className="dz-message needsclick">
                                                                                                        <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                                        <h3>Drop files here or click to upload.</h3>
                                                                                                    </div>
                                                                                                    {imagePreview && (
                                                                                                        <img
                                                                                                            src={imagePreview}
                                                                                                            alt="Preview"
                                                                                                            style={{
                                                                                                                maxWidth: "100%",
                                                                                                                maxHeight: "200px",
                                                                                                                marginTop: "10px",
                                                                                                            }}
                                                                                                        />
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </Dropzone>

                                                                                        <div
                                                                                            className="dropzone-previews mt-3"
                                                                                            id="file-previews"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="modal-footer">
                                                                                        <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
                                                                                        <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }} onClick={(e) => submitReport(e)}>Send</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                )}
                                                                {showRefundModal && (
    <form
        method="post"
        className="dropzone"
        id="myAwesomeDropzone"
        data-plugin="dropzone"
        data-previews-container="#file-previews"
        data-upload-preview-template="#uploadPreviewTemplate"
        data-parsley-validate
        onSubmit={(e) => submitRefund(e)}
    >
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Refund course - <span style={{ color: '#f58d04' }}>{selectedCourseName}</span>
                        </h5>
                        <button type="button" className="close" onClick={() => setShowRefundModal(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        {!enrollment.transaction?.course?.isOnlineClass && (
                            <div className="container" data-aos="fade-up">
                                {moduleList.length > 0 &&
                                    moduleList.map((module, index) => (
                                        <div className="row" key={module.id}>
                                            <div className="col-lg-3">
                                                <ul className="nav nav-tabs flex-column">
                                                    <li className="nav-item get-button">
                                                        <a onClick={(event) => handleTabClick(event, module.id)}>{module.name}</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-lg-9 mt-4 mt-lg-0">
                                                {filteredCombinedList.length > 0 &&
                                                    filteredCombinedList.map((item, combinedIndex) => {
                                                        // Check if the item belongs to the clicked module
                                                        if (item.moduleId === module.id) {
                                                            return (
                                                                <div className="combined-item" key={combinedIndex}>
                                                                    {item.type === 'lesson' && (
                                                                        <div className="lesson">
                                                                            <p style={{ textAlign: 'justify' }}>
                                                                                <span style={{ color: '#f58d04', fontWeight: 'bold' }}>
                                                                                    {combinedIndex + 1}.
                                                                                </span>{' '}
                                                                                Lesson: {item.name}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.type === 'assignment' && (
                                                                        <div className="assignment">
                                                                            <p style={{ textAlign: 'justify' }}>
                                                                                <span style={{ color: '#f58d04', fontWeight: 'bold' }}>
                                                                                    {combinedIndex + 1}.
                                                                                </span>{' '}
                                                                                Assignment - Deadline: {item.deadline} minutes
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.type === 'quiz' && (
                                                                        <div className="quiz">
                                                                            <p style={{ textAlign: 'justify' }}>
                                                                                <span style={{ color: '#f58d04', fontWeight: 'bold' }}>
                                                                                    {combinedIndex + 1}.
                                                                                </span>{' '}
                                                                                Quiz - {item.name}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                        return null; // Don't render if it doesn't belong to the clicked module
                                                    })}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowRefundModal(false)}>
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ backgroundColor: '#f58d04' }}
                            onClick={(e) => submitRefund(e)}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
)}


                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                enrollmentList.length === 0 && (
                                                    <p>You haven't joined any course yet.</p>
                                                )
                                            }

                                        </div>
                                    </div>
                                </section>{/* End Courses Section */}
                            </div>


                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                <div className="tab-pane fade show active" id="tab-content-1">
                                    <section id="courses" className="courses">
                                        <div className="container" data-aos="fade-up">
                                            <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                                <div>
                                                    {profileCertificateList.length > 0 && profileCertificateList.map((proCertificate, index) => (
                                                        <>
                                                            <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
                                                                <div className="course-item iitem">
                                                                    <img src={proCertificate.certificate?.course?.imageUrl} className="img-fluid" alt="..." />
                                                                    <div className="course-content">
                                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                                            <h4>DONE</h4>
                                                                        </div>
                                                                        <h3><a href="course-details.html">{proCertificate.certificate?.name}</a></h3>
                                                                        <p>{proCertificate.certificate?.description}</p>

                                                                    </div>
                                                                </div>
                                                                {/* End Course Item*/}
                                                            </div>

                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* End Courses Section */}
            </main>
            {/* End #main */}
            <Footer />
            <style>
                {`
                    /* Add this CSS to ensure scrolling within modal body */
                    /* Add this CSS to ensure scrolling within modal body */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust the value (200px) as needed to accommodate the modal header and footer */
  overflow-y: auto; /* Enable vertical scrolling when content exceeds max height */
}

/* Add this CSS to create a sticky footer */
.modal-footer {
  position: sticky;
  bottom: 0;
  background-color: #fff; /* Optional: Set background color for footer */
  padding: 15px; /* Optional: Add padding to footer */
}

                    
                    /* Add this CSS to set a high z-index for modals */
                    .modal {
                      z-index: 9999; /* Set a high z-index value */
                    }
                    
                    #iitemiitem {
                        transition: transform 0.3s ease;
                    }
                    
                    #iitem:hover {
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    
                    .progress-container {
                        display: flex;
                        align-items: center;
                    }
                    
                    .left-title {
                        flex: 1;
                        text-align: right; /* Align text to the right */
                        padding-right: 10px; /* Add some space between the title and the progress bar */
                    }
                    
                    .progress-wrapper {
                        flex: 5; /* Adjust the width of the progress bar */
                    }
                    
                    .right-title {
                        flex: 1;
                        text-align: left; /* Align text to the left */
                        padding-left: 10px; /* Add some space between the progress bar and the title */
                    }
                    
                    .orange-progress-bar {
                        appearance: none;
                        width: 100%;
                        height: 10px;
                    }
                    
                    .orange-progress-bar::-webkit-progress-bar {
                        background-color: #f2f2f2; /* Background color of the progress bar */
                    }
                    
                    .orange-progress-bar::-webkit-progress-value {
                        background-color: orange; /* Color of the progress bar */
                    }
                    
                    
                `}
            </style>
        </>
    );
};

export default MyLearning;
