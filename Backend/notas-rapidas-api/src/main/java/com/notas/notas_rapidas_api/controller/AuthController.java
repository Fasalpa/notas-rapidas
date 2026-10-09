package com.notas.notas_rapidas_api.controller;

import com.notas.notas_rapidas_api.dto.AuthRequest;
import com.notas.notas_rapidas_api.dto.AuthResponse;
import com.notas.notas_rapidas_api.model.User;
import com.notas.notas_rapidas_api.repository.UserRepository;
import com.notas.notas_rapidas_api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://fasalpa.github.io")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint de registro
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El email ya existe");
        }

        User user = new User(
                authRequest.getEmail(),
                passwordEncoder.encode(authRequest.getPassword()),
                authRequest.getName()
        );

        // Guardar el nuevo usuario en Supabase
        userRepository.save(user);

        // Generar token para el usuario registrado
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail()));
    }

    // Endpoint de inicio de sesión
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
        try {
            // Verificar credenciales (email y contraseña)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
        }

        // Si son correctas, generar y retornar el token JWT
        String token = jwtUtil.generateToken(authRequest.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, authRequest.getEmail()));
    }
}