import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ImageCategory.css';
import axios from 'axios';
import SlickSlider from "../../lib/slickSlide";
import { Arrow } from "../../lib/arrow";
import jwt_decode from "jwt-decode";

const UserImageCategory = ({ handleNumChange }) => {
    const [userCategories, setUserCategories] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('login-token');

        if (token) {
            const decodedToken = jwt_decode(token);

            if (decodedToken.roles === 'ADMIN') {
                setIsAdmin(true);
            }
        }
    }, []);

    const Settings = {
        arrow: true,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        nextArrow: <Arrow />,
        prevArrow: <Arrow />
    };

    useEffect(() => {
        axios.get(`http://localhost:9999/user/list`)
            .then((response) => {
                // "admin" 역할을 가진 사용자를 필터링하여 userCategories 배열에 추가하지 않음
                setUserCategories(response.data.filter(userCategory => userCategory.role !== 'ADMIN'));
            })
            .catch((error) => {
                console.error('UserCategory Url Error fetching data:', error);
            });
    }, []);

    return (
        <div className="User-category-list">
            <SlickSlider
                items={userCategories.map((userCategory, index) => (
                    <div key={index} className="images-category">
                        <Link
                            className="category"
                            to={`/myRecipeBoard?userNum=${userCategory.userNum}`}
                            key={index}
                            onClick={() => handleNumChange(userCategory.userNum)}
                        >
                            <img src={`http://localhost:9999/party/image/${userCategory.userProfile}`} alt={userCategory.userNickname} />
                            <p>{userCategory.userNickname}</p>
                        </Link>
                    </div>
                ))}
                settings={Settings}
            />
        </div>
    );
};

export default UserImageCategory;