package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private UserService userService;
    private RoleService roleService;

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

    @GetMapping("/user-create")
    public String createUserForm(User user, @RequestParam() String role,  Model model) {

        model.addAttribute("role", roleService.getRoleByName(role));
        return "admin/user-create";
    }

    @PostMapping("/user-create")
    public String createUser(User user) {
        userService.saveUser(user);
        return "redirect:/admin";
//    }


//    @PostMapping("/user-create")
//    public String add(@ModelAttribute("userInfo") User user, @RequestParam("rolesSelected") Long[] roles){
//        Set<Role> roleSet = new HashSet<>();
//        for (Long s : roles) {
//            roleSet.add(roleService.getById(s));
//        }
//        user.setRoles(roleSet);
//        userService.saveUser(user);
//        return "redirect:/admin";
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
