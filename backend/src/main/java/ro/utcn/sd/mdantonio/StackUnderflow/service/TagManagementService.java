package ro.utcn.sd.mdantonio.StackUnderflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.TagDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Post;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.PostTag;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Tag;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.UnderflowUser;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidActionException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidPermissionException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectAlreadyExistsException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectNotFoundExpection;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.RepositoryFactory;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.TagRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.ADMIN;
import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.QUESTIONID;

@Service
@RequiredArgsConstructor
public class TagManagementService {
    private final RepositoryFactory repositoryFactory;

    @Transactional
    public List<TagDTO> listAllTags() {
        return repositoryFactory.createTagRepository().findAll().
                stream().map(TagDTO::ofEntity).collect(Collectors.toList());
    }

    @Transactional
    public TagDTO findTagById(int tagId) {
        return TagDTO.ofEntity(repositoryFactory.createTagRepository().
                findById(tagId).orElseThrow(ObjectNotFoundExpection::new));
    }

    @Transactional
    public TagDTO createTag(String title) throws ObjectAlreadyExistsException {
        TagRepository tagRepository = repositoryFactory.createTagRepository();
        if (tagRepository.findAll().stream().anyMatch(x -> x.getTitle().equals(title)))
            throw new ObjectAlreadyExistsException();
        return TagDTO.ofEntity(tagRepository.save((new Tag(title))));
    }


    @Transactional
    public void deleteTag(int currentUserId, int tagId)
            throws ObjectNotFoundExpection, InvalidPermissionException {
        UnderflowUser currentUser = repositoryFactory.createUnderflowUserRepository().
                findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);

        if (!currentUser.getPermission().equals("ADMIN"))
            throw new InvalidPermissionException();

        TagRepository tagRepository = repositoryFactory.createTagRepository();
        Tag tag = tagRepository.findById(tagId).orElseThrow(ObjectNotFoundExpection::new);
        tagRepository.remove(tag);
    }

    @Transactional
    public void attachTagToPost(int currentUserId, String tagName, int postId)
            throws ObjectNotFoundExpection, InvalidPermissionException, InvalidActionException {
        Post post = repositoryFactory.createPostRepository().findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);
        Optional<Tag> tagOptional = getTagByTitle(tagName);
        Tag tag = tagOptional.orElseGet(() -> repositoryFactory.createTagRepository().save(new Tag(tagName)));

        if (!post.getPosttypeid().equals(QUESTIONID))
            throw new InvalidActionException();

        if (!post.getAuthorid().equals(user.getUserid()) && !user.getPermission().equals(ADMIN))
            throw new InvalidPermissionException();

        if (repositoryFactory.createPostTagRepository().findAll().stream()
                .anyMatch(x -> x.getPostid().equals(postId) && x.getTagid().equals(tag.getTagid())))
            return;

        repositoryFactory.createPostTagRepository().save(new PostTag(postId, tag.getTagid()));
    }

    @Transactional
    public List<TagDTO> findTagsForPost(int postId) {
        List<Integer> postTagList = repositoryFactory.createPostTagRepository().findAll()
                .stream().filter(x -> x.getPostid() == postId).map(PostTag::getTagid).collect(Collectors.toList());

        return repositoryFactory.createTagRepository().findAll().stream().
                filter(x -> postTagList.contains(x.getTagid())).map(TagDTO::ofEntity).collect(Collectors.toList());
    }

    @Transactional
    public void removeTagFromPost(int currentUserId, int tagId, int postId)
            throws ObjectNotFoundExpection, InvalidPermissionException {

        Post post = repositoryFactory.createPostRepository().findById(postId).orElseThrow(ObjectNotFoundExpection::new);
        UnderflowUser currentUser = repositoryFactory.createUnderflowUserRepository().
                findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);

        if (!post.getAuthorid().equals(currentUserId) && !currentUser.getPermission().equals("ADMIN"))
            throw new InvalidPermissionException();

        repositoryFactory.createPostTagRepository().remove(new PostTag(postId, tagId));
    }

    @Transactional
    public List<TagDTO> filterTagsByTitle(String title) {
        return repositoryFactory.createTagRepository().findAll().stream().filter(x -> x.getTitle().toLowerCase().
                contains(title.toLowerCase())).map(TagDTO::ofEntity).collect(Collectors.toList());
    }

    private Optional<Tag> getTagByTitle(String title) {
        return repositoryFactory.createTagRepository().findAll().stream().filter(x -> x.getTitle().
                equals(title)).findFirst();
    }
}
