import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../../services/account.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');


    const navigate = useNavigate();

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: ""
      });

      useEffect(() => {
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [accountId]);


    const handleLogout = () => {
        // Clear user session or perform any necessary logout actions
        // For example, you can use localStorage or sessionStorage to store authentication status
        localStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage

        // Redirect to the login page or any other page after logout
        navigate('/login');
    };

    useEffect(() => {
        const handleBackwardNavigation = () => {
            // Redirect users to a specific page when they try to go back
            navigate('/prevent-back');
        };

        window.addEventListener('popstate', handleBackwardNavigation);

        return () => {
            window.removeEventListener('popstate', handleBackwardNavigation);
        };
    }, [navigate]);

    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom" style={{ backgroundColor: '#242732' }}>
                <div className="container-fluid">
                    <ul className="list-unstyled topnav-menu float-right mb-0">
                        <li className="d-none d-lg-block">
                            <form className="app-search">
                                <div className="app-search-box dropdown">
                                    <div className="input-group">
                                        <input type="search" className="form-control" placeholder="Search..." id="top-search" />
                                        <div className="input-group-append">
                                            <button className="btn" type="submit">
                                                <i className="fe-search" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </li>
                        <li className="dropdown d-inline-block d-lg-none">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <i className="fe-search noti-icon" />
                            </a>
                            <div className="dropdown-menu dropdown-lg dropdown-menu-right p-0">
                                <form className="p-3">
                                    <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                </form>
                            </div>
                        </li>



                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src={account.imageUrl} alt="user-image" className="rounded-circle" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                {/* item*/}
                                <div className="dropdown-header noti-title">
                                    <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                </div>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-user" />
                                    <span>My Account</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-settings" />
                                    <span>Settings</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-lock" />
                                    <span>Lock Screen</span>
                                </a>
                                <div className="dropdown-divider" />
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={handleLogout}>
                                    <i className="fe-log-out" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </li>
                        <li className="dropdown notification-list">
                            <a href="javascript:void(0);" className="nav-link right-bar-toggle waves-effect waves-light">
                                <i className="fe-settings noti-icon" />
                            </a>
                        </li>
                    </ul>
                    {/* LOGO */}
                    <div className="logo-box">
                        <Link to={"/tutor-dashboard"} className="logo logo-light text-center">
                            <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                MEOWLISH
                            </span>
                        </Link>
                    </div>

                   
                    <div className="clearfix" />
                </div>
            </div>
            {/* end Topbar */}

        </>
    )
}

export default Header