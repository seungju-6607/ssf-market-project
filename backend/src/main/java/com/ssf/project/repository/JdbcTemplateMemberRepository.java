package com.ssf.project.repository;

import com.ssf.project.dto.MemberDto;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcTemplateMemberRepository implements MemberRepository {

    private final JdbcTemplate jdbcTemplate;

    // 생성자
    // @Autowired의 경우 임의로 생성한 생성자에만 붙임
    public JdbcTemplateMemberRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);   // 커넥션 생성
    };

    @Override
    public int updatePwd(MemberDto member) {
        String sql = " update ssf_user set userpwd = ? where email = ?" ;  // 보안 이슈로 prepareStatement
        Object[] param = {  member.getUserpwd(), member.getEmail() };

        try {
            int rows = jdbcTemplate.update(sql, param);
            System.out.println("rows ==> " + rows);
            return rows;
        } catch (DataAccessException e) {
            e.printStackTrace();
            return 0; // 예외 발생 시 0 반환
        }
    }

    @Override
    public int deleteByEmail(MemberDto member) {
        String sql = " update ssf_user set signout = ? where email = ?" ;  // 보안 이슈로 prepareStatement
        Object[] param = {  member.getSignout(), member.getEmail() };

        try {
            int rows = jdbcTemplate.update(sql, param);
            System.out.println("rows ==> " + rows);
            return rows;
        } catch (DataAccessException e) {
            e.printStackTrace();
            return 0; // 예외 발생 시 0 반환
        }
    }

    @Override
    public List<MemberDto> findAll() {
        String sql = "select user_key, email, username, userpwd, banned, signout, signin, snsprov, snsid, referralId, phone, role from ssf_user where signout = ? ";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(MemberDto.class), "N");
    }

    @Override
    public MemberDto findId(MemberDto member) {
        String sql = "select user_key, email, username, userpwd, banned, signout, signin, snsprov, snsid, referralId, phone, role from ssf_user where username = ? and phone = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(MemberDto.class),
                    member.getUsername(), member.getPhone());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Long findPwd(MemberDto member) {
        String sql = "select count(user_key) from ssf_user where username = ? and email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Long.class, member.getUsername(), member.getEmail());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Long countById(String id) {
        String sql = "select count(email) from ssf_user where email=?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, id);
        return count;
    }

    @Override
    public int save(MemberDto member) {
        // jdbcTemplate객체를 이용하여 DB의 member 테이블에 insert
        String sql = """
                INSERT INTO ssf_user (user_key, email, username, userpwd, banned, signout, signin, snsprov, snsid, referralId, phone, role)
                  VALUES ( UUID() , ?, ?, ?, 'N', 'N', now(), ?, ?, ?, ?, ?)
                """;  // 보안 이슈로 prepareStatement
        Object[] param = {  member.getEmail(),
                            member.getUsername(),
                            member.getUserpwd(),
                            member.getSnsprov(),
                            member.getSnsid(),
                            member.getReferralId(),
                            member.getPhone(),
                            member.getRole()
                          };

        int rows = jdbcTemplate.update(sql, param);
        System.out.println("rows ==> " + rows);
        return rows;
    }

    @Override
    public String findById(String id) {

        String sql = "select ifnull(MAX(userpwd), null) as userpwd from ssf_user where email = ?";
        MemberDto member = jdbcTemplate.queryForObject(sql,
                        new BeanPropertyRowMapper<>(MemberDto.class), id);

        return member.getUserpwd();
    }

    /**
     * Spring-Security의 AuthenticationProvider 객체에 의해 UserDetailsService 호출
     */
    @Override
    public Optional<MemberDto> findByMember(String id) {
        String sql = "select ifnull(MAX(email), null) as email, " +
                " ifnull(MAX(userpwd), null) as userpwd, " +
                " ifnull(MAX(role), null) as role " +
                " from ssf_user where email = ?";
        try {

            MemberDto member = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(MemberDto.class), id);
            return Optional.ofNullable(member);

        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    /**
     * email로 user_key 검색
     */
    public String findUserKey(String email) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT user_key FROM ssf_user WHERE email = ?",
                    String.class,
                    email
            );
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }
}
