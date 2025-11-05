import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function SportsMain() {
  return (
    <div className="page">
      <h1>스포츠 메인 페이지</h1>
      <div className="grid">
        <img src="/images/sample1.jpg" alt="" />
        <img src="/images/sample2.jpg" alt="" />
        <img src="/images/sample3.jpg" alt="" />
        <img src="/images/sample4.jpg" alt="" />
        <img src="/images/sample5.jpg" alt="" />
        <img src="/images/sample6.jpg" alt="" />
      </div>
    </div>
  );
}
export default SportsMain;
