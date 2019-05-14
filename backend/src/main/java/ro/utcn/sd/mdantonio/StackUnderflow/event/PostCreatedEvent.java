package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostCreatedEvent extends BaseEvent {
    private final PostDTO postDTO;

    public PostCreatedEvent(PostDTO postDTO) {
        super(EventType.POST_CREATED);
        this.postDTO = postDTO;
    }
}
