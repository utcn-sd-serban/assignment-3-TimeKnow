package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.UserDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserUpdatedEvent extends BaseEvent {
    private final UserDTO userDTO;

    public UserUpdatedEvent(UserDTO userDTO) {
        super(EventType.USER_UPDATED);
        this.userDTO = userDTO;
    }
}
