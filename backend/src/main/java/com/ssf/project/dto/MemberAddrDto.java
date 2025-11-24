package com.ssf.project.dto;

import com.ssf.project.entity.MemberAddr;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberAddrDto {
    private int  addrKey;
    private String userKey;
    private String addrZipcode;
    private String addrTel;
    private String addrReq;
    private String addrName;
    private String addrMain;
    private String addrDetail;
    private String addrDef;
    private String email;

    public MemberAddrDto(MemberAddr entity) {
        this.addrKey = entity.getAddrKey();
        this.userKey = entity.getUserKey();
        this.addrZipcode = entity.getAddrZipcode();
        this.addrTel = entity.getAddrTel();
        this.addrReq = entity.getAddrReq();
        this.addrName = entity.getAddrName();
        this.addrMain = entity.getAddrMain();
        this.addrDetail = entity.getAddrDetail();
        this.addrDef = entity.getAddrDef();
    }

}