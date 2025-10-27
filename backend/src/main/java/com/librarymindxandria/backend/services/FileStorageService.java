package com.librarymindxandria.backend.services;

import com.librarymindxandria.backend.dtos.upload.LoadedFile;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final ServletContext servletContext;

    public FileStorageService(@Value("${file.upload-dir:./uploads}") String uploadDir,
                              ServletContext servletContext) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.servletContext = servletContext;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(
                    "Não foi possível criar o diretório onde os arquivos serão armazenados.", ex);
        }
    }


    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        try {
            if (uniqueFilename.contains("..")) {
                throw new RuntimeException(
                        "Desculpe! O nome do arquivo contém uma sequência de caminho inválida: " + uniqueFilename);
            }

            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return uniqueFilename;

        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível armazenar o arquivo " + uniqueFilename + ". Por favor, tente novamente!", ex);
        }
    }


    public String buildFileUri(String filename) {
        if (filename == null || filename.isBlank()) {
            return null;
        }

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/")
                .path(filename)
                .toUriString();
    }


    public LoadedFile loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("Arquivo não encontrado: " + filename);
            }

            String contentType = null;
            try {
                contentType = servletContext.getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) { }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return new LoadedFile(resource, contentType);

        } catch (MalformedURLException ex) {
            throw new RuntimeException("Arquivo não encontrado: " + filename, ex);
        }
    }
}