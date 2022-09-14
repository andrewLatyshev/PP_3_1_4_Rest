package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collection;

@Repository
public class RoleDaoImpl implements RoleDao{

    @PersistenceContext
    private EntityManager entityManager;



    @Override
    public void add(Role role) {
        entityManager.persist(role);
    }

    @Override
    public Collection<Role> getAll() {
        return entityManager.createQuery("SELECT user FROM Role user", Role.class).getResultList();
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(getById(id));
    }

    @Override
    public Role getById(Long id) {
        return entityManager.find(Role.class, id);
    }
}
