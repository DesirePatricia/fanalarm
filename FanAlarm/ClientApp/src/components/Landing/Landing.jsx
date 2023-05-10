import React from 'react';
import tickets from '../../images/fabulous-tickets.png';
import './Landing.css'

export default function Landing() {

    return (
        <div className='homeBackground'>
            <img className='ticketsImg' src={tickets} alt="FanAlarm Concert Tickets" />
            <div className='homeTitleContainer'>
                <h1 className='homeTitle'>Fan Alarm</h1>
                <div className='homeSubtitle'>get concert alerts for your favorite artists never miss a concert again</div>
            </div>
        </div>
    );
}