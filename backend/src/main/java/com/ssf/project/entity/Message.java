package com.ssf.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "flea_messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int msgId;

    private int fleaKey;
    private String buyerId;
    private String sellerId;
    private String senderId;
    private String senderName;
    private String inquiryMsg;
    private LocalDateTime createdAt;
    private boolean readFlag;

    public Message() {}
}
