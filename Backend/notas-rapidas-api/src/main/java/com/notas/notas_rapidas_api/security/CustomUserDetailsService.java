package com.notas.notas_rapidas_api.security;

import com.notas.notas_rapidas_api.model.User;
import com.notas.notas_rapidas_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + email));

        //retornamos un objeto UserDetails de Spring Security con el email y la contraseña encriptada
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                // Lista de roles/permisos (vacía por ahora)
                new ArrayList<>()
        );
    }
}