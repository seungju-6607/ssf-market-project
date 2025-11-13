package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
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

}