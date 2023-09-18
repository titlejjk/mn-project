import React, {useEffect, useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './ImageCategory.css'
import axios from "axios";

//만든 categories를 map으로 category 객체와 index 값을 가져와서 각각의 key값과 대입이 되어야 할 값을 넣어준다
const PetTypeImageCategory = ({ onPetNumChange }) => {

    const ImagesCategories = [
        { PetTypeName: '반려견',categoryImage: '/images/animal01.png' , petNum:1 },
        { PetTypeName: '반려묘', categoryImage: '/images/animal02.png', petNum:2},
        { PetTypeName: '반려조', categoryImage: '/images/animal03.png' , petNum:3},
        { PetTypeName: '반려햄', categoryImage: '/images/animal04.png' , petNum:4},
        { PetTypeName: '기타', categoryImage: '/images/animal05.png' , petNum:5},
    ];


    return (
        //categoryList를 새로 만들었다
        <div className="PetType-category-list">
            {ImagesCategories && ImagesCategories.map((ImagesCategory, index) => (
                <div key={index} className="images-category">
                    <Link
                        className="category"
                        to={`/petRecipeBoard?petNum=${ImagesCategory.petNum}`}
                        key={index}
                        onClick={() => onPetNumChange(ImagesCategory.petNum)}
                    >
                        <img src={ImagesCategory.categoryImage} alt={ImagesCategory.PetTypeName} />
                        <p>{ImagesCategory.PetTypeName}</p>
                        {/*</button>*/}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default PetTypeImageCategory;
