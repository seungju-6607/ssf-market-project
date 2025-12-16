import React from 'react';
import { FaPlus } from 'react-icons/fa6';

export function ImageList({imgList, className}) {
    const classType = className.substring(0,6);

    return (
        <ul className={className}>
            {imgList && imgList.map((img, idx) =>
                <li key={idx}>
                    {classType === 'review'?
                    <img src= {img} />
                    : <img src={`/images/${img}`} /> }
                </li>
            )}
        </ul>
    );
}

