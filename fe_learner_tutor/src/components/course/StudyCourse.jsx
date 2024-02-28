import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import moduleService from '../../services/module.service'; // Import module service

const StudyCourse = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState({
        name: "",
        modules: []
    });

    const [moduleList, setModuleList] = useState([]);

    useEffect(() => {
        if (courseId) {
            courseService
                .getCourseById(courseId)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllModulesByCourse(courseId)
            .then((res) => {
                console.log(res.data);
                setModuleList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleContent, setModuleContent] = useState({
        lessons: [],
        assignments: [],
        quizzes: []
    });

    // State to track expanded/collapsed state of modules
    const [expandedModules, setExpandedModules] = useState([]);

    // Function to toggle expansion state of a module
    const toggleModuleExpansion = (moduleId) => {
        if (expandedModules.includes(moduleId)) {
            setExpandedModules(expandedModules.filter(id => id !== moduleId));
        } else {
            setExpandedModules([...expandedModules, moduleId]);
        }
    };

    useEffect(() => {
        if (selectedModule) {
            // Fetch lessons, assignments, and quizzes based on the selected module
            moduleService.getAllLessonsByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, lessons: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });

            moduleService.getAllAssignmentsByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, assignments: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });

            moduleService.getAllQuizzesByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, quizzes: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedModule]);

    // Function to handle click on a module card to toggle expansion
    const handleModuleCardClick = (moduleId) => {
        toggleModuleExpansion(moduleId);
        setSelectedModule(moduleList.find(module => module.id === moduleId));
    };

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                <div className="breadcrumbs">
                    <div style={{ float: 'left' }} className='ml-4'>
                        <h4 style={{ color: '#fff' }}>{course.name}</h4>
                    </div>
                </div>
                <section id="courses" className="courses" style={{ marginTop: '-60px' }}>
                    <div className='row'>
                        <div className="col-md-8">
                            {/* Course Content */}
                        </div>

                        <div className="col-md-4" style={{ textAlign: 'left' }}> {/* Adjusted width for sidebar */}
                            {/* Right Sidebar Content Here */}
                            <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', textAlign: 'left' }}>
                                {/* Add your sidebar content here */}
                                <h4 style={{ fontWeight: 'bold' }}>Course content</h4>
                                {moduleList && moduleList.length > 0 && moduleList.map((module, index) => (
                                    <div key={module.id} className="card-container" style={{ marginBottom: '5px' }}>
                                        <div
                                            className={`card module-title ${expandedModules.includes(module.id) ? 'expanded' : ''}`}
                                            onClick={() => handleModuleCardClick(module.id)} style={{ marginBottom: '5px' }}
                                        >
                                            <div className="card-body" style={{ padding: '10px' }}>
                                                <h4 className="card-title" >Section {index + 1}: {module.name}</h4>
                                                <span>{expandedModules.includes(module.id) ? '-' : '+'}</span>
                                            </div>
                                        </div>
                                        {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                                            <div className="card-content">
                                                {/* Combine all items into a single array */}
                                                {moduleContent.lessons.map((lesson, index) => (
                                                    <div key={`lesson_${index}`} className="card" style={{ marginBottom: '5px' }}>
                                                        <div className="card-body">{index + 1}. {lesson.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fas fa-file-video"></i>
                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.assignments.map((assignment, index) => (
                                                    <div key={`assignment_${index}`} className="card" style={{ marginBottom: '5px' }}>
                                                        <div className="card-body">{moduleContent.lessons.length + index + 1}. {assignment.questionText}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fab fa-wpforms"></i> {assignment.deadline} mins
                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.quizzes.map((quiz, index) => (
                                                    <div key={`quiz_${index}`} className="card" style={{ marginBottom: '5px' }}>
                                                        <div className="card-body">{moduleContent.lessons.length + moduleContent.assignments.length + index + 1}. {quiz.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="far fa-question-circle"></i> {quiz.deadline} mins
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}


                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
            <style>
                {`
                .module-title:hover {
                    background-color: #333;
                    color: #fff;
                    cursor: pointer;
                }
                
                .module-list li:hover {
                    background-color: #f0f0f0;
                    cursor: pointer;
                }
                
                .card.module-title {
    background-color: #FFF0D6; /* Darker background color */
    color: #000; /* White text color */
    transition: background-color 0.3s ease; /* Smooth transition effect */
}

.card.module-title:hover {
    background-color: #E7E3DC; /* Darker background color on hover */
    color: #fff
}

            `}
            </style>
        </>
    )
}

export default StudyCourse;
