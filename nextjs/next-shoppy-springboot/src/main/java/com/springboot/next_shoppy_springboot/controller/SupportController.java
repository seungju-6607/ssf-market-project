package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.PageResponseDto;
import com.springboot.next_shoppy_springboot.dto.SupportDto;
import com.springboot.next_shoppy_springboot.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/support")
public class SupportController {

    private SupportService supportService;

    @Autowired
    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping("/search/list")
    public PageResponseDto<SupportDto> searchList(@RequestBody SupportDto support) {
        return supportService.findSearchAll(support);
    }

    @PostMapping("/list")
    public PageResponseDto<SupportDto> list(@RequestBody SupportDto support) {
        return supportService.findAll(support);
    }
}
