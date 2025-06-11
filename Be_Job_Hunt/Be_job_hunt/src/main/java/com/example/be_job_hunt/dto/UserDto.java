package com.example.be_job_hunt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long userId;
    private int gender;
    @NotBlank(message = "First name không được để trống")
    @Size(max = 50, message = "First name tối đa 50 ký tự")
    private String firstName;

    @NotBlank(message = "Last name không được để trống")
    @Size(max = 50, message = "Last name tối đa 50 ký tự")
    private String lastName;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, max = 100, message = "Password phải từ 8 đến 100 ký tự")
    private String password;

    @NotBlank(message = "User name không được để trống")
    @Size(min = 3, max = 50, message = "User name phải từ 3 đến 50 ký tự")
    private String userName;
    @NotBlank(message = "Email không được để trống")
    private String email;
    private List<Long> role;

    public UserDto(Long id, String userName, String email, List<String> roles) {
    }
}
