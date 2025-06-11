package com.example.be_job_hunt.security;

import com.example.be_job_hunt.entity.UserEntity;
import com.example.be_job_hunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity=new UserEntity();
        if(userRepository.findByUserName(username)==null){
            throw new UsernameNotFoundException("User not found");
        }else {
            userEntity = userRepository.findByUserName(username).get();
            List<GrantedAuthority> authorities = userEntity.getUserRoles().stream()
                    .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getName()))
                    .collect(Collectors.toList());

            return new org.springframework.security.core.userdetails.User(
                    userEntity.getUserName(),
                    userEntity.getPassword(),
                    authorities
            );
        }
    }
}
