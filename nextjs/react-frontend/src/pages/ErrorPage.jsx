import React from "react";
import { useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom';

export function ErrorPage() {
  const { type } = useParams();
  const location = useLocation();
  const { status, message } = location.state || {};

  return (
    <div style={{ textAlign: "center", "padding-top": "200px" }}>
      { type === "forbidden" ?
          <h1>접근 권한 오류 입니다.</h1>
          : <h1>서버 오류 입니다.</h1>
       }
      <h3>확인후 다시 접속해주세요!!</h3>
    <p>
        { type === "forbidden" ?
            <img src="/images/access_denied.jpg" width="400"/>
          : <img src="/images/internal_server_error.jpg" width="400"/>
          }
    </p>
        <a href="/">Shoppy 홈이동</a>
    </div>
  );
}
