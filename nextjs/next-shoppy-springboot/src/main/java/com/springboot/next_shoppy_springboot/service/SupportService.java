package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.PageResponseDto;
import com.springboot.next_shoppy_springboot.dto.SupportDto;

import java.util.List;

public interface SupportService {
    PageResponseDto<SupportDto> findAll(SupportDto support);
    PageResponseDto<SupportDto> findSearchAll(SupportDto support);
}
