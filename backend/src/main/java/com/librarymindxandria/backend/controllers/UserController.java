package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.UserResponseDTO;
import com.librarymindxandria.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyProfile(){
        UserResponseDTO userProfile = userService.getAuthenticatedUserProfile();
        return ResponseEntity.ok(userProfile);
    }
}
