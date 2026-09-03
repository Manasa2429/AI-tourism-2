package com.designtravel.controller;

import com.designtravel.dto.ImageDto;
import com.designtravel.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping
    public ResponseEntity<List<ImageDto>> searchImages(
            @RequestParam String query,
            @RequestParam(defaultValue = "6") int count
    ) {
        return ResponseEntity.ok(imageService.searchPhotos(query, count));
    }
}
