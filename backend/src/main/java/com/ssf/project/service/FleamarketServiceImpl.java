package com.ssf.project.service;

import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;
import com.ssf.project.dto.FleamarketDto;
import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.entity.Fleamarket;
import com.ssf.project.repository.JpaFleamarketRepository;
import com.ssf.project.repository.JpaCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service // memberServiceImpl
@Transactional  // DB가 auto-commit 모드이면 생략가능
public class FleamarketServiceImpl implements FleamarketService{
    private final JpaFleamarketRepository jpaFleamarketRepository;
    private final JpaCartRepository jpaCartRepository;

    @Autowired
    public FleamarketServiceImpl(JpaFleamarketRepository jpaFleamarketRepository,
                                 JpaCartRepository jpaCartRepository) {
        this.jpaCartRepository = jpaCartRepository;
        this.jpaFleamarketRepository = jpaFleamarketRepository;
    }

    @Override
    public List<FleamarketListResponseDto> findAllList() {
        return jpaFleamarketRepository.findAllList();
    }


    @Override
    public int add(FleamarketDto fleamarketDto) {
        String email = fleamarketDto.getFleaId();
        String userKey = jpaCartRepository.findUserKeyByEmail(email);
        System.out.println("fleamarketDto.getFleaList() --> " + fleamarketDto.getFleaList());
        Fleamarket entity = new Fleamarket();
        entity.setUserKey(userKey);
        entity.setFleaSale("N");
        entity.setFleaName(fleamarketDto.getFleaName());
        entity.setFleaEmail(fleamarketDto.getFleaEmail());  // 플리마켓 등록한 이메일(선택)
        entity.setFleaId(email);    // 로그인한 계정 id(필수)
        entity.setFleaTitle(fleamarketDto.getFleaTitle());
        entity.setFleaPrice(fleamarketDto.getFleaPrice());
        entity.setFleaCategory(fleamarketDto.getFleaCategory());
        entity.setFleaContent(fleamarketDto.getFleaContent());
        entity.setFleaList(fleamarketDto.getFleaList());
        entity.setFleaRdate(fleamarketDto.getFleaRdate());

        Fleamarket saved = jpaFleamarketRepository.save(entity);

        return saved != null ? 1 : 0;
    }


}
