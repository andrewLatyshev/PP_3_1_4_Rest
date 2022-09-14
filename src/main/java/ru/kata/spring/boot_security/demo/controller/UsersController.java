package ru.kata.spring.boot_security.demo.controller;

import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@Controller
public class UsersController {

	private final UserService userService;

	public UsersController(UserService userService) {
		this.userService = userService;
	}
	@GetMapping( value = "/")
	public String showAllUsers(Model model) {
		List<User> users = userService.getAllUsers();
		model.addAttribute("users", users);
		return "index";
	}

	@GetMapping("/authenticate")
	public String authenticationPage(Principal principal) {
		User user = userService.showUserByName(principal.getName());
		Authentication a = SecurityContextHolder.getContext().getAuthentication();
		return "secured-page" + user.getUsername() + " " + user.getSurname();
	}

	@GetMapping("/user-create")
	public String createUserForm(User user) {
		return "user-create";
	}

	@PostMapping("/user-create")
	public String createUser(User user) {
		userService.saveUser(user);
		return "redirect:/";
	}

	@GetMapping("user-delete/{id}")
	public String removeById(@PathVariable("id") int id) {
		userService.removeUserById(id);
		return "redirect:/";
	}

	@GetMapping("user-update/{id}")
	public String updateUserForm(@PathVariable("id") int id, Model model) {
		model.addAttribute("user", userService.showUser(id));
		return "user-update";
	}

	@PostMapping("/user-update")
	public String updateUser(int id, User user) {
		userService.editUser(id, user);
		return "redirect:/";
	}

}