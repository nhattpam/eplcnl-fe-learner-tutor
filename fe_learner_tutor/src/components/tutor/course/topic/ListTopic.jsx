import React from 'react'
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'

const ListTopic = () => {
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
                    <h4 className="page-title">List Topic Of Lesson ABC</h4>
                  </div>
                </div>
              </div>
              {/* end page title */}
              <div className="row">
                <div className="col-12">
                  <div className="card-box">
                    <div className="mb-2">
                      <div className="row">
                        <div className="col-12 text-sm-center form-inline">
                          <div className="form-group mr-2">
                            <select id="demo-foo-filter-status" className="custom-select custom-select-sm">
                              <option value>Show all</option>
                              <option value="active">Active</option>
                              <option value="disabled">Disabled</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                        <thead>
                          <tr>
                            <th data-toggle="true">Topic Name</th>
                            <th>Description</th>
                            <th data-hide="phone">Created Date</th>
                            <th data-hide="phone, tablet">Updated Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Pronunciation basic for new learner</td>
                            <td>Grammar, Vocabulary</td>
                            <td>22 Jun 1972</td>
                            <td>22 Jun 1972</td>
                            <td>
                              <Link to={"/tutor/courses/create/create-class-course/edit-topic"}>
                                <i class="fa-regular fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>Pronunciation basic for new learner</td>
                            <td>Grammar, Vocabulary</td>
                            <td>22 Jun 1972</td>
                            <td>22 Jun 1972</td>
                            <td>
                              <Link to={"/tutor/courses/create/create-class-course/edit-topic"}>
                                <i class="fa-regular fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="active">
                            <td colSpan={5}>
                              <div className="text-right">
                                <ul className="pagination pagination-rounded justify-content-end footable-pagination m-t-10 mb-0" />
                              </div>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div> {/* end .table-responsive*/}
                  </div> {/* end card-box */}
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

export default ListTopic