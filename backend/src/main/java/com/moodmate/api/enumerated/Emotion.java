package com.moodmate.api.enumerated;

public enum Emotion {
    NO_EMOTION("NO_EMOTION"),
    JOY("JOY"),
    ANGER("ANGER"),
    SADNESS("SADNESS"),
    FEAR("FEAR");

    private final String name;

    Emotion(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static Emotion from(String name) {
        for (Emotion emotion : Emotion.values()) {
            if (emotion.getName().equals(name)) {
                return emotion;
            }
        }
        throw new IllegalArgumentException("No emotion found for name: " + name);
    }

    @Override
    public String toString() {
        return name;
    }
}
