package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserDao {

    List<User> getAllUsers();

    void saveUser(User user);

    void removeUserById(Long id);

    void editUser(User user);

    User showUser(Long id);

    User showUserByName(String name);
}
