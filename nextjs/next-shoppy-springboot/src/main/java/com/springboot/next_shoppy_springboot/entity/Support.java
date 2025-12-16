package com.springboot.next_shoppy_springboot.entity;

import com.springboot.next_shoppy_springboot.dto.SupportDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="support")
@Getter @Setter
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sid;
    private String title;
    private String content;
    private String stype;
    private int hits;
    private String rdate;

    //DTO <=> Entity : DB 연동 작업
    public Support() {}
    public Support(SupportDto dto) {
        this.sid = dto.getSid();
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.stype = dto.getStype();
        this.hits = dto.getHits();
        this.rdate = dto.getRdate();
    }
}
