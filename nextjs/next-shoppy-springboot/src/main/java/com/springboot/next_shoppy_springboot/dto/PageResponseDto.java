package com.springboot.next_shoppy_springboot.dto;

import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseDto<T> {
    private List<SupportDto> list;
    private long totalCount;
    private int totalPage;
    private int currentPage;
}
