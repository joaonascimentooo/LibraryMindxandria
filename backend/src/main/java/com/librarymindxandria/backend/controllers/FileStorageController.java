package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.upload.LoadedFile;
import com.librarymindxandria.backend.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileStorageController {
    private final FileStorageService fileStorageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {

        LoadedFile loadedFile = fileStorageService.loadFileAsResource(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(loadedFile.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + loadedFile.resource().getFilename() + "\"")
                .body(loadedFile.resource());
    }

    @PostMapping("/upload-file")
    public ResponseEntity<String> uploadFile(@RequestParam("file")MultipartFile file){
        String fileDownloadUri = fileStorageService.storeFile(file);
        return ResponseEntity.ok(fileDownloadUri);
    }
}
