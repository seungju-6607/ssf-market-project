// import React from 'react';

export default function ProductAvatar({img}) {
    return (
        <div className='product-avata'>
            <img src={`/images/${img}`} alt="product-image" />
        </div>
    );
}

