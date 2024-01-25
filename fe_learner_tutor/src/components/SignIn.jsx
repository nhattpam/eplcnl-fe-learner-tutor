import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; import Header from './Header';
import Footer from './Footer';
import authenticationService from '../services/authentication.service';
import accountService from '../services/account.service';


const SignIn = ({ setIsLoggedIn }) => {

    //login and set jwt token
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setBearerToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authenticationService.loginUser(email, password);
            if (response.data.success) {
                const decodedToken = JSON.parse(atob(response.data.data.split('.')[1])); // Decoding the JWT token

                console.log('this is role: ' + decodedToken.role);
                if (decodedToken.role.toString() === "f3db0ef2-7f03-4728-a868-aacbe76891a8") {
                    console.log("learner")
                    // setIsLoggedIn(true);

                    // Store the JWT token in localStorage
                    localStorage.setItem('token', response.data.data);
                    // Pass the token to the module
                    console.log('this is token: ' + response.data.data);

                    // Navigate to the home page
                    navigate('/home');
                }  // Store other necessary information
                if (decodedToken.role === "1dc7ed61-a13d-4cfc-9e3e-2159f61bad3b") {
                    console.log("tutor")

                    console.log("This is accountId: " + decodedToken.Id.toString())

                    const accountResponse = await accountService.getAccountById(decodedToken.Id);
                    const accountData = accountResponse.data;

                    console.log(JSON.stringify(accountData))


                    navigate('/tutor/courses');

                    // setAccount(accountData);
                    // Access centerId from localStorage
                    // localStorage.setItem('centerId', accountData.center.id);
                    // const storedCenterId = localStorage.getItem('centerId');
                    // console.log("This is centerId from localStorage:", storedCenterId);
                }
            } else {
                // setIsLoggedIn(false);
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            console.log('Login failed:', error);
            // setIsLoggedIn(false);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <>
            <Header />
            <div className="container my-5">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4">
                                <h5 className="card-title mb-4 fw-bold fs-5">Log in to your MeowLish account</h5>
                                <form  onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email}
                                        onChange={handleEmailChange}/>
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password}
                                            onChange={handlePasswordChange}/>
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>

                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style={{ backgroundColor: '#f58d04', border: '5px solid #f58d04', borderRadius: '20px', }}>
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SignIn;
