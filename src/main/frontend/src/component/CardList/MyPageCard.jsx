import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyPageCard = ({ card, showTitle }) => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        // 이미지를 Axios로 불러옵니다.
        axios
            .get(`/recipe/image/${card.mainPath}`, { responseType: 'arraybuffer' })
            .then((response) => {
                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setImageData(`data:image/jpeg;base64,${base64String}`);
            })
            .catch((error) => {
                console.error('Error fetching image:', error);
            });
    }, [card.mainPath]);

    return (
        <div className="my-page-card">
            <Link to={`/RecipeDetail?rcpNum=${card.rcpNum}`}>
                <img className="my-page-card-img" src={imageData} alt={card.title} />
            </Link>

            {showTitle && (
                <div className='my-page-card-title-box'>
                    <h2 className="my-page-cardList-title">{card.title}</h2>
                </div>
            )}
        </div>
    );
};

export default MyPageCard;