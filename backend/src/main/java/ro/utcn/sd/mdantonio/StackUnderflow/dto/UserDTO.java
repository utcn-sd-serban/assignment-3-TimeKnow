package ro.utcn.sd.mdantonio.StackUnderflow.dto;

import lombok.Data;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.UnderflowUser;

@Data
public class UserDTO {
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String permission;
    private boolean banned;
    private Long score;

    public UserDTO(Integer id, String username, String password, String email, String permission, boolean banned, Long score) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.permission = permission;
        this.banned = banned;
        this.score = score;
    }

    public static UserDTO ofEntity(UnderflowUser underflowUser) {
        return new UserDTO(underflowUser.getUserid(), underflowUser.getUsername(), underflowUser.getPassword(),
                underflowUser.getEmail(), underflowUser.getPermission(), underflowUser.isBanned(), underflowUser.getScore());
    }

    public static UserDTO ofMinimalInformation(UserDTO dto) {
        dto.password = "NOT AVAILABLE";
        dto.banned = false;
        dto.permission = "NOT AVAILABLE";
        return dto;
    }
}
