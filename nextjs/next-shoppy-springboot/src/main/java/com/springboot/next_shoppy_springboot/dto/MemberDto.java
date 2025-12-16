package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.Member;
import lombok.Data;

@Data
public class MemberDto {
    private String id;
    private String pwd;
    private String name;
    private String phone;
    private String email;
    private String role;

    //Member 엔티티의 결과를 저장하기 위한 생성자 정의
    public MemberDto() {}
    public MemberDto(String id, String role) {
        this.id = id;
        this.role = role;
    }
    public MemberDto(String id, String pwd, String role) {
        this.id = id;
        this.pwd = pwd;
        this.role = role;
    }
    public MemberDto(Member entity) {
        this.id = entity.getId();
        this.pwd = entity.getPwd();
        this.name = entity.getName();
        this.phone = entity.getPhone();
        this.email = entity.getEmail();
    }
}
