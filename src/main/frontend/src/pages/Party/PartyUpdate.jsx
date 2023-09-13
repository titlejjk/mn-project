import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Page(){
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onChange = (event) => {
        const { value, name } = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
        ...board,
        [name]: value,
        });
    };

    const saveDetail = () => {
        axios.post('http://localhost:9999/party/update', {

        })
        .then(res => {
            alert('수정되었습니다.');
            navigate('/partyDetail');
        })
        .catch(error => {
            console.log(error);
        });
    };

    

    const backToList = () => {
        navigate('/partyDetail');
    };

    return (
    <div>
        <div>
            <span>작성자</span>
            <input
            type="text"
            name="createdBy"
            value={createdBy}
            onChange={onChange}
            />
        </div>
        <br />
        <div>
            <span>내용</span>
            <textarea
            name="contents"
            cols="30"
            rows="10"
            value={contents}
            onChange={onChange}
            ></textarea>
        </div>
        <br />
        <div>
            <button onClick={saveDetail}>저장</button>
            <button onClick={backToList}>취소</button>
        </div>
    </div>
    );
}

export default Page;