package com.dulcecontrol.bakery.shared.sede;

public final class SedeContextHolder {

    private static final ThreadLocal<SedeContext> CONTEXT = new ThreadLocal<>();

    private SedeContextHolder() {
    }

    public static void set(SedeContext context) {
        CONTEXT.set(context);
    }

    public static SedeContext get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
