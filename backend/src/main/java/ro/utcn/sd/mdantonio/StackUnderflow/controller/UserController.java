package ro.utcn.sd.mdantonio.StackUnderflow.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.UserDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UnderflowUserManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UserSessionManagementService;

import java.util.List;

import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.USER;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UnderflowUserManagementService underflowUserManagementService;
    private final UserSessionManagementService userSessionManagementService;

    @PostMapping("/register")
    public UserDTO registerUser(@RequestBody UserDTO dto) {
        return underflowUserManagementService.addUnderflowUser(dto.getUsername(), dto.getPassword(), dto.getEmail(),
                false, USER);
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody UserDTO dto) {
        return underflowUserManagementService.login(dto.getUsername(), dto.getPassword());
    }

    @GetMapping("/users")
    public List<UserDTO> getUsers() {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        return underflowUserManagementService.findAll(currentUserId);
    }

    @DeleteMapping("/users")
    public void deleteUsers(@RequestBody UserDTO dto){
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        underflowUserManagementService.removeUser(currentUserId, dto.getId());
    }

    @PutMapping("/users/ban")
    public UserDTO banUser(@RequestBody UserDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        return underflowUserManagementService.changeUserBannedStatus(currentUserId, dto.getId(), dto.isBanned());
    }
}
