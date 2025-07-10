import React, { useState } from 'react';
import './Columns.css';

const Israel = () => {

    return (
        <div className="container">
            <h2 className="title text-center mb-4">Israel At War</h2>
            <iframe
                src="https://jhdaytonleader.wixsite.com/israelatwar/news"
                width="100%"
                height="600vh"
            ></iframe>
        </div>
    );
};

export default Israel;
