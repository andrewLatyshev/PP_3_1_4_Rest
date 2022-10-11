package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    void saveUser(User user);

    void removeUserById(Long id);

    void editUser(User user, String role);

    User showUser(Long id);

    public User showUserByName(String name);
}
