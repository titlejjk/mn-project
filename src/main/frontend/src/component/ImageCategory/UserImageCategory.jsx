import React, {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import './ImageCategory.css'
import axios from 'axios';
import SlickSlider from "../../lib/slickSlide";
import {Arrow} from "../../lib/arrow";
//만든 categories를 map으로 category 객체와 index 값을 가져와서 각각의 key값과 대입이 되어야 할 값을 넣어준다
const UserImageCategory = () => {
    const [UsersCategories, setUsersCategories] = useState([]);
    const [imageDataList, setImageDataList] = useState([]);

    const Settings = {
        arrow: true,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        nextArrow: <Arrow />,
        prevArrow: <Arrow />
    };

    /* 각각 카테고리 목록을 axios로 불러오기 */
    useEffect(() => {
        axios.get(`http://localhost:9999/user/list`)
            .then((Response) => {
                setUsersCategories(Response.data);
            })
            .catch((error) => {
                console.error('UserCategory Url Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // UsersCategories가 변경될 때 모든 카테고리의 이미지 데이터 가져오기
        const fetchDataForCategories = async () => {
            const imageDataPromises = UsersCategories.map(async (UserCategory) => {
                try {
                    const response = await axios.get(`/user/image/${UserCategory.userProfile}`, { responseType: 'arraybuffer' });
                    const base64String = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                    return `data:image/jpeg;base64,${base64String}`;
                } catch (error) {
                    console.error('UserCategory Image Error fetching data:', error);
                    return null;
                }
            });

            const imageDataResults = await Promise.all(imageDataPromises);
            setImageDataList(imageDataResults);
        };

        if (UsersCategories.length > 0) {
            fetchDataForCategories();
        }
    }, [UsersCategories]);

    return (
        <div className="User-category-list">
            <SlickSlider items={UsersCategories && UsersCategories.map((UserCategory, index) => (
                <div key={index} className="images-category">
                    <Link to={`/myRecipe?userNum=${UserCategory.userNum}`} className="category">
                        <img src={imageDataList[index]} alt={UserCategory.userNickname} />
                        <p>{UserCategory.userNickname}</p>
                    </Link>
                </div>
            ))} settings={Settings} />
        </div>
    );
};

export default UserImageCategory;