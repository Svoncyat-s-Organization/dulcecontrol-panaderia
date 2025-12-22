package com.dulcecontrol.bakery.shared.integration.decolecta;

public class DecolectaException extends RuntimeException {
    
    public DecolectaException(String message) {
        super(message);
    }
    
    public DecolectaException(String message, Throwable cause) {
        super(message, cause);
    }
}
