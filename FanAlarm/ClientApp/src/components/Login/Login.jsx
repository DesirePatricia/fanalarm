﻿import React, {useState} from "react";
import Landing  from "../Landing/Landing";
import "./Login.css";
import loginContainerImage from "../../images/LoginContainer.png";
import { Formik } from 'formik';
import { Button, Input, Form, notification, Modal } from 'antd';
import { putData} from '../../AwsFunctions';
import * as Yup from 'yup';


export default function Login() {
    const key = 'updatable';
    /*const CLIENT_ID = "2b13915048a841b4b878f0287977a897"
    const REDIRECT_URI = "https://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"*/

    const openNotification = (email) => {
        notification.open({
            key,
            message: 'Email added Successfully',
            description: 'Email: ' + email + ' was added.',
        });
    };

    const addDataToDynamoDB = async (email) => {
        const userData = {
            email: email
        }
        await putData('Emails', userData);
        openNotification(email);
        setIsModalOpen(false);
        
    }
    return (
        <>
        <Landing/>
        <div
            className="loginContainer"
            style={{ minHeight: "100vh" }}
        >
                <div className="loginContainerWrapper"><img className='loginContainerImg' src={loginContainerImage} alt="fanalarm sync with spotify" />
                    <div className="loginContainerText">
                        <div className="loginContainerTitle">Integrate with Spotify</div>
                        <div className="loginContainerSubtitle">Sync with Spotify so Fan Alarm can find
                        all the artists you’d love to see in concert</div>
                    </div>
                </div>
                <div className="loginButtonForm">
                    {/*<a className="loginButton btn btn-success btn-lg" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>
                        Sync with Spotify
                    </a>
                    */}
                        <Formik
                            initialValues={{
                                email: ''
                            }}
                            onSubmit={(values) => {
                                addDataToDynamoDB(values.email)
                            }}
                        >{({
                            values,
                            handleChange,
                            handleSubmit,
                            onFinishFailed
                        }) => (
                            <Form
                                className="login-form"
                                onSubmit={handleSubmit}
                                initialValues={values}
                                onFinish={handleSubmit}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    className='form-email'
                                    onChange={handleChange}
                                    value={values.email}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                        {
                                            message: 'Invalid email address',
                                            validator: (_, value) => {
                                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                                                    return Promise.reject('Invalid email address');
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    className='form-button'
                                    wrapperCol={{
                                        span: 8,
                                    }}
                                >
                                    <button className="waitlistButton btn btn-success btn-lg" type="primary" htmltype="submit">
                                        Join Waitlist
                                    </button>
                                </Form.Item>
                            </Form>)}
                        </Formik>
                </div>
        </div>
        </>
    )
}