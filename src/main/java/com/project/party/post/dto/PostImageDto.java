package com.project.party.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostImageDto {

    private int imageId;
    private int postId;
    private String imageUrl;
    private MultipartFile imageFile;
}
