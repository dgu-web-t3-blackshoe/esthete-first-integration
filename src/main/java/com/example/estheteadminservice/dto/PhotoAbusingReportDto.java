package com.example.estheteadminservice.dto;

import com.example.estheteadminservice.entity.Photo;
import com.example.estheteadminservice.entity.PhotoAbusingReport;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public interface PhotoAbusingReportDto {

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
        @JsonInclude(JsonInclude.Include.NON_NULL)
        class CreateRequest {
                private String photoId;
                private String photoTitle;
                private String photoDescription;
                private String photoUrl;
                private String photoCreatedAt;
                private String photographerId;
                private String photographerNickname;
                private String photographerProfileImg;
                private String reporterId;
                private String reporterNickname;
                private String reporterProfileImg;
                private String reason;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
        @JsonInclude(JsonInclude.Include.NON_NULL)
        class ReadReportedPhotoResponse {
                private String photoId;
                private String photoTitle;
                private String photoDescription;
                private String photoUrl;
                private String photoCreatedAt;
                private String photographerId;
                private String photographerNickname;
                private String photographerProfileImg;
                private Long photoAbusingReportCount;
                private Long photographerPhotoAbusingReportCount;

                public ReadReportedPhotoResponse(Photo photo) {
                        this.photoId = photo.getPhotoId().toString();
                        this.photoTitle = photo.getTitle();
                        this.photoDescription = photo.getDescription();
                        this.photoUrl = photo.getPhotoUrl();
                        this.photoCreatedAt = photo.getCreatedAt().toString();
                        this.photographerId = photo.getPhotographer().getPhotographerId().toString();
                        this.photographerNickname = photo.getPhotographer().getNickname();
                        this.photographerProfileImg = photo.getPhotographer().getProfileImgUrl();
                        this.photoAbusingReportCount = (long) photo.getPhotoAbusingReports().size();
                        this.photographerPhotoAbusingReportCount
                                = photo.getPhotographer().getPhotos().stream().mapToLong(p -> p.getPhotoAbusingReports().size()).sum();
                }
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
        @JsonInclude(JsonInclude.Include.NON_NULL)
        class ReadDetailedInfoResponse {
                private String reporterId;
                private String reporterNickname;
                private String reporterProfileImg;
                private String reportReason;
                private Long reporterPhotoAbusingReportCount;

                public ReadDetailedInfoResponse(PhotoAbusingReport photoAbusingReport) {
                        this.reporterId = photoAbusingReport.getAbusingReporter().getAbusingReporterId().toString();
                        this.reporterNickname = photoAbusingReport.getAbusingReporter().getNickname();
                        this.reporterProfileImg = photoAbusingReport.getAbusingReporter().getProfileImgUrl();
                        this.reportReason = photoAbusingReport.getReason();
                        this.reporterPhotoAbusingReportCount
                                = (long) photoAbusingReport.getAbusingReporter().getPhotoAbusingReports().size();
                }
        }
}
