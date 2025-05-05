package com.moodmate.api.domain.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.moodmate.api.domain.user.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * /user/login processes not only login but also signup using google oauth2.
     * @return
     */
    @PostMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/info")
    public String getUserInfo(String id) {
        return "login";
    }
}
