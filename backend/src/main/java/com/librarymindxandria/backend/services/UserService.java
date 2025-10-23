package com.librarymindxandria.backend.services;

import com.librarymindxandria.backend.dtos.user.UserResponseDTO;
import com.librarymindxandria.backend.dtos.user.UserUpdateRequestDTO;
import com.librarymindxandria.backend.models.User;
import com.librarymindxandria.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDTO getAuthenticatedUserProfile() {
        User user = getAuthenticatedUserEntity();

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail());
    }

    public User getAuthenticatedUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }

        String userEmail = authentication.getName();

        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + userEmail));
    }

    public UserResponseDTO updateUser(UserUpdateRequestDTO updateRequestDTO){
        User user = getAuthenticatedUserEntity();

        Optional.ofNullable(updateRequestDTO.getName())
                .ifPresent(user::setName);

        User updatedUser = userRepository.save(user);

        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(updatedUser.getId());
        userResponseDTO.setName(updatedUser.getName());

        return userResponseDTO;
    }

    public void deleteUser(){
        User currentUser = getAuthenticatedUserEntity();
        userRepository.delete(currentUser);
    }
}
