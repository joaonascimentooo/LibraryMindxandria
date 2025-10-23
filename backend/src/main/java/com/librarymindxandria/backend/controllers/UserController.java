package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.user.UserResponseDTO;
import com.librarymindxandria.backend.dtos.user.UserUpdateRequestDTO;
import com.librarymindxandria.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UserUpdateRequestDTO requestDTO){
        UserResponseDTO updateProfile = userService.updateUser(requestDTO);
        return ResponseEntity.ok(updateProfile);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProfile() {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }
}
