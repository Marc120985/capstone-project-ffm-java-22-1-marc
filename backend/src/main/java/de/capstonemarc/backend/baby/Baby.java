package de.capstonemarc.backend.baby;

import de.capstonemarc.backend.pictures.PictureModel;
import de.capstonemarc.backend.pictures.PictureModelGallery;

import java.util.List;

public record Baby(
        String id,
        String name,
        String birthday,
        String weight,
        String height,
        String gender,
        PictureModel profilePicture,
        List<PictureModelGallery> pictureGallery

) {
}
