package com.ssf.project.controller;

import com.ssf.project.dto.FleamarketDto;
import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.service.FleamarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/market")
@RequiredArgsConstructor
public class FleamarketController {
    private final FleamarketService fleamarketService;

    /* 판매글 등록 */
    @PostMapping("/add")
    public int add(@RequestBody FleamarketDto fleamarketDto) {
        return fleamarketService.add(fleamarketDto);
    }
    
    /* 판매글 목록 */
    @PostMapping("/list")
    public List<FleamarketListResponseDto> findListByEmail() {
        return fleamarketService.findAllList();
    }
}
