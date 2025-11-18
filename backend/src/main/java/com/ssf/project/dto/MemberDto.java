package com.ssf.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MemberDto {

    private String userKey;     // 회원고유번호

    @JsonProperty("email")
    private String email;       // 이메일

    @JsonProperty("name")
    private String username;    // 회원명

    @JsonProperty("password")
    private String userpwd;     // 비밀번호

    private String banned;      // 정지여부
    private String signout;     // 회원탈퇴여부
    private String signin;      // 가입날짜
    private String snsprov;     // SNS제공자종류
    private String snsid;       // 사용자SNS고유ID
    private String referralId;  // 추천인ID
    private String phone;       // 휴대전화번호
    private String role;        // 권한구분코드
}