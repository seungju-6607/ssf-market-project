package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.KakaoPayDto;

public interface OrderService {
    int save(KakaoPayDto kakaoPay);
}
