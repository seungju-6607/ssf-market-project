package com.ssf.project.entity;

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
}