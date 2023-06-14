import React from 'react';
import './Artist.css'

export default function Artist() {

    return (
        <div className=''>
            <img className='artist_image' />
            <div className='artist_artistname'></div>
            <div className='artist_concertwrapper'>
                <div>Concerts in Your Area</div>
                <div>
                    <div className='artist_concertcity'></div>
                    <div className='artist_concertvenue'></div>
                    <div className='artist_concertdate'></div>
                </div>
            </div>
        </div>
    );
}