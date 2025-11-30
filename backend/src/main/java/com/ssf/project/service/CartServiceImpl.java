package com.ssf.project.service;

import com.ssf.project.dto.CartCheckQtyDto;
import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;
import com.ssf.project.entity.CartItem;
import com.ssf.project.repository.JpaCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final JpaCartRepository jpaCartRepository;

    @Override
    public List<CartListResponseDto> findCartListByEmail(CartItemDto cartItemDto) {
        if (cartItemDto == null) {
            return Collections.emptyList();
        }
        String email = cartItemDto.getEmail();
        return jpaCartRepository.findCartListByEmail(email);
    }


    @Override
    public int deleteItem(List<CartItemDto> cartItem) {
        List<Integer> cartKeys = cartItem.stream()
                .map(CartItemDto::getCartKey)
                .collect(Collectors.toList());

        return jpaCartRepository.deleteItem(cartKeys);
    }

    @Override
    public CartItemDto getCount(CartItemDto cartItem) {
        int count = jpaCartRepository.countByEmail(cartItem.getEmail());
        cartItem.setSumQty(count);

        return cartItem;
    }

    @Override
    public int updateQty(CartItemDto cartItem) {
        int result = 0;
        if (cartItem.getType().equals("+")) {
            result = jpaCartRepository.updateQtyPlus(cartItem.getCartKey());
        } else if (cartItem.getType().equals("-")) {
            result = jpaCartRepository.updateQtyMinus(cartItem.getCartKey());
        }    

        return result;
    }

   @Override
   public CartItemDto checkQty(CartItemDto cartItem) {
       int itemKey = cartItem.getItemKey();
       String size = cartItem.getCartSize();
       String email = cartItem.getEmail();
       CartCheckQtyDto qtyDto = jpaCartRepository.checkQty(itemKey, size, email);

       if(qtyDto != null) {
           cartItem.setCartKey(qtyDto.getCartKey());
           cartItem.setCheckQty(qtyDto.getCount());
       } else {
           cartItem.setCheckQty(0L);
       }
       return cartItem;
   }


   @Override
   public int add(CartItemDto cartItem) {
        String email = cartItem.getEmail();
        String userKey = jpaCartRepository.findUserKeyByEmail(email);

        /* 장바구니에 담으려는 상품의 개수 */
        int requestQty = cartItem.getCartQty() > 0 ? cartItem.getCartQty() : 1;

        /* 장바구니에 동일한 상품 존재 하는지 체크 */
        CartCheckQtyDto existing = jpaCartRepository.checkQty(
                cartItem.getItemKey(),
                cartItem.getCartSize(),
                email
        );

        /* 동일한 상품 존재하면, 담으려는 개수만큼 updateQtyPlus 호출 */
        if (existing != null && existing.getCartKey() > 0) {
            for (int i = 0; i < requestQty; i++) {
                jpaCartRepository.updateQtyPlus(existing.getCartKey());
            }
            return 1;
        }

        /* 동일한 상품이 존재하지 않으면 새로운 객체 */
        CartItem entity = new CartItem();
        entity.setUserKey(userKey);
        entity.setItemKey(cartItem.getItemKey());
        entity.setCartQty(requestQty);
        entity.setCartSize(cartItem.getCartSize());
        entity.setCartRdate(cartItem.getCartRdate() != null ? cartItem.getCartRdate() : LocalDate.now());

        CartItem saved = jpaCartRepository.save(entity);
        return saved != null ? 1 : 0;
   }
}

