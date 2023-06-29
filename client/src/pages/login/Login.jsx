import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 사용자 이름, 비밀번호 저장하기
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const navigate = useNavigate()

  // AuthContext에서 아래 가져오기
  const { loading, error, dispatch } = useContext(AuthContext);
  
  // 필드 변경 감지하고 입력할 때 마다 실행
  const handleChange = (e) => {
    // 직접 변경은 불가능하니까 기존 credentials 객체 복사하고 변경된 필드 업데이트 하기
    // 현재 변경된 입력 필드의 이름 id (키) - 현재 변경된 값 (값)
    setCredentials(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const handleClick = async e => {
    e.preventDefault();
    // 액션을 dispatch를 통해 컨텍스트로 전달
    dispatch({type: "LOGIN_START"})
    try {
      // 엔드포인트로 credentials (이름, 비밀번호) 전달
      const res = await axios.post('/auth/login', credentials)
      // 로그인 성공 시 액션 디스패치 후 받은 데이터를 payload에 전달
      dispatch({type: "LOGIN_SUCCESS", payload: res.data})
      // 메인 페이지로 리다이렉트
      navigate('/')
    }catch(err) {
      // 로그인 실패 시 액션 디스페이 후 에러 메시지를 payload에 전달
      dispatch({type: "LOGIN_FAILURE", payload: err.response.data})
    }
  }
  
  return (
    <div>
      <div className="lContainer">
        <input
          type="text"
          placeholder="이름"
          id="username"
          onChange={handleChange}
          className="lInput"
        ></input>
        <input
          type="password"
          placeholder="비밀번호"
          id="password"
          onChange={handleChange}
          className="lInput"
        ></input>
        <button disabled={loading} onClick={handleClick} className="lButton">로그인</button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
