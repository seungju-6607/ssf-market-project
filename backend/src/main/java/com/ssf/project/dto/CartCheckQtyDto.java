package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
public class CartCheckQtyDto {
    private int cartKey;
    private Long count;
}
