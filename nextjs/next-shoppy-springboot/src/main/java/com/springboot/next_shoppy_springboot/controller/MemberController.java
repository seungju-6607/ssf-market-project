package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.MemberDto;
import com.springboot.next_shoppy_springboot.service.JwtUtilService;
import com.springboot.next_shoppy_springboot.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtilService jwtUtilService;

    @Autowired
    public MemberController(MemberService memberService,
                            AuthenticationManager authenticationManager,
                            JwtUtilService jwtUtilService) {
        this.memberService = memberService;
        this.authenticationManager = authenticationManager;
        this.jwtUtilService = jwtUtilService;
    }

    @PostMapping("/idcheck")
    public String idcheck(@RequestBody MemberDto member) {
        boolean result = memberService.idCheck(member.getId());  //아이디 O: 1, X: 0
        String msg = "";
        if(result) msg = "이미 사용중인 아이디 입니다.";
        else msg = "사용이 가능한 아이디 입니다.";
        return msg;
    }

    @PostMapping("/signup")
    public boolean signup(@RequestBody MemberDto member) {
        boolean result = false;
        int rows = memberService.signup(member);
        if(rows == 1) result = true;
        return result;
    }

}
