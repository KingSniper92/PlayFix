package com.playfix.playfix.repository;

import com.playfix.playfix.model.Referencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferenciaRepository extends JpaRepository<Referencia, Long> {
}