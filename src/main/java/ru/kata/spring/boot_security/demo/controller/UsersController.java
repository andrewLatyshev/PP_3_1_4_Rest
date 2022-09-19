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

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/users")
public class UsersController {

	private UserService userService;
	private RoleService roleService;

	@Autowired
	public void usersController(UserService userService) {
		this.userService = userService;
	}



	@GetMapping("/{id}")
	public String showUser(@PathVariable("id") Long id, Model model) {
		model.addAttribute("user", userService.showUser(id));
		return "/users/user";
	}

//
//	@GetMapping("/authenticate")
//	public String authenticationPage(Principal principal) {
//		User user = userService.showUserByName(principal.getName());
//		return "secured-page" + user.getUsername() + user.getSurname();
//	}


}