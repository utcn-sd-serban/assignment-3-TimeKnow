package ro.utcn.sd.mdantonio.StackUnderflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.UserDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Post;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.UnderflowUser;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Vote;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.BannedUserException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidLoginException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.InvalidPermissionException;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectNotFoundExpection;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.PostRepository;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.RepositoryFactory;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.UnderflowUserRepository;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.VoteRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.*;


@Service
@RequiredArgsConstructor
public class UnderflowUserManagementService {
    private final RepositoryFactory repositoryFactory;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO login(String username, String password) throws BannedUserException, InvalidLoginException {
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findByUsername(username)
                .orElseThrow(ObjectNotFoundExpection::new);

        if (user.isBanned())
            throw new BannedUserException();
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new InvalidLoginException();
        if (!user.getPermission().equals(ADMIN))
            return UserDTO.ofMinimalInformation(UserDTO.ofEntity(user));
        else
            return UserDTO.ofEntity(user);
    }

    @Transactional
    public UserDTO addUnderflowUser(String username, String password, String email, boolean banned, String permission) {

        return UserDTO.ofEntity(repositoryFactory.createUnderflowUserRepository().save(new UnderflowUser(
                username, password, email, banned, permission)));
    }

    @Transactional
    public UserDTO changeUserBannedStatus(int currentUserId, int userId, boolean banned)
            throws ObjectNotFoundExpection, InvalidPermissionException {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();

        UnderflowUser currentUser = userRepository.findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);
        if (!currentUser.getPermission().equals(ADMIN))
            throw new InvalidPermissionException();

        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        user.setBanned(banned);
        userRepository.save(user);
        return UserDTO.ofEntity(user);
    }

    @Transactional
    public void changeUserPassword(int userId, String password) {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();
        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        user.setPassword(password);
        userRepository.save(user);
    }

    @Transactional
    public void changeUserPermission(int userId, String permission) {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();
        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        user.setPermission(permission);
        userRepository.save(user);
    }

    @Transactional
    public void changeUserEmail(int userId, String email) {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();
        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        user.setPermission(email);
        userRepository.save(user);
    }

    @Transactional
    public void removeUser(int currentUserId, int userId) throws InvalidPermissionException, ObjectNotFoundExpection {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();

        UnderflowUser currentUser = userRepository.findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);
        if (!currentUser.getPermission().equals(ADMIN))
            throw new InvalidPermissionException();

        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        userRepository.remove(user);
    }

    @Transactional
    public List<UserDTO> findAll(int currentUserId) {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();
        UnderflowUser currentUser = userRepository.findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);

        List<UnderflowUser> users = userRepository.findAll();
        users.forEach(x -> x.setScore(calculateScore(x.getUserid())));
        if (!currentUser.getPermission().equals(ADMIN))
            return new ArrayList<>();
        else
            return users.stream().map(UserDTO::ofEntity).collect(Collectors.toList());
    }

    private long calculateScore(int userId) {
        //I am not proud of this but is short
        PostRepository postRepository = repositoryFactory.createPostRepository();
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> allVotes = voteRepository.findAll();
        long userDownVotes = allVotes.stream().filter(x -> x.getUserid().equals(userId)).filter(x -> !x.isUpvote()).count();
        List<Post> postList = postRepository.findAll().stream().filter(x -> x.getAuthorid().
                equals(userId)).collect(Collectors.toList());

        //TODO: When I have time a more 'civilized' implementation will be made
        long postScore = postList.stream().map(post -> {
            Optional<Vote> postVote = allVotes.stream().filter(y -> y.getPostid().equals(post.getPostid())).findFirst();
            return postVote.map(vote -> scoreLogic(post, vote)).orElse((long) 0);
        }).mapToLong(x -> ((Number) x).longValue()).sum();

        return postScore - userDownVotes;
    }

    private long scoreLogic(Post post, Vote vote) {
        if (post.getPosttypeid().equals(QUESTIONID))
            return vote.isUpvote() ? 5 : -2;
        if (post.getPosttypeid().equals(ANSWERID))
            return vote.isUpvote() ? 10 : -2;
        return 0;
    }
}
