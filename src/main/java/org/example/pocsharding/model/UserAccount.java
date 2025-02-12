package org.example.pocsharding.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_account")
public class UserAccount {
    @Id
    private Long id;
    private String name;
    private String email;
    private String cpf;
}
