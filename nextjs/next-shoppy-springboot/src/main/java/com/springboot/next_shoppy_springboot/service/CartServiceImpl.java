package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.*;
import com.springboot.next_shoppy_springboot.entity.CartItem;
import com.springboot.next_shoppy_springboot.entity.Member;
import com.springboot.next_shoppy_springboot.entity.Product;
import com.springboot.next_shoppy_springboot.repository.CartRepository;
import com.springboot.next_shoppy_springboot.repository.UserRepository;
import com.springboot.next_shoppy_springboot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional //JPA에서 update/delete 작업시 명시적으로 정의 필수!!!!
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public int deleteItem(CartItemRequestDto requestDto) {
        return cartRepository.deleteItem(requestDto.getCid());
    }

    @Override
    public CartItemResponseDto getCount(CartItemRequestDto requestDto) {
        int count = cartRepository.countById(requestDto.getId());
        CartItemResponseDto responseDto = new CartItemResponseDto(count);
        return responseDto;
    }

    @Override
    public List<CartListResponseDto> findList(CartItemRequestDto requestDto) {
        List<CartListResponseDto> list = new ArrayList<>();
        List<CartItem> cartItemList = cartRepository.findList(requestDto.getId());
        long totalPrice = cartItemList.stream()
                .mapToLong(item -> item.getQty() * item.getProduct().getPrice())
                .sum();
        cartItemList.forEach(cartItem -> {
            CartListResponseDto dto = new CartListResponseDto(cartItem, totalPrice);
            list.add(dto);
        });
        return list;
    }


    @Override
    public int updateQty(CartItemRequestDto requestDto) {
        int result = 0;
        if(requestDto.getType().equals("+")) {
            result = cartRepository.increaseQty(requestDto.getCid());
        } else {
            result = cartRepository.decreaseQty(requestDto.getCid());
        }
        return result;
    }


    @Override
    public CartItemResponseDto checkQty(CartItemRequestDto requestDto) {
        CartItemResponseDto responseDto = new CartItemResponseDto();
        int pid = requestDto.getPid();
        String size = requestDto.getSize();
        String id = requestDto.getId();
        CartCheckQtyDto qtyDto = cartRepository.checkQty(pid, size, id);
        if(qtyDto != null) {
            responseDto.setCid(qtyDto.getCid());
            responseDto.setCheckQty(qtyDto.getCount());
        } else responseDto.setCheckQty(0L);
        return responseDto;
    }

    @Override
    public int add(CartItemRequestDto requestDto) {
        int result = 0;
        Product product = productRepository.findByPid(requestDto.getPid());
        Optional<Member> member = userRepository.findById(requestDto.getId());
        CartItem cartItem = new CartItem(requestDto, product, member.get());
        CartItem entity = cartRepository.save(cartItem);
        if(entity != null) result = 1;
        return result;
    }
}
