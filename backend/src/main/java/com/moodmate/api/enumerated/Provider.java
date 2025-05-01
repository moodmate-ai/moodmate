package com.moodmate.api.enumerated;

import java.util.Arrays;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Provider {
    GITHUB(null, "id", "login"),
    GOOGLE(null, "id", "login");

    private final String attributeKey;
    private final String providerCode;
    private final String identifier;

    public static Provider from(String provider) {
        String upperCastedProvider = provider.toUpperCase();

        return Arrays.stream(Provider.values())
            .filter(item -> item.name().equals(upperCastedProvider))
            .findFirst()
            .orElseThrow();
    }
}
