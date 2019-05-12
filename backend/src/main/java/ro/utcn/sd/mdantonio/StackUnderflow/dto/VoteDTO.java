package ro.utcn.sd.mdantonio.StackUnderflow.dto;

import lombok.Data;

@Data
public class VoteDTO {
    private Integer postId;
    private boolean isUpVote;

    public VoteDTO(Integer postId, boolean isUpVote) {
        this.postId = postId;
        this.isUpVote = isUpVote;
    }
}
