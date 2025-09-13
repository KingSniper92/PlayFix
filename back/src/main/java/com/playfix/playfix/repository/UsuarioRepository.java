package com.playfix.playfix.repository;

import com.playfix.playfix.model.Usuario;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ====== LOGIN (lo que ya usabas) ======
    public Usuario findByCorreoAndClave(String correo, String clave) {
        String sql = "SELECT id_usuario, nombre_usuario, correo_usuario, clave_usuario, id_rol " +
                "FROM usuarios WHERE correo_usuario = ? AND clave_usuario = ?";
        List<Usuario> usuarios = jdbcTemplate.query(sql, new Object[]{correo, clave}, new UsuarioRowMapper());
        return usuarios.isEmpty() ? null : usuarios.get(0);
    }

    // ====== CRUD ======
    public List<Usuario> findAll() {
        String sql = "SELECT id_usuario, nombre_usuario, correo_usuario, clave_usuario, id_rol FROM usuarios ORDER BY id_usuario";
        return jdbcTemplate.query(sql, new UsuarioRowMapper());
    }

    public Usuario findById(int id) {
        String sql = "SELECT id_usuario, nombre_usuario, correo_usuario, clave_usuario, id_rol FROM usuarios WHERE id_usuario = ?";
        List<Usuario> list = jdbcTemplate.query(sql, new Object[]{id}, new UsuarioRowMapper());
        return list.isEmpty() ? null : list.get(0);
    }

    public Usuario insert(Usuario u) {
        String sql = "INSERT INTO usuarios (nombre_usuario, correo_usuario, clave_usuario, id_rol) VALUES (?, ?, ?, ?)";
        KeyHolder kh = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id_usuario"});
            ps.setString(1, u.getNombreUsuario());
            ps.setString(2, u.getCorreoUsuario());
            ps.setString(3, u.getClaveUsuario());
            ps.setInt(4, u.getIdRol());
            return ps;
        }, kh);
        Number key = kh.getKey();
        if (key != null) {
            u.setIdUsuario(key.intValue());
        }
        return u;
    }

    public boolean update(int id, Usuario u) {
        String sql = "UPDATE usuarios SET nombre_usuario = ?, correo_usuario = ?, clave_usuario = ?, id_rol = ? WHERE id_usuario = ?";
        int rows = jdbcTemplate.update(sql,
                u.getNombreUsuario(),
                u.getCorreoUsuario(),
                u.getClaveUsuario(),
                u.getIdRol(),
                id
        );
        return rows > 0;
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM usuarios WHERE id_usuario = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }

    // ====== Mapper ======
    private static class UsuarioRowMapper implements RowMapper<Usuario> {
        @Override
        public Usuario mapRow(ResultSet rs, int rowNum) throws SQLException {
            Usuario u = new Usuario();
            u.setIdUsuario(rs.getInt("id_usuario"));
            u.setNombreUsuario(rs.getString("nombre_usuario"));   // << NUEVO
            u.setCorreoUsuario(rs.getString("correo_usuario"));
            u.setClaveUsuario(rs.getString("clave_usuario"));
            u.setIdRol(rs.getInt("id_rol"));
            return u;
        }
    }
}