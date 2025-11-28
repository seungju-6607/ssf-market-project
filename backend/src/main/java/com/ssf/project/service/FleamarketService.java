package com.ssf.project.service;

import com.ssf.project.dto.FleamarketDto;
import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.dto.FleamarketMsgDto;

import java.util.List;

public interface FleamarketService {
    int add(FleamarketDto fleamarketDto);
    int updateList(FleamarketDto fleamarketDto);
    boolean deleteByFleaKey(Integer fleaKey);
    int add(FleamarketMsgDto fleamarketMsgDto);
    List<FleamarketMsgDto> findMsgByBuyer(FleamarketMsgDto fleamarketMsgDto);
    List<FleamarketMsgDto> findMsgBySeller(FleamarketMsgDto fleamarketMsgDto);
    List<FleamarketListResponseDto> findAllList();
    List<FleamarketListResponseDto> findFilterList(FleamarketDto fleamarketDto);
    List<FleamarketListResponseDto> getByFleaKey(FleamarketDto fleamarketDto);
}
