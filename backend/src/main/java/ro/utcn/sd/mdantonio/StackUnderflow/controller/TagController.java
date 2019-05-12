package ro.utcn.sd.mdantonio.StackUnderflow.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.TagDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.service.PostManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.TagManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UnderflowUserManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UserSessionManagementService;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TagController {
    private final TagManagementService tagManagementService;
    private final PostManagementService postManagementService;
    private final UnderflowUserManagementService underflowUserManagementService;
    private final UserSessionManagementService userSessionManagementService;

    @GetMapping("/tags")
    public List<TagDTO> readTags() {
        return tagManagementService.listAllTags();
    }

    @PostMapping("/tags")
    public TagDTO createTag(@RequestBody TagDTO dto) {
        return tagManagementService.createTag(dto.getTitle());
    }

    @DeleteMapping("/tags")
    public void deleteTag(@RequestBody TagDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        tagManagementService.deleteTag(currentUserId, dto.getId());
    }

    @GetMapping("/tags/post/{postId}")
    public List<TagDTO> getTagsByPostId(@PathVariable("postId") Integer postId) {
        return tagManagementService.findTagsForPost(postId);
    }

    @GetMapping("/tags/filter/{title}")
    public List<TagDTO> filterTagsByTitle(@PathVariable("title") String title) {
        return tagManagementService.filterTagsByTitle(title);
    }

    @PostMapping("/tags/post/{postId}")
    public PostDTO attachTagsForPost(@PathVariable("postId") Integer postId, @RequestBody List<TagDTO> dtoList) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        for (TagDTO dto : dtoList) {
            tagManagementService.attachTagToPost(currentUserId, dto.getTitle(), postId);
        }
        return postManagementService.findPostById(postId);
    }


    @GetMapping("/tags/{tagId}")
    public TagDTO getTagById(@PathVariable("tagId") Integer tagId) {
        return tagManagementService.findTagById(tagId);
    }
}
