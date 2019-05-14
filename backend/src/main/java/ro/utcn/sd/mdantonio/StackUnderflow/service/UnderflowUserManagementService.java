package ro.utcn.sd.mdantonio.StackUnderflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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
import ro.utcn.sd.mdantonio.StackUnderflow.event.UserBannedEvent;
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
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO login(String username, String password) throws BannedUserException, InvalidLoginException {
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().findByUsername(username)
                .orElseThrow(InvalidLoginException::new);

        if (user.isBanned())
            throw new BannedUserException();
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new InvalidLoginException();

        user.setScore(ScoreLogicService.calculateScore(repositoryFactory, user.getUserid()));

        if (!user.getPermission().equals(ADMIN))
            return UserDTO.ofMinimalInformation(UserDTO.ofEntity(user));
        else
            return UserDTO.ofEntity(user);
    }

    @Transactional
    public UserDTO addUnderflowUser(String username, String password, String email, boolean banned, String permission) {
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().save(new UnderflowUser(
                username, password, email, banned, permission));
        user.setScore(ScoreLogicService.calculateScore(repositoryFactory, user.getUserid()));
        return UserDTO.ofEntity(user);
    }

    @Transactional
    public UserDTO changeUserBannedStatus(int currentUserId, int userId, boolean banned)
            throws ObjectNotFoundExpection, InvalidPermissionException {
        UnderflowUserRepository userRepository = repositoryFactory.createUnderflowUserRepository();

        UnderflowUser currentUser = userRepository.findById(currentUserId).orElseThrow(ObjectNotFoundExpection::new);
        if (!currentUser.getPermission().equals(ADMIN))
            throw new InvalidPermissionException();

        UnderflowUser user = userRepository.findById(userId).orElseThrow(ObjectNotFoundExpection::new);
        user.setScore(ScoreLogicService.calculateScore(repositoryFactory, user.getUserid()));
        user.setBanned(banned);
        userRepository.save(user);
        eventPublisher.publishEvent(new UserBannedEvent(UserDTO.ofEntity(user)));
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
        users.forEach(x -> x.setScore(ScoreLogicService.calculateScore(repositoryFactory, x.getUserid())));
        if (!currentUser.getPermission().equals(ADMIN))
            return new ArrayList<>();
        else
            return users.stream().map(UserDTO::ofEntity).collect(Collectors.toList());
    }


}
