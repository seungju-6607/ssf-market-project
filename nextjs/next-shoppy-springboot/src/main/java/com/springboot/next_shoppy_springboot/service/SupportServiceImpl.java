package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.PageResponseDto;
import com.springboot.next_shoppy_springboot.dto.SupportDto;
import com.springboot.next_shoppy_springboot.entity.Support;
import com.springboot.next_shoppy_springboot.repository.SupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupportServiceImpl implements SupportService{

    private SupportRepository supportRepository;

    @Autowired
    public SupportServiceImpl(SupportRepository supportRepository) {
        this.supportRepository = supportRepository;
    }

    @Override
    public PageResponseDto<SupportDto> findSearchAll(SupportDto support) {
        //✨Page 객체의 인덱스 시작점이 0번지 인덱스로 초기화!!!!
        int currentPage = support.getCurrentPage()-1;
        int pageSize = support.getPageSize();
        String type = support.getType();
        String keyword = "%" + support.getKeyword() +"%";
        Pageable pageable = PageRequest.of(currentPage, pageSize);

        Page<Support> list = supportRepository.search(type, keyword, pageable);
        List<SupportDto> resultList = new ArrayList<>();
        int offset = pageSize * currentPage;
        for(int i=0; i<list.getContent().size(); i++) {
            SupportDto dto = new SupportDto(list.getContent().get(i));
            dto.setRowNumber(offset + i + 1);  //행번호 추가
            resultList.add(dto);
        }

        return new PageResponseDto<>(
                resultList,
                list.getTotalElements(),
                list.getTotalPages(),
                list.getNumber()  //currentPage
        );
    }


    @Override
    public PageResponseDto<SupportDto> findAll(SupportDto support) {
        //✨Page 객체의 인덱스 시작점이 0번지 인덱스로 초기화!!!!
        int currentPage = support.getCurrentPage()-1;  
        int pageSize = support.getPageSize();
        String stype = support.getStype();
        Pageable pageable = PageRequest.of(currentPage, pageSize);
        Page<Support> list = null;
        if(support.getStype().equals("all")) {
            list = supportRepository.findAll(pageable);
        } else {
            list = supportRepository.findByType(stype, pageable);
        }

        List<SupportDto> resultList = new ArrayList<>();
        //entity <=> Dto, rowNumber 추가
        int offset = pageSize * currentPage;
        for(int i=0; i<list.getContent().size(); i++) {
                SupportDto dto = new SupportDto(list.getContent().get(i));
                dto.setRowNumber(offset + i + 1);  //행번호 추가
                resultList.add(dto);
        }

        return new PageResponseDto<>(
                resultList,
                list.getTotalElements(),
                list.getTotalPages(),
                list.getNumber()  //currentPage
        );
    }
}
