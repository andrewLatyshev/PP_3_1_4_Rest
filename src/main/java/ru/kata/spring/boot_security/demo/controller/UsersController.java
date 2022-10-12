package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
public class UsersController {

	private UserService userService;

	@Autowired
	public void usersController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/{id}")
	public String showUser(@PathVariable("id") Long id, Model model) {
		model.addAttribute("user", userService.showUser(id));
		return "user";
	}

	@GetMapping("/user")
	public String toUserPage(Principal principal, Model model) {
		model.addAttribute("user", userService.showUserByName(principal.getName()));
		return "user";
	}

//	@GetMapping(value = "form/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//	public ResponseEntity<User> showUserById(@PathVariable Long id) {
//		try {
//			User user = userService.showUser(id);
//			return new ResponseEntity<>(user, HttpStatus.OK);
//		} catch (Exception e) {
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//		}
//	}

//	@GetMapping("/user")
//	public String userPage(@AuthenticationPrincipal User user, Model model) {
//		model.addAttribute("user", user);
//		model.addAttribute((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
//		return "/user";
//	}
}