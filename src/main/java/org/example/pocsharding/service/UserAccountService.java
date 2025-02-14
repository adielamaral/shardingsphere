package org.example.pocsharding.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.pocsharding.model.UserAccount;
import org.example.pocsharding.repository.UserAccountRepository;
import org.example.pocsharding.request.UserAccountRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;


    private final IdGeneratorService idGeneratorService;

    public UserAccount create(UserAccountRequest request) {
        UserAccount userAccount = new UserAccount();
        userAccount.setId(idGeneratorService.generateUniqueId());
        userAccount.setName(request.getName());
        userAccount.setEmail(request.getEmail());
        userAccount.setCpf(request.getCpf());

        log.info("User ID {} has been successfully registered!", userAccount.getId());
        return userAccountRepository.save(userAccount);
    }

    public List<UserAccount> listAllUsers() {
        return userAccountRepository.findAll();
    }

    public UserAccount update(Long id, UserAccountRequest request) {
        Optional<UserAccount> optionalUserAccount = userAccountRepository.findById(id);

        if (optionalUserAccount.isPresent()) {
            UserAccount userAccount = optionalUserAccount.get();

            userAccount.setName(request.getName());
            userAccount.setCpf(request.getCpf());
            userAccount.setEmail(request.getEmail());

            return userAccountRepository.save(userAccount);
        } else {
            throw new RuntimeException("UserAccount not found with ID: " + id);
        }
    }

    public void delete(Long id) {
        userAccountRepository.deleteById(id);
    }
}
