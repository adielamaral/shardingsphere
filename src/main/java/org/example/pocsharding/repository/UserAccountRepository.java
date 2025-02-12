package org.example.pocsharding.repository;

import org.example.pocsharding.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    List<UserAccount> findByNameContainsIgnoreCase(String name);

    @Query("SELECT MAX(u.id) FROM UserAccount u")
    Long findMaxId();

    UserAccount findByCpf(String cpf);
}
