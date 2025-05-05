package com.moodmate.api.domain.user.service;

import com.moodmate.api.domain.user.model.User;

public interface UserService {

    User getUser(String id);

    User createUser(User user);
    
}
