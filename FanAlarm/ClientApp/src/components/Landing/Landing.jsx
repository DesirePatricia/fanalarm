import React from 'react';
import tickets from '../../images/fabulous-tickets.png';
import './Landing.css'

export default function Landing() {

    return (<>
        <div className='homeBackground'>
            <img className='ticketsImg' src={tickets} />
            <div className='homeTitleContainer'>
                <div className='homeTitle'>Fan Alarm</div>
                <div className='homeSubtitle'>get concert alerts for your favorite artists never miss a concert again</div>
            </div>
        </div>
    </>
    );
}