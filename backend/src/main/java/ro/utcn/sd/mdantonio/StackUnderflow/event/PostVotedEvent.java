package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostVotedEvent extends BaseEvent {
    private final PostDTO postDTO;

    public PostVotedEvent(PostDTO postDTO) {
        super(EventType.POST_VOTED);
        this.postDTO = postDTO;
    }
}
