package org.example.pocsharding.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class IdGeneratorService {
    private static final AtomicInteger sequence = new AtomicInteger(0);

    public Long generateUniqueId() {
        // Combina timestamp com sequência para garantir unicidade
        long timestamp = Instant.now().toEpochMilli();
        int seq = sequence.incrementAndGet() % 1000; // Reset após 1000

        // Combina timestamp com sequência
        // Formato: TTTTTTTTTSSS
        // onde T é timestamp e S é sequência
        return (timestamp * 1000) + seq;
    }
}
