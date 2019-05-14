package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostDeletedEvent extends BaseEvent {
    private final PostDTO postDTO;

    public PostDeletedEvent(PostDTO postDTO) {
        super(EventType.POST_DELETED);
        this.postDTO = postDTO;
    }
}
