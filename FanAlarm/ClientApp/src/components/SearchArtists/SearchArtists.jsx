import "./SearchArtists.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import search from '../../images/search.png';
import plane from '../../images/Paperplane.svg';
import { Formik } from 'formik';
import { Input, Form, notification } from 'antd';
import Grid from '@mui/material/Grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';

export default function SearchArtists() {
    const key = 'updatable';
    const baseURL = window.location.origin + "/api/search/";
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState([]);
    const [artistsAll, setArtistsAll] = useState([]);
    const [message, setMessage] = React.useState(1);
    const [latitude, setLatitude] = React.useState(0);
    const [longitude, setLongitude] = React.useState(0);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const getArtistData = async (artist) => {
        try {
            const encodedArtist = baseURL + encodeURIComponent(artist);
            const response = await axios.get(encodedArtist, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const items = response.data;
            let counter = 1;
            const updatedArtists = items.map(name => {
                let totalAllArtists = counter ++;
                let id = "search" + totalAllArtists
                return { name, id, totalAllArtists };
            });
            setArtists(updatedArtists);
            setArtistsAll(updatedArtists);
        } catch (error) {
            console.log(error);
        }
    };
    const addDataToSQL = async (values) => {
        let userData = { email: values.email, number: values.number, artistData: [], latitude: latitude.toString(), longitude: longitude.toString() }
        if (message == 2) {
            userData.email = '';
        }
        else {
            userData.number = '';
        }
        artistsAll?.map(({ name, id, totalAllArtists }) => {
            if (checkedState[totalAllArtists - 1]) {
                userData.artistData.push({ name })
            }
        });

        try {
            console.log("User Data:" + JSON.stringify(userData));
            const userResult = await postUserData(userData);
            if (userResult) {
                openNotification();
                navigate('/feedback', { replace: true });
            }
            else {
                openErrorNotification();
            }
        } catch (error) {
            console.log(error);
        }

    }
    const openNotification = () => {
        notification.open({
            key,
            message: 'User added Successfully',
            description: 'Artists were saved successfully',
        });
    };

    const openErrorNotification = () => {
        notification.open({
            key,
            message: 'User not added Successfully',
            description: 'Artists were not saved successfully',
        });
    };
    const postUserData = async (userData) => {
        try {
            const response = await axios.post("/api/postusers", userData);
            console.log("response data: " + response.data);
            return response.data; // If your response is JSON data, you can return response.data directly
        } catch (error) {
            // Handle error here
            console.error("Error while calling API:", error);
            throw error;
        }
    };

    const handleCheckedChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);

    };
    const success = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

    }
    const error = (error) => {
        console.log("Unable to retrieve your location" + error);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation not supported");
    }
    useEffect(() => {
    }, [artists]);
    useEffect(() => {
    }, [loading]);
    useEffect(() =>{
        setCheckedState(new Array(artists.length).fill(true));
    }, [artists])
    return (
        <>
        <div className="searchArtists-wrapper">
            <div className='searchArtists-header'>
                <div className='searchArtists-header-title'>Fan Alarm</div>
            </div>
            <h1 className="searchArtists-title">FIND ARTISTS</h1>
            <div className="searchArtists-search-message-wrapper">
                <div className="searchArtists-search-container">
                    <Formik
                        initialValues={{
                            artist: '',
                        }} 
                        onSubmit={(values) => {
                            setSearchPerformed(true);
                            getArtistData(values.artist);
                        }}
                    >{({
                        values,
                        handleChange,
                        handleSubmit,
                        onFinishFailed
                    }) => (
                        <Form
                            onSubmit={handleSubmit}
                            initialValues={values}
                            onFinish={handleSubmit}
                            onFinishFailed={onFinishFailed}
                            className="searchArtists-form"
                        >
                                <Form.Item
                                    name="artist"
                                    onChange={handleChange}
                                    className="searchArtists-form-search"
                                    value={values.artist}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input something into the search!',
                                        },
                                        {
                                            message: 'Invalid input in search',
                                            validator: (_, value) => {
                                                if (!/^[A-Z0-9._%+-\s]*$/i.test(value)) {
                                                    return Promise.reject('Invalid input in search');
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        },
                                    ]}
                                >
                                        <Input className="searchArtists-message searchArtists-message-search" type="text" />
                                </Form.Item>
                            

                            <Form.Item
                                className="searchArtists-form-button"
                                wrapperCol={{
                                    span: 8,
                                }}
                            >
                                <button className="searchArtists-button" type="primary" htmltype="submit">
                                    <img className="searchArtists-searchImg" src={search} alt="Search" />
                                </button>
                            </Form.Item>
                        </Form>)}
                    </Formik>
                </div>
            </div>
            {searchPerformed && (
                <>
                <ul className="searchArtists-lists">
                { artists?.map(({ name, id, totalAllArtists }) => {
                        return (
                            <li className="searchArtists-artist" key={id}>
                                <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                                    <Grid item xs={2} xsoffset={0} sm={2} md={2} mdoffset={0}>
                                        <div className="searchArtists-artist-num">{totalAllArtists}</div>
                                    </Grid>
                                    <Grid item xs={6} xsoffset={0} sm={6} md={6} mdoffset={0}>
                                        <div className="searchArtists-artist-name">{name}</div>
                                    </Grid>
                                    <Grid item xs={2} xsoffset={0} sm={2} md={2} mdoffset="auto">
                                        <input className="searchArtists-checkbox" type="checkbox" name="myCheckbox" onChange={() => handleCheckedChange(totalAllArtists)} defaultChecked={true} />
                                    </Grid>
                                    <Grid item xs={2} xsoffset={0} md={1} mdoffset="auto">
                                        <Link to={`/Artist/${name}`} target="_blank" param={name}>
                                            <MoreHorizIcon className="searchArtists-artist-more" />
                                        </Link>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                })}
                </ul>
                    <div className="searchArtists-message-wrapper">
                        <div className="searchArtists-message-radio-wrapper">
                            <label className="searchArtists-radio-label">
                                <span className="searchArtists-radio-text">Email</span>
                                <input className="searchArtists-radio" defaultChecked={true}
                                    onClick={() => setMessage(1)} type="radio" value="email" name="message" />
                            </label>
                            <label className="searchArtists-radio-label">
                                <span className="searchArtists-radio-text">Text</span>
                                <input className="searchArtists-radio"
                                    onClick={() => setMessage(2)} type="radio" value="text" name="message" />
                            </label>
                        </div>
                        <div className="searchArtists-message-container">
                            <Formik
                                initialValues={{
                                    email: '',
                                    number: ''
                                }}
                                onSubmit={(values) => {
                                    addDataToSQL(values)
                                }}
                            >{({
                                values,
                                handleChange,
                                handleSubmit,
                                onFinishFailed
                            }) => (
                                <Form
                                    onSubmit={handleSubmit}
                                    initialValues={values}
                                    onFinish={handleSubmit}
                                    onFinishFailed={onFinishFailed}
                                    className="searchArtists-form"
                                >
                                    {message === 1 &&
                                        <Form.Item
                                            name="email"
                                            onChange={handleChange}
                                            className="searchArtists-form-email"
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
                                            <input className="searchArtists-message searchArtists-message-text" type="text" />
                                        </Form.Item>
                                    }
                                    {message === 2 && (
                                        <Form.Item
                                            name="number"
                                            onChange={handleChange}
                                            className="searchArtists-form-number"
                                            value={values.number}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your number!',
                                                },
                                                {
                                                    message: 'Invalid number',
                                                    validator: (_, value) => {
                                                        if (!/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/.test(value)) {
                                                            return Promise.reject('Invalid number');
                                                        } else {
                                                            return Promise.resolve();
                                                        }
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input className="searchArtists-message searchArtists-message-number" type="tel" />
                                        </Form.Item>
                                    )}

                                    <Form.Item
                                        className="searchArtists-form-button"
                                        wrapperCol={{
                                            span: 8,
                                        }}
                                    >
                                        <button className="searchArtists-button" type="primary" htmltype="submit">
                                            <img className="searchArtists-planeImg" src={plane} alt="Alert Paperplane" />
                                        </button>
                                    </Form.Item>
                                </Form>)}
                            </Formik>
                        </div>
                    </div>
                </>
                
            )}
        </div>
            <div className='searchArtists-footer'>
                <div className='footer-fanalarm-title'>Fan Alarm</div>
            </div>
        </>
    )
}