package com.moodmate.api.domain.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import java.util.Map;
import java.util.HashMap;
import com.moodmate.api.domain.login.service.JwtService;

/**
 * 컨트롤러: login 요청 처리
 * 
 * - login은 oauth2 google 로그인 방식을 사용
 * - google 인증 후 토큰 발급
 * - 토큰은 JWT 형식으로 발급
 */
@RestController
@RequestMapping("/v1/login")
public class LoginController {

    private final JwtService jwtService;
    
    @Autowired
    public LoginController(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    
    @GetMapping("/success")
    public Map<String, String> loginSuccess(Authentication authentication) {
        String token = jwtService.generateToken(authentication);
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", authentication.getName());
        
        return response;
    }
}
