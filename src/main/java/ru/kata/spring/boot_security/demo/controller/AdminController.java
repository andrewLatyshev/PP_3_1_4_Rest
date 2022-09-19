package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    UserService userService;
    RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    	@GetMapping
	public String showAllUsers(Model model) {
		List<User> users = userService.getAllUsers();
		model.addAttribute("users", users);
		return "admin/admin-index";
	}


    @GetMapping(path = "user/{id}")
    public String showUser(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.showUser(id));
        return "/users/user";
    }

    @GetMapping("/user-create")
    public String createUserForm(User user) {
        return "admin/user-create";
    }

    @PostMapping("/user-create")
    public String createUser(User user, Model model) {
        model.addAttribute("role", roleService.getAll());
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/user_delete/{id}")
    public String removeById(@PathVariable("id") Long id) {
        userService.removeUserById(id);
        return "redirect:/admin";
    }

    @GetMapping("/user-update/{id}")
    public String updateUserForm(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.showUser(id));
        model.addAttribute("role", roleService.getAll());
        return "admin/user-update";
    }

    @PostMapping("/user-update")
    public String updateUser(int id, User user) {
        userService.editUser(id, user);
        return "redirect:/admin";
    }
}
