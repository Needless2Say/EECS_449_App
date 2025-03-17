"use client";

import React, { useContext, useState, FormEvent } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";


// login component
const Login: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // check if user is logged in on or
    if (!auth) {
        // since user's authentication status is not valid, return error
        throw new Error("AuthContext is not available! Did you forget to wrap <AuthProvider>?");
    }

    // grab login function from auth object
    const { login } = auth;

    // initialize username and password variable for existing user credentials
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // initialize username and password variable for new user credentials
    const [registerUsername, setRegisterUsername] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");

    // handle submit function for submitting form to backend API
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // call login function from authentication context with existing user credentials
        login(username, password);
    };

    // async handle register user function that registers new user
    // e is a typed form event from HTML form and returns a promise that resolves to void
    const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // try following lines of code
        try {
            // send POST request to route with new user's username and password in request payload
            const response = await axios.post("http://localhost:8000/auth", {
                username: registerUsername,
                password: registerPassword,
            });

            // call login function to login user after new user's credentials have been saved in the database
            login(registerUsername, registerPassword);

        } catch (error) { // catch any errors
            // return error message
            console.error("Failed to register user:", error);
        }
    };

  // return (
  //   <div>
  //     <h2>Login</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div className="mb-3">
  //         <label htmlFor="username" className="form-label">
  //           Username
  //         </label>
  //         <input
  //           type="text"
  //           className="form-control"
  //           id="username"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />
  //       </div>
  //       <div className="mb-3">
  //         <label htmlFor="password" className="form-label">
  //           Password
  //         </label>
  //         <input
  //           type="password"
  //           className="form-control"
  //           id="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>
  //       <button type="submit">Login</button>
  //     </form>
  //   </div>
  // );

  return (
    <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <h2 className='mt-5'>Register</h2>
        <form onSubmit={handleRegister}>
            <div className="mb-3">
                <label htmlFor="registerUsername" className="form-label">Username</label>
                <input
                    type="text"
                    className="form-control"
                    id="registerUsername"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
        </form>
    </div>
  );

};

// export login component as default export for use in application
export default Login;
