package com.ssf.project.service;

import com.ssf.project.dto.*;
import com.ssf.project.entity.CartItem;
import com.ssf.project.entity.Fleamarket;
import com.ssf.project.entity.Message;
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
    public List<FleamarketMsgDto> findMsgByBuyer(FleamarketMsgDto fleamarketMsgDto) {
        return jpaFleamarketRepository.findMsgByBuyer(fleamarketMsgDto.getFleaKey(),
                                                    fleamarketMsgDto.getBuyerId(),
                                                    fleamarketMsgDto.getSellerId());
    }

    @Override
    public List<FleamarketMsgDto> findMsgBySeller(FleamarketMsgDto fleamarketMsgDto) {
        return jpaFleamarketRepository.findMsgBySeller(fleamarketMsgDto.getFleaKey(),
                                                    fleamarketMsgDto.getSellerId());
    }

    @Override
    public List<FleamarketListResponseDto> findAllList() {
        return jpaFleamarketRepository.findAllList();
    }

    @Override
    public List<FleamarketListResponseDto> findFilterList(FleamarketDto fleamarketDto) {
        return jpaFleamarketRepository.findFilterList(fleamarketDto.getFleaSale(),
                                                    fleamarketDto.getFleaCategory(),
                                                    fleamarketDto.getFilterWord());
    }

    @Override
    public List<FleamarketListResponseDto> getByFleaKey(FleamarketDto fleamarketDto) {
        return jpaFleamarketRepository.getByFleaKey(fleamarketDto.getFleaKey());
    }

    @Override
    public int add(FleamarketDto fleamarketDto) {
        String email = fleamarketDto.getFleaId();
        String userKey = jpaCartRepository.findUserKeyByEmail(email);
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

    @Override
    public boolean deleteByFleaKey(Integer fleaKey) {
        int result = jpaFleamarketRepository.deleteByFleaKey(fleaKey);
        return result > 0;
    }

    @Override
    public int updateList(FleamarketDto fleamarketDto) {
        return jpaFleamarketRepository.updateList(
                fleamarketDto.getFleaKey(),
                fleamarketDto.getFleaSale(),
                fleamarketDto.getFleaCategory(),
                fleamarketDto.getFleaTitle(),
                fleamarketDto.getFleaContent(),
                fleamarketDto.getFleaList(),
                fleamarketDto.getFleaPrice());
    }

    @Override
    public int add(FleamarketMsgDto fleamarketMsgDto) {
        int rows = jpaFleamarketRepository.msgBuySave(
                fleamarketMsgDto.getFleaKey(),
                fleamarketMsgDto.getBuyerId(),
                fleamarketMsgDto.getSellerId(),
                fleamarketMsgDto.getSenderId(),
                fleamarketMsgDto.getSenderName(),
                fleamarketMsgDto.getInquiryMsg());
        return rows;
    }

}
