package com.ssf.project.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/market")
@RequiredArgsConstructor
public class FleamarketController {
    private final FleamarketService fleamarketService;
    private final String uploadDir = "uploads";
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 파싱용

    /* 판매글 등록 */
    @PostMapping("/add")
    public int add(@RequestBody FleamarketDto fleamarketDto) {
        return fleamarketService.add(fleamarketDto);
    }

    /* 판매글 수정 */
    @PostMapping("/listUpdate")
    public FleamarketListResponseDto updateList(@RequestBody FleamarketDto fleamarketDto) {
        // 업데이트 실행
        fleamarketService.updateList(fleamarketDto);

        // 업데이트 후 실제 객체 조회 후 반환
        List<FleamarketListResponseDto> updated = fleamarketService.getByFleaKey(fleamarketDto);
        return updated.isEmpty() ? null : updated.get(0);
    }

    /* 판매글 삭제 */
    @PostMapping("/listRemove")
    public Map<String, Object>  deleteByFleaKey(@RequestBody FleamarketDto fleamarketDto) {
        Integer fleaKey = fleamarketDto.getFleaKey();

        boolean deleted = fleamarketService.deleteByFleaKey(fleaKey);

        Map<String, Object> res = new HashMap<>();
        res.put("fleaKey", fleaKey);
        res.put("deleted", deleted);

        return res;
    }

    /* 판매글 목록 */
    @PostMapping("/list")
    public List<FleamarketListResponseDto> findAllList() {
        return fleamarketService.findAllList();
    }

    /* 필터링 판매글 목록 */
    @PostMapping("/filterList")
    public List<FleamarketListResponseDto> findFilterList(@RequestBody FleamarketDto fleamarketDto) {
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

    /* 이미지 삭제 */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteImages(@RequestBody Map<String, Object> payload) throws Exception {
        Object keysObj = payload.get("keys"); // Object 타입으로 받음
        List<String> keys = new ArrayList<>();

        if (keysObj instanceof List<?>) {
            // 배열로 들어온 경우
            for (Object o : (List<?>) keysObj) {
                keys.add(String.valueOf(o));
            }
        } else if (keysObj instanceof String) {
            // 문자열로 들어온 경우 ["a.jpg","b.jpg"] -> JSON 배열 파싱
            keys = objectMapper.readValue((String) keysObj, new TypeReference<List<String>>() {});
        } else {
            throw new IllegalArgumentException("Invalid keys format");
        }

        // 실제 파일 삭제
        List<String> deleted = new ArrayList<>();
        for (String key : keys) {
            Path path = Paths.get(uploadDir).resolve(key);
            try {
                if (Files.exists(path)) {
                    Files.delete(path);
                    deleted.add(key);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("deleted", deleted);
        return ResponseEntity.ok(res);
    }
}
