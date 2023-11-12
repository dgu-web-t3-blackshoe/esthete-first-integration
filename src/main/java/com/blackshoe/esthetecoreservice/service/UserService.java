package com.blackshoe.esthetecoreservice.service;

import com.blackshoe.esthetecoreservice.dto.UserDto;

import java.util.UUID;

public interface UserService {
    UserDto.ReadEquipmentsResponse getEquipmentsForUser(UUID userId);

}
