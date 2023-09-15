import React, {useState, useEffect}  from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './ImageCategory.css'
import axios from 'axios';
import SlickSlider from "../../lib/slickSlide";
import {Arrow} from "../../lib/arrow";
//만든 categories를 map으로 category 객체와 index 값을 가져와서 각각의 key값과 대입이 되어야 할 값을 넣어준다
const UserImageCategory = ({onUserNumChange}) => {
    const [userCategories, setUserCategories] = useState([]);
    const [imageDataList, setImageDataList] = useState([]);
    const [userNum, setUserNum] = useState([])

    const Settings = {
        arrow: true,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        nextArrow: <Arrow />,
        prevArrow: <Arrow />
    };

    // 사용자 번호를 기반으로 사용자 카테고리 가져오기
    useEffect(() => {
        axios.get(`http://localhost:9999/user/list`)
            .then((response) => {
                setUserCategories(response.data);
            })
            .catch((error) => {
                console.error('UserCategory Url Error fetching data:', error);
            });
    }, [userNum]);



    useEffect(() => {
        // UsersCategories가 변경될 때 모든 카테고리의 이미지 데이터 가져오기
        const fetchDataForCategories = async () => {
            const imageDataPromises = userCategories.map(async (userCategory) => {
                try {
                    const response = await axios.get(`/user/image/${userCategory.userProfile}`, { responseType: 'arraybuffer' });
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

        if (userCategories.length > 0) {
            fetchDataForCategories();
        }
    }, [userCategories]);


    return (
        <div className="User-category-list">
            <SlickSlider
                items={userCategories.map((userCategory, index) => (
                    <div key={index} className="images-category">
                        <Link
                            className="category"
                            to={`/myRecipeBoard?userNum=${userCategory.userNum}`}
                            key={index}
                            onClick={() => onUserNumChange(userCategory.userNum)}
                        >
                            <img src={imageDataList[index]} alt={userCategory.userNickname} />
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