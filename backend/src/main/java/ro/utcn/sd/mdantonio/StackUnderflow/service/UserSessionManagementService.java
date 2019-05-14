package ro.utcn.sd.mdantonio.StackUnderflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.UnderflowUser;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.ObjectNotFoundExpection;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.RepositoryFactory;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserSessionManagementService implements UserDetailsService {
    private final RepositoryFactory repositoryFactory;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UnderflowUser user = repositoryFactory.createUnderflowUserRepository().
                findByUsername(username).orElseThrow(ObjectNotFoundExpection::new);
        return new User(user.getUsername(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getPermission())));
    }

    public UnderflowUser loadCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repositoryFactory.createUnderflowUserRepository().findByUsername(username).orElseThrow(ObjectNotFoundExpection::new);
    }
}
