package com.ssf.project.controller;

import com.ssf.project.dto.FleamarketDto;
import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.dto.FleamarketMsgDto;
import com.ssf.project.service.FleamarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/market")
@RequiredArgsConstructor
public class FleamarketController {
    private final FleamarketService fleamarketService;
    private final String uploadDir = "uploads";

    /* 판매글 등록 */
    @PostMapping("/add")
    public int add(@RequestBody FleamarketDto fleamarketDto) {
        return fleamarketService.add(fleamarketDto);
    }
    
    /* 판매글 목록 */
    @PostMapping("/list")
    public List<FleamarketListResponseDto> findAllList() {
        return fleamarketService.findAllList();
    }

    /* 필터링 판매글 목록 */
    @PostMapping("/filterList")
    public List<FleamarketListResponseDto> findFilterList(@RequestBody FleamarketDto fleamarketDto) {
        System.out.println("fleamarketDto1 -> "+ fleamarketDto);
        return fleamarketService.findFilterList(fleamarketDto);
    }

    /* 판매글 상세 정보 */
    @PostMapping("/listDetail")
    public List<FleamarketListResponseDto> getByFleaKey(@RequestBody FleamarketDto fleamarketDto) {
        return fleamarketService.getByFleaKey(fleamarketDto);
    }

    /* 구매자 문의 등록 */
    @PostMapping("/sendMsg")
    public int add(@RequestBody FleamarketMsgDto fleamarketMsgDto) {
        return fleamarketService.add(fleamarketMsgDto);
    }

    /* 구매자 문의 목록 */
    @PostMapping("/getBuyerMsg")
    public List<FleamarketMsgDto> findMsgByBuyer(@RequestBody FleamarketMsgDto fleamarketMsgDto) {
        return fleamarketService.findMsgByBuyer(fleamarketMsgDto);
    }

    /* 판매자 문의함 목록 */
    @PostMapping("/getSellerMsg")
    public List<FleamarketMsgDto> findMsgBySeller(@RequestBody FleamarketMsgDto fleamarketMsgDto) {
        return fleamarketService.findMsgBySeller(fleamarketMsgDto);
    }

    /* 이미지 업로드 */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImages(@RequestParam("images") MultipartFile[] images) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));

        List<String> keys = new ArrayList<>();
        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;
            String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String key = UUID.randomUUID().toString() + (ext != null ? "." + ext : "");
            file.transferTo(Paths.get(uploadDir).resolve(key));
            keys.add(key);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("keys", keys);
        return ResponseEntity.ok(res);
    }
}
