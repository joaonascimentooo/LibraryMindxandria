package com.librarymindxandria.backend.dtos.upload;

import org.springframework.core.io.Resource;

public record LoadedFile(
        Resource resource,
        String contentType
) {
}
