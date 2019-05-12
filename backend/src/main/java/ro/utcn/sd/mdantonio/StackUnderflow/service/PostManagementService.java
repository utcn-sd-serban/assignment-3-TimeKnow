package ro.utcn.sd.mdantonio.StackUnderflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.PostDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.*;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidActionException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidPermissionException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectAlreadyExistsException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectNotFoundExpection;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.PostRepository;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.RepositoryFactory;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.UnderflowUserRepository;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.VoteRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.*;

@Service
@RequiredArgsConstructor
public class PostManagementService {
    private final RepositoryFactory repositoryFactory;

    @Transactional
    public List<PostDTO> listQuestions() {
        List<Post> questions = repositoryFactory.createPostRepository().findAll().stream().
                filter(x -> x.getPosttypeid() == QUESTIONID).collect(Collectors.toList());
        questions.forEach(x -> x.setScore(calculatePostScore(x)));
        List<Post> sortedQuestions = questions.stream().sorted(Comparator.comparing(Post::getCreationDate,
                Comparator.nullsLast(Comparator.reverseOrder()))).
                sorted((x, y) -> Long.compare(y.getScore(), x.getScore())).collect(Collectors.toList());
        List<PostDTO> postDTOList = new ArrayList<>();
        sortedQuestions.forEach(p -> {
            UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(p.getAuthorid()).
                    orElseThrow(ObjectNotFoundExpection::new);
            postDTOList.add(PostDTO.ofEntity(p, author, p.getParentid(), getPostTagList(p.getPostid()), getUpVotes(p), getDownVotes(p)));
        });
        return postDTOList;
    }

    @Transactional
    public List<PostDTO> listEditablePosts(int currentUserId) {
        UnderflowUser currentUser = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).
                orElseThrow(ObjectNotFoundExpection::new);

        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();
        List<Post> posts = repositoryFactory.createPostRepository().findAll().stream()
                .filter(x -> x.getAuthorid().equals(currentUser.getUserid())).collect(Collectors.toList());

        if (!currentUser.getPermission().equals(ADMIN))
            posts = posts.stream().filter(x -> x.getPosttypeid() == ANSWERID).collect(Collectors.toList());

