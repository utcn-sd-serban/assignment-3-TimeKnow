package ro.utcn.sd.mdantonio.StackUnderflow.dto;

import lombok.Data;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Tag;

@Data
public class TagDTO {
    private Integer id;
    private String title;

    public TagDTO(Integer id, String title) {
        this.id = id;
        this.title = title;
    }

    public static TagDTO ofEntity(Tag tag){
        return new TagDTO(tag.getTagid(), tag.getTitle());
    }
}
