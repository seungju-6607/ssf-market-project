package com.ssf.project.entity;

import com.ssf.project.dto.MemberAddrDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "ssf_addr")
public class MemberAddr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int  addrKey;

    private String userKey;
    private String addrZipcode;
    private String addrTel;
    private String addrReq;
    private String addrName;
    private String addrMain;
    private String addrDetail;
    private String addrDef;

    // dto => entity
    public MemberAddr(MemberAddrDto memberAddrDto) {
        this.addrKey = memberAddrDto.getAddrKey();
        this.userKey = memberAddrDto.getUserKey();
        this.addrZipcode = memberAddrDto.getAddrZipcode();
        this.addrTel = memberAddrDto.getAddrTel();
        this.addrReq = memberAddrDto.getAddrReq();
        this.addrName = memberAddrDto.getAddrName();
        this.addrMain = memberAddrDto.getAddrMain();
        this.addrDetail = memberAddrDto.getAddrDetail();
        this.addrDef = memberAddrDto.getAddrDef();
    }
}