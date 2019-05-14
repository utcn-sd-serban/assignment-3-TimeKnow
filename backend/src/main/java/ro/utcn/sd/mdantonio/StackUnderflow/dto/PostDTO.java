package ro.utcn.sd.mdantonio.StackUnderflow.dto;

import lombok.Data;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Post;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.UnderflowUser;

import java.util.Date;
import java.util.List;

@Data
public class PostDTO {
    private Integer id;
    private UserDTO author;
    private Integer parent;
    private List<String> tags;
    private String type;
    private String body;
    private String title;
    private Date date;
    private Integer upvotes;
    private Integer downvotes;

    public PostDTO() {
    }

    public PostDTO(Integer id, UserDTO author, Integer parent, List<String> tags, String type, String body,
                   String title, Date date, Integer upvotes, Integer downvotes) {
        this.id = id;
        this.author = author;
        this.parent = parent;
        this.tags = tags;
        this.type = type;
        this.body = body;
        this.title = title;
        this.date = date;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }

    public static String convertIntPostTypeToStringPostType(Integer postType) {
        return postType.equals(StackUnderflowConstants.QUESTIONID) ?
                StackUnderflowConstants.QUESTION : StackUnderflowConstants.ANSWER;
    }

    public static Integer convertStringPostTypeToIntPostType(String postType) {
        return postType.equals(StackUnderflowConstants.QUESTION) ?
                StackUnderflowConstants.QUESTIONID : StackUnderflowConstants.ANSWERID;
    }

    public static PostDTO ofEntity(Post post, UnderflowUser author, Integer parent, List<String> tags,
                                   Integer upvotes, Integer downvotes) {
        String type = convertIntPostTypeToStringPostType(post.getPosttypeid());
        UserDTO authorDTO = UserDTO.ofMinimalInformation(UserDTO.ofEntity(author));
        return new PostDTO(post.getPostid(), authorDTO, parent, tags, type, post.getBody(),
                post.getTitle(), post.getCreationDate(), upvotes, downvotes);
    }
}
