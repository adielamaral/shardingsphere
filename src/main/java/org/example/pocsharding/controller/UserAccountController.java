package org.example.pocsharding.controller;

import lombok.RequiredArgsConstructor;
import org.example.pocsharding.model.UserAccount;
import org.example.pocsharding.request.UserAccountRequest;
import org.example.pocsharding.service.UserAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserAccountController {

    private final UserAccountService userAccountService;

    @PostMapping("/save")
    public ResponseEntity<UserAccount> create(@RequestBody UserAccountRequest request) {
        var user = userAccountService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserAccount>> listAllUsers() {
        var users = userAccountService.listAllUsers();

        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAccount> updateUserAccount(@PathVariable("id") Long id, @RequestBody UserAccountRequest request) {
        UserAccount updatedUserAccount = userAccountService.update(id, request);
        return ResponseEntity.ok(updatedUserAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAccount(@PathVariable("id") Long id) {
        userAccountService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
