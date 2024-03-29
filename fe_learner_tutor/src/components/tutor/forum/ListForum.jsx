import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom'
import tutorService from '../../../services/tutor.service';

const ListForum = () => {

    const { tutorId } = useParams();
    const [forumList, setForumList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [forumsPerPage] = useState(5);



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };



    useEffect(() => {
        tutorService
            .getAllForumsByTutor(tutorId)
            .then((res) => {
                console.log(res.data);
                setForumList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [tutorId]);

    const filteredForums = forumList
        .filter((forum) => {
            return (
                forum.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredForums.length / forumsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * forumsPerPage;
    const currentForums = filteredForums.slice(offset, offset + forumsPerPage);

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                {/* ============================================================== */}
                {/* Start Page Content here */}
                {/* ============================================================== */}
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">LIST OF FORUMS</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        {/* <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Image</th>
                                                        <th>Course</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentForums.length > 0 && currentForums.map((forum, index) => (
                                                            <tr key={forum.id}>
                                                                <td>{index + 1}</td>
                                                                <td><img src={forum.course.imageUrl} style={{ height: '50px', width: '70px' }} alt={forum.course.name} /></td>

                                                                <td>{forum.course.name}</td>
                                                                <td>
                                                                    <Link to={`/edit-forum/${forum.id}`} className='text-secondary'>
                                                                        <i class="fas fa-comment-dots"></i>
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box */}
                                    {
                                        currentForums.length === 0 && (
                                            <p>No forums found.</p>
                                        )
                                    }
                                </div> {/* end col */}
                            </div>
                            {/* end row */}



                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

                <Footer />
            </div>
        </>
    )
}

export default ListForum