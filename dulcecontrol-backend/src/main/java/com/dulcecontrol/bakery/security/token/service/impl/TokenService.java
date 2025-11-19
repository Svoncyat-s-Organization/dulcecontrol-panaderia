package com.dulcecontrol.bakery.security.token.service.impl;

import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.TipoUsuario;
import com.dulcecontrol.bakery.security.token.dto.TokenListResponse;
import com.dulcecontrol.bakery.security.token.dto.TokenProfileResponse;
import com.dulcecontrol.bakery.security.token.dto.TokenRegisterRequest;
import com.dulcecontrol.bakery.security.token.entity.DesarrolladorToken;
import com.dulcecontrol.bakery.security.token.repository.DesarrolladorTokenRepository;
import com.dulcecontrol.bakery.security.token.service.ITokenService;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import com.dulcecontrol.bakery.shared.exception.BusinessException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TokenService implements ITokenService {

    private final DesarrolladorTokenRepository desarrolladorTokenRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public String register(TokenRegisterRequest request) {
        // 1. Validar que el correo no esté registrado
        if (desarrolladorTokenRepository.existsByCorreo(request.getCorreo())) {
            throw new BusinessException("El correo ya está registrado");
        }

        // 2. Validar que el nombre completo no esté registrado
        if (desarrolladorTokenRepository.existsByNombreCompleto(request.getNombreCompleto())) {
            throw new BusinessException("El nombre completo ya está registrado");
        }

        // 3. Crear nuevo desarrollador
        DesarrolladorToken desarrollador = new DesarrolladorToken();
        desarrollador.setNombreCompleto(request.getNombreCompleto());
        desarrollador.setCorreo(request.getCorreo());
        desarrollador.setHashContrasena(passwordEncoder.encode(request.getContrasena()));
        desarrollador.setActivo(true);

        desarrolladorTokenRepository.save(desarrollador);

        // 4. Generar y devolver token JWT
        return jwtProvider.generarToken(desarrollador.getCorreo(), "ROLE_DEVELOPER", TipoUsuario.DEVELOPER, null);
    }

    @Override
    @Transactional(readOnly = true)
    public String login(String correo, String contrasena) {
        // 1. Buscar desarrollador por correo (solo activos/no eliminados gracias a @SQLRestriction)
        DesarrolladorToken desarrollador = desarrolladorTokenRepository.findByCorreo(correo)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        // 2. Verificar que el desarrollador esté activo
        if (!desarrollador.getActivo()) {
            throw new AuthenticationException("Desarrollador inactivo");
        }

        // 3. Validar contraseña
        if (!passwordEncoder.matches(contrasena, desarrollador.getHashContrasena())) {
            throw new AuthenticationException("Credenciales inválidas");
        }

        // 4. Generar y devolver token JWT
        return jwtProvider.generarToken(desarrollador.getCorreo(), "ROLE_DEVELOPER", TipoUsuario.DEVELOPER, null);
    }

    @Override
    @Transactional(readOnly = true)
    public TokenProfileResponse obtenerPerfil(String correo) {
        DesarrolladorToken desarrollador = desarrolladorTokenRepository.findByCorreo(correo)
                .orElseThrow(() -> new AuthenticationException("Desarrollador no encontrado"));

        return new TokenProfileResponse(
                desarrollador.getId(),
                desarrollador.getNombreCompleto(),
                desarrollador.getCorreo(),
                desarrollador.getActivo()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TokenListResponse> listarTodos(Pageable pageable) {
        return desarrolladorTokenRepository.findAll(pageable)
                .map(dev -> new TokenListResponse(
                        dev.getId(),
                        dev.getNombreCompleto(),
                        dev.getCorreo(),
                        dev.getActivo(),
                        dev.getCreadoEn()
                ));
    }

    @Override
    @Transactional
    public void eliminarDesarrollador(Long id) {
        DesarrolladorToken desarrollador = desarrolladorTokenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desarrollador no encontrado"));
        
        // @SQLDelete se ejecuta automáticamente al llamar delete()
        desarrolladorTokenRepository.delete(desarrollador);
    }
}
