package ro.utcn.sd.mdantonio.StackUnderflow.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.VoteDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.event.BaseEvent;
import ro.utcn.sd.mdantonio.StackUnderflow.service.PostManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.TagManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UserSessionManagementService;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PostController {
    private final PostManagementService postManagementService;
    private final TagManagementService tagManagementService;
    private final UserSessionManagementService userSessionManagementService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/posts")
    public List<PostDTO> readAllQuestions() {
        return postManagementService.listQuestions();
    }


    @PostMapping("/posts")
    public PostDTO createPost(@RequestBody PostDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        int postType = PostDTO.convertStringPostTypeToIntPostType(dto.getType());
        PostDTO response = postManagementService.addPost(postType, dto.getAuthor().getId(), dto.getParent(), dto.getTitle(), dto.getBody(), dto.getDate());
        dto.getTags().forEach(tagId -> tagManagementService.attachTagToPost(currentUserId, tagId, response.getId()));
        return postManagementService.findPostById(response.getId());
    }


    @PutMapping("/posts")
    public PostDTO updatePost(@RequestBody PostDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        return postManagementService.updatePost(currentUserId, dto.getId(), dto.getBody());
    }

    @DeleteMapping("/posts")
    public void deletePost(@RequestBody PostDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        postManagementService.removePost(currentUserId, dto.getId());
    }

    @GetMapping("/posts/title/{name}")
    public List<PostDTO> readQuestionsByTitle(@PathVariable("name") String name) {
        return postManagementService.listPostByTitle(name);
    }

    @GetMapping("/posts/tag/{tagTitle}")
    public List<PostDTO> readQuestionsByTag(@PathVariable("tagTitle") String tagTitle) {
        return postManagementService.listPostByTag(tagTitle);
    }

    @GetMapping("/posts/{postId}")
    public PostDTO readPost(@PathVariable("postId") Integer postId) {
        return postManagementService.findPostById(postId);
    }

    @GetMapping("/posts/editable")
    public List<PostDTO> readAllEditablePosts() {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        return postManagementService.listEditablePosts(currentUserId);
    }

    @GetMapping("/posts/{postId}/answers")
    public List<PostDTO> readAllAnswers(@PathVariable("postId") Integer postId) {
        return postManagementService.listQuestionResponses(postId);
    }

    @PostMapping("/posts/vote")
    public PostDTO votePost(@RequestBody VoteDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        postManagementService.votePost(currentUserId, dto.getPostId(), dto.isUpVote());
        return postManagementService.findPostById(dto.getPostId());
    }

    @DeleteMapping("/posts/vote")
    public PostDTO removeVotePost(@RequestBody VoteDTO dto) {
        int currentUserId = userSessionManagementService.loadCurrentUser().getUserid();
        postManagementService.removePost(currentUserId, dto.getPostId());
        return postManagementService.findPostById(dto.getPostId());
    }

    @EventListener(BaseEvent.class)
    public void handleEvent(BaseEvent event) {
        log.info("Got an event: {}.", event);
        messagingTemplate.convertAndSend("/topic/events", event);
    }
}
