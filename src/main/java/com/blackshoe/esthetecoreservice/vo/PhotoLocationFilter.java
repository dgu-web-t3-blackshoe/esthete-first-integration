package com.blackshoe.esthetecoreservice.vo;

import lombok.Builder;
import lombok.Data;

@Data
public class PhotoLocationFilter {
    private Double latitude;
    private Double longitude;
    private Double latitudeDelta;
    private Double longitudeDelta;

    @Builder
    public PhotoLocationFilter(Double latitude , Double longitude , Double radius) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.latitudeDelta = radiusToLatitudeDelta(radius);
        this.longitudeDelta = radiusToLongitudeDelta(latitude, radius);
    }

    private Double radiusToLatitudeDelta(Double radius) {
        return radius / 111.0;
    }

    private Double radiusToLongitudeDelta(Double latitude, Double radius) {
        return radius / (111.0 * Math.cos(Math.toRadians(latitude)));
    }
}
