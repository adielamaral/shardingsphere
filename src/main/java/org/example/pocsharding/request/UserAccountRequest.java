package org.example.pocsharding.request;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class UserAccountRequest {
    @Id
    private Long id;
    private String name;
    private String email;
    private String cpf;
}
