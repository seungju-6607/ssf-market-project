package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FleamarketMsgDto {
    private int msgId;
    private int fleaKey;            // 판매글번호
    private String buyerId;
    private String sellerId;
    private String senderId;
    private String senderName;
    private String inquiryMsg;
    private LocalDateTime createdAt;
    private boolean readFlag;
}