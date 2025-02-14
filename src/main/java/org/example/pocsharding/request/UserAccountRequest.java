package org.example.pocsharding.request;

import lombok.Data;

@Data
public class UserAccountRequest {
    private String name;
    private String email;
    private String cpf;
}