        posts.forEach(x -> x.setScore(calculatePostScore(x)));
        List<Post> sortedQuestions = posts.stream().sorted(Comparator.comparing(Post::getCreationDate,
                Comparator.nullsLast(Comparator.reverseOrder()))).
                sorted((x, y) -> Long.compare(y.getScore(), x.getScore())).collect(Collectors.toList());
        List<PostDTO> postDTOList = new ArrayList<>();
        sortedQuestions.forEach(p -> {
            UnderflowUser author = userRepository.findById(p.getAuthorid()).
                    orElseThrow(ObjectNotFoundExpection::new);
            postDTOList.add(PostDTO.ofEntity(p, author, p.getParentid(), getPostTagList(p.getPostid()), getUpVotes(p), getDownVotes(p)));
        });
        return postDTOList;
    }

    @Transactional
    public List<PostDTO> listQuestionResponses(int questionId) throws ObjectNotFoundExpection {
        PostRepository postRepository = repositoryFactory.createPostRepository();
        postRepository.findById(questionId).orElseThrow(ObjectNotFoundExpection::new);
        List<Post> answers = postRepository.findAll().stream().filter(x -> x.getParentid() != null).
                filter(x -> x.getParentid().equals(questionId)).collect(Collectors.toList());
        answers.forEach(x -> x.setScore(calculatePostScore(x)));
        List<Post> sortedAnswers = answers.stream().sorted((x, y) -> Long.compare(y.getScore(), x.getScore())).
                collect(Collectors.toList());
        List<PostDTO> postDTOList = new ArrayList<>();
        sortedAnswers.forEach(p -> {
            UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(p.getAuthorid()).
                    orElseThrow(ObjectNotFoundExpection::new);
            postDTOList.add(PostDTO.ofEntity(p, author, p.getParentid(), getPostTagList(p.getPostid()), getUpVotes(p), getDownVotes(p)));
        });
        return postDTOList;
    }

    @Transactional
    public PostDTO addPost(int postTypeId, int authorId, Integer parentId, String title, String body, Date creationDate)
            throws ObjectNotFoundExpection {
        PostRepository postRepository = repositoryFactory.createPostRepository();

        Post parent = null;
        if (postTypeId == ANSWERID)
            parent = postRepository.findById(parentId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(authorId).orElseThrow(ObjectNotFoundExpection::new);

        Post post = postRepository.save(new Post(postTypeId, authorId, parentId, title, body, creationDate));
        return PostDTO.ofEntity(post, author, parentId, getPostTagList(post.getPostid()), getUpVotes(post), getDownVotes(post));
    }

    @Transactional
    public void votePost(int currentUserId, int postId, boolean isUpvote)
            throws ObjectNotFoundExpection, InvalidActionException, ObjectAlreadyExistsException {
        Post post = repositoryFactory.createPostRepository().findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).
                orElseThrow(ObjectNotFoundExpection::new);


        if (user.getUserid().equals(post.getAuthorid()))
            throw new InvalidActionException();

        VoteRepository voteRepository = repositoryFactory.createVoteRepository();

        boolean exists = voteRepository.findAll().stream().
                anyMatch(x -> x.getUserid().equals(currentUserId) && x.getPostid().equals(postId));
        if (exists)
            throw new ObjectAlreadyExistsException();

        voteRepository.save(new Vote(currentUserId, postId, isUpvote));
    }

    @Transactional
    public void removeVotePost(int currentUserId, int postId) throws ObjectNotFoundExpection, InvalidActionException {
        Post post = repositoryFactory.createPostRepository().findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).
                orElseThrow(ObjectNotFoundExpection::new);

        if (user.getUserid().equals(post.getAuthorid()))
            throw new InvalidActionException();
        Vote vote = repositoryFactory.createVoteRepository().findAll().stream().filter(x -> x.getPostid().equals(postId)
                && x.getUserid().equals(currentUserId)).findFirst().orElseThrow(ObjectNotFoundExpection::new);
        repositoryFactory.createVoteRepository().remove(vote);
    }

    @Transactional
    public List<PostDTO> listPostByTitle(String title) {
        List<Post> postList = repositoryFactory.createPostRepository().findAll().stream()
                .filter(x -> x.getPosttypeid().equals(QUESTIONID))
                .filter(x -> x.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
        postList.forEach(x -> x.setScore(calculatePostScore(x)));
        List<Post> sortedPosts = postList.stream().sorted((x, y) -> Long.compare(y.getScore(),
                x.getScore())).collect(Collectors.toList());
        List<PostDTO> postDTOList = new ArrayList<>();
        sortedPosts.forEach(p -> {
            UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(p.getAuthorid()).
                    orElseThrow(ObjectNotFoundExpection::new);
            postDTOList.add(PostDTO.ofEntity(p, author, p.getParentid(), getPostTagList(p.getPostid()), getUpVotes(p), getDownVotes(p)));
        });
        return postDTOList;
    }

    @Transactional
    public List<PostDTO> listPostByTag(String tagTitle) throws ObjectNotFoundExpection {

        Tag tag = repositoryFactory.createTagRepository().findAll().stream().
                filter(x -> x.getTitle().toLowerCase().equals(tagTitle.toLowerCase())).
                findFirst().orElseThrow(ObjectNotFoundExpection::new);
        List<Integer> postIdList = repositoryFactory.createPostTagRepository().findAll().
                stream().filter(x -> x.getTagid().equals(tag.getTagid())).map(PostTag::getPostid).collect(Collectors.toList());
        List<Post> postList = repositoryFactory.createPostRepository().findAll().stream().
                filter(x -> postIdList.contains(x.getPostid())).collect(Collectors.toList());
        postList.forEach(x -> x.setScore(calculatePostScore(x)));
        List<Post> sortedPosts = postList.stream().sorted((x, y) -> Long.compare(y.getScore(),
                x.getScore())).collect(Collectors.toList());
        List<PostDTO> postDTOList = new ArrayList<>();
        sortedPosts.forEach(p -> {
            UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(p.getAuthorid()).
                    orElseThrow(ObjectNotFoundExpection::new);
            postDTOList.add(PostDTO.ofEntity(p, author, p.getParentid(), getPostTagList(p.getPostid()), getUpVotes(p), getDownVotes(p)));
        });
        return postDTOList;
    }

    @Transactional
    public PostDTO updatePost(int currentUserId, int postId, String body)
            throws ObjectNotFoundExpection, InvalidPermissionException {
        PostRepository postRepository = repositoryFactory.createPostRepository();
        Post post = postRepository.findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).
                orElseThrow(ObjectNotFoundExpection::new);

        if (!user.getPermission().equals(ADMIN) && !post.getAuthorid().equals(user.getUserid()))
            throw new InvalidPermissionException();

        post.setBody(body);
        if (post.getPosttypeid().equals(QUESTIONID))
            post.setParentid(null);

        Post updatedPost = postRepository.save(post);
        UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(updatedPost.getAuthorid()).
                orElseThrow(ObjectNotFoundExpection::new);
        return PostDTO.ofEntity(updatedPost, author, updatedPost.getParentid(), getPostTagList(updatedPost.getPostid()),
                getUpVotes(updatedPost), getDownVotes(updatedPost));
    }

    @Transactional
    public void removePost(int currentUserId, int postId)
            throws ObjectNotFoundExpection, InvalidPermissionException {
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);
        PostRepository postRepository = repositoryFactory.createPostRepository();
        Post post = postRepository.findById(postId).orElseThrow(ObjectNotFoundExpection::new);

        if (!user.getPermission().equals(ADMIN) && !(post.getAuthorid().equals(user.getUserid()) && post.getPosttypeid().equals(ANSWERID)))
            throw new InvalidPermissionException();

        postRepository.remove(post);
    }

    @Transactional
    public PostDTO findPostById(int postId) {
        Post post = repositoryFactory.createPostRepository().findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        post.setScore(calculatePostScore(post));
        UnderflowUser author = repositoryFactory.createUnderflowUserRepository().findById(post.getAuthorid()).
                orElseThrow(ObjectNotFoundExpection::new);
        List<String> tagList = getPostTagList(post.getPostid());
        return PostDTO.ofEntity(post, author, post.getParentid(), tagList, getUpVotes(post), getDownVotes(post));
    }

    private List<String> getPostTagList(int postId) {
        List<PostTag> tagList = repositoryFactory.createPostTagRepository().findAll();
        List<Integer> tagListIds = tagList.stream().filter(x -> x.getPostid().
                equals(postId)).map(PostTag::getTagid).collect(Collectors.toList());
        List<String> tagTitleList = new ArrayList<>();
        for (Integer tagId : tagListIds) {
            Tag tag = repositoryFactory.createTagRepository().findById(tagId).orElseThrow(ObjectNotFoundExpection::new);
            tagTitleList.add(tag.getTitle());
        }
        return tagTitleList;
    }

    private Integer getDownVotes(Post post) {
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> votes = voteRepository.findAll().stream().filter(x -> x.getPostid().equals(post.getPostid())).
                collect(Collectors.toList());
        return Math.toIntExact(votes.stream().filter(x -> !x.isUpvote()).count());
    }

    private Integer getUpVotes(Post post) {
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> votes = voteRepository.findAll().stream().filter(x -> x.getPostid().equals(post.getPostid())).
                collect(Collectors.toList());
        return Math.toIntExact(votes.stream().filter(Vote::isUpvote).count());
    }

    private long calculatePostScore(Post post) {
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> votes = voteRepository.findAll().stream().filter(x -> x.getPostid().equals(post.getPostid())).
                collect(Collectors.toList());
        long upVotes = votes.stream().filter(Vote::isUpvote).count();
        long downVotes = votes.stream().filter(x -> !x.isUpvote()).count();
        return upVotes - downVotes;
    }
}
