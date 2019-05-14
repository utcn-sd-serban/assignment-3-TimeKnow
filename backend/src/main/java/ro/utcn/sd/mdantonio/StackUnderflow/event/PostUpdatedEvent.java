package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostUpdatedEvent extends BaseEvent {
    private final PostDTO postDTO;

    public PostUpdatedEvent(PostDTO postDTO) {
        super(EventType.POST_UPDATED);
        this.postDTO = postDTO;
    }
}
