import './AllArtists.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import Grid from '@mui/material/Grid';
import plane from '../../images/Paperplane.svg';
import { Formik } from 'formik';
import { Input, Form, notification } from 'antd';

export default function AllArtists() {
    const key = 'updatable';
    const [{ token, artists }, dispatch] = useStateProvider();
    const [artistsNum, setArtistsNum] = useState(50);
    const [artistsAll, setArtistsAll] = useState([]);
    const [message, setMessage] = React.useState(1);
    const [latitude, setLatitude] = React.useState(0);
    const [longitude, setLongitude] = React.useState(0);
    const [checkedState, setCheckedState] = useState(
        new Array(50).fill(true)
    );

    const handleArtistsChange = (event) => {
        setArtistsNum(parseInt(event.target.value));
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


    const addDataToSQL = async (values) => {
        let userData = {email: values.email, number: values.number, artistData: [], latitude: latitude.toString(), longitude: longitude.toString()}
        if(message == 2){
            userData.email = '';
        }
        else{
            userData.number = '';
        }
            artistsAll?.map(({ name, totalAllArtists }) => {
                if (totalAllArtists <= artistsNum && checkedState[totalAllArtists - 1]) {
                    userData.artistData.push({name})
                    console.log("artistdata: " + name);
                }
            });

        try {
            console.log("User Data:" + JSON.stringify(userData));
            const userResult = await postUserData(userData);
            if(userResult){
                openNotification();
            }
            else{
                openErrorNotification();
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        const getArtistData = async () => {
            const cachedData = localStorage.getItem('spotifyAllData');

            if (cachedData) {
                // Use the cached data
                const parsedData = JSON.parse(cachedData);
                dispatch({ type: reducerCases.GET_ALL_ARTISTS, artists: parsedData });
            } else {
                try {
                    const response = await axios.get(
                        "https://api.spotify.com/v1/me/top/artists?limit=50",
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const { items } = response.data;
                    let counter = 1;
                    const artists = items.map(({ name, artistId, id }) => {
                        let totalAllArtists = counter++;
                        return { name, artistId, id, totalAllArtists };
                    });
                    setArtistsAll(artists);
                    // Cache the response in localStorage
                    localStorage.setItem('spotifyAllData', JSON.stringify(artists));
                    dispatch({ type: reducerCases.GET_ALL_ARTISTS, artists });
                } catch (error) {
                    // Handle error
                }
            }
        };
        getArtistData();
    }, [token, dispatch]);

    useEffect(() => {
        // Update the artistsNum state whenever it changes
        setArtistsNum(artistsNum);
    }, [artistsNum]);
    useEffect(() => {
        // Update the artistsNum state whenever it changes
        setArtistsAll(artists);
    }, [artists]);

    useEffect(() => {
        console.log(checkedState);
    }, [checkedState]);

    useEffect(() => {
        console.log(latitude);
    }, [latitude]);

    useEffect(() => {
        console.log(longitude);
    }, [longitude]);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation not supported");
    }
    return (
        <>
        <div className="allArtists-wrapper">
            <div className='allArists-header'>
                <div className='allArtists-header-title'>Fan Alarm</div>
            </div>
            <div className="allArtists-title">
                YOUR TOP <input className="allArtists-top-count" 
                    defaultValue="50"
                    onChange={handleArtistsChange}
                    name="topArtistsDisplay" 
                    type="number"
                    min="1"
                    max="50" /> ARTISTS
            </div>
            <ul className="allArtists-lists">
                    {artists?.map(({ name, id, totalAllArtists }) => {
                    if (totalAllArtists <= artistsNum){
                    return (
                            <li className="allArtists-artist" key={id}>
                                <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                                    <Grid item xs={2} xsoffset={0} sm={2} md={2} mdoffset={0}>
                                        <div className="allArtists-artist-num">{totalAllArtists}</div>
                                    </Grid>
                                    <Grid item xs={8} xsoffset={0} sm={8} md={6} mdoffset={0}>
                                        <div className="allArtists-artist-name">{name}</div>
                                    </Grid>
                                    <Grid item xs={2} xsoffset={0} sm={2} md={4} mdoffset="auto">
                                    <input className="allArtists-checkbox" type="checkbox" name="myCheckbox" onChange={() => handleCheckedChange(totalAllArtists)} defaultChecked={true} />
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    }
                    return null;
                    })}
            </ul>
            <div className="allArtists-message-wrapper">
                <div className="allArtists-message-radio-wrapper">
                    <label className="allArtists-radio-label">
                        <span className="allArtists-radio-text">Email</span>
                            <input className="allArtists-radio" defaultChecked={true}
                                onClick={() => setMessage(1)} type="radio" value="email" name="message" />
                    </label>
                    <label className="allArtists-radio-label">
                        <span className="allArtists-radio-text">Text</span> 
                            <input className="allArtists-radio"
                                onClick={() => setMessage(2)} type="radio" value="text" name="message" />
                    </label>
                </div>
                <div className="allArtists-message-container">
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
                                className="allArtists-form"
                            >
                           { message === 1 && 
                                <Form.Item
                                    name="email"
                                    onChange={handleChange}
                                    className="allArtists-form-email"
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
                                        <input className="allArtists-message allArtists-message-text" type="text" />
                                </Form.Item>
                                }
                                    {message === 2 && (
                                        <Form.Item
                                            name="number"
                                            onChange={handleChange}
                                            className="allArtists-form-number"
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
                                            <Input className="allArtists-message allArtists-message-number" type="tel" />
                                        </Form.Item>
                                    )}

                                <Form.Item
                                    className="allArtists-form-button"
                                    wrapperCol={{
                                        span: 8,
                                    }}
                                >
                                    <button className="allArtists-button" type="primary" htmltype="submit">
                                        <img className="allArtists-planeImg" src={plane} alt="Alert Paperplane" />
                                    </button>
                                </Form.Item>
                            </Form>)}
                        </Formik>
                </div>
            </div>
            
        </div>
        <div className='allArtists-footer'>
                <div className='footer-fanalarm-title'>Fan Alarm</div>
        </div>
        </>
    );
}