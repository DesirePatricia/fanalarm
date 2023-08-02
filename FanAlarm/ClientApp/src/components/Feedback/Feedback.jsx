import React, { useState } from "react";
import "./Feedback.css";
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, notification, Modal } from 'antd';
import { putData } from '../../AwsFunctions';
import * as Yup from 'yup';
import TextArea from "antd/es/input/TextArea";


export default function Feedback() {
    const key = 'updatable';
    const navigate = useNavigate();

    const openNotification = () => {
        notification.open({
            key,
            message: 'Feedback added Successfully',
            description: 'Thanks so much for your help!',
        });
    };

    const addDataToDynamoDB = async (feedback) => {
        const userData = {
            Feedback: feedback
        }
        await putData('Feedback', userData);
        openNotification();
        navigate('/login', { replace: true });
    }
    return (
        <>
            <div
                className="feedbackContainer"
                style={{ minHeight: "100vh" }}
            >
                <div className="feedbackContainerWrapper">
                    <h2 className="feedbackTitle">FEEDBACK</h2>
                    <h1 className="feedbackSubTitle">FANALARM IS A ONE WOMAN SHOW ANY FEEDBACK WOULD BE
                        GREATLY APPRECIATED ALSO UPDATES ARE SLOW BECAUSE I CAN’T
                        FOCUS ON THIS FULL TIME SO PLEASE BE PATIENT AND THANK YOU
                        SO MUCH FOR ANY SUPPORT GIVEN :)</h1>
                    <Formik
                        initialValues={{
                            feedback: ''
                        }}
                        onSubmit={(values) => {
                            addDataToDynamoDB(values.feedback)
                        }}
                    >{({
                        values,
                        handleChange,
                        handleSubmit,
                        onFinishFailed
                    }) => (
                        <Form
                            className="feedback-form"
                            onSubmit={handleSubmit}
                            initialValues={values}
                            onFinish={handleSubmit}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="feedback"
                                className='formFeedback'
                                onChange={handleChange}
                                value={values.feedback}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input some text!',
                                    },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>
                            <Form.Item
                                className='formFeedbackButton'
                                wrapperCol={{
                                    span: 8,
                                }}
                            >
                                <button className="sendButton btn btn-success btn-lg" type="primary" htmltype="submit">
                                    SEND
                                </button>
                            </Form.Item>
                        </Form>)}
                    </Formik>
                </div>
            </div>
        </>
    )
}