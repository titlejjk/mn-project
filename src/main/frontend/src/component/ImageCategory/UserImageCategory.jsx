import React, {useState, useEffect}  from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './ImageCategory.css'
import axios from 'axios';
import SlickSlider from "../../lib/slickSlide";
import {Arrow} from "../../lib/arrow";
//만든 categories를 map으로 category 객체와 index 값을 가져와서 각각의 key값과 대입이 되어야 할 값을 넣어준다
const UserImageCategory = ({onChange}) => {
    const [userCategories, setUserCategories] = useState([]);
   // const [userNum, setUserNum] = useState([])

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
                            onClick={() => onChange(userCategory.userNum)}
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