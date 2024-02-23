import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../../../services/module.service';

const EditModule = () => {
    const [module, setModule] = useState({
        name: "",
        assignments: [],
        lessons: [],
        quizzes: []
    });

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { moduleId } = useParams();
    //get number of lessons, assignments, quizzes
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);


    useEffect(() => {
        if (moduleId) {
            moduleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllLessonsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setLessonList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllAssignmentsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setAssignmentList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllQuizzesByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setQuizList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/edit-module/${moduleId}`);
    };

   

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span> | MODULE INFORMATION</h4>


                                    <div className="mb-3">
                                        <h5>Module Name:</h5>
                                        <p>{module.name}</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <div className="card custom-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Assignments ({assignmentList.length || 0})</h5>
                                                    <p className="card-text">
                                                        <Link to={`/tutor/courses/list-assignment/${module.id}`} className='btn btn-success btn-sm'>View All</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="card custom-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Lessons ({lessonList.length || 0})</h5>
                                                    <p className="card-text">
                                                        <Link to={`/tutor/courses/list-lesson/${module.id}`} className='btn btn-success btn-sm'>View All</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="card custom-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Quizzes ({quizList.length || 0})</h5>
                                                    <p className="card-text">
                                                        <Link to={`/tutor/courses/list-quiz/${module.id}`} className='btn btn-success btn-sm'>View All</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> {/* end card-box*/}
                                <Link
                                    type="button"
                                    className="btn btn-black mr-2"
                                    to={`/tutor/courses/edit-course/${module.courseId}`}
                                >
                                    <i class="fas fa-long-arrow-alt-left"></i> Back to Course Infomation
                                </Link>
                            </div> {/* end col*/}

                        </div>
                        {/* end row*/}
                    </div> {/* container */}
                </div>
            </div>
            <style>
                {`
                    body, #wrapper {
                        height: 100%;
                        margin: 0;
                    }

                    #wrapper {
                        display: flex;
                        flex-direction: column;
                    }

                    .content-page {
                        flex: 1;
                        width: 85%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    );
}

export default EditModule;
