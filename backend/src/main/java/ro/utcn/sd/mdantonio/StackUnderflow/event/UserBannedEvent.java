package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.UserDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserBannedEvent extends BaseEvent {
    private final UserDTO userDTO;

    public UserBannedEvent(UserDTO userDTO) {
        super(EventType.USER_BANNED);
        this.userDTO = userDTO;
    }
}
