package ro.utcn.sd.mdantonio.StackUnderflow.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UnderflowUserManagementService;
import ro.utcn.sd.mdantonio.StackUnderflow.service.UserSessionManagementService;

import java.beans.Transient;
import java.security.SecureRandom;

@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    private final UserSessionManagementService userSessionManagementService;
    private static final String SECRET = "58FB308AB15653C86AD6DCF953CA8D00";

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/test/*");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/register", "/login").permitAll()
                .anyRequest().authenticated().and()
                .httpBasic().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .cors().and()
                .csrf().disable();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userSessionManagementService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(-1, new SecureRandom(SECRET.getBytes()));
    }
}
