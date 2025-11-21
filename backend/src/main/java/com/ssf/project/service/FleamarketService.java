package com.ssf.project.service;

import com.ssf.project.dto.FleamarketDto;
import com.ssf.project.dto.FleamarketListResponseDto;

import java.util.List;

public interface FleamarketService {
    int add(FleamarketDto fleamarketDto);
    List<FleamarketListResponseDto> findAllList();
}
