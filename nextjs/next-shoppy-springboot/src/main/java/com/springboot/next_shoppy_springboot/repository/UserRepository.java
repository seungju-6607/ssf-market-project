package com.springboot.next_shoppy_springboot.repository;

import com.springboot.next_shoppy_springboot.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//interface를 구현하는 클래스를 생성하는 작업은 Spring Data JPA
// --> 서버 부팅시 컨테이너에 생성 후 로딩
@Repository
public interface UserRepository extends JpaRepository<Member, String> {
    Member save(Member member);  //회원가입, ✨✨ 생략 ⭕ :상속한 부모인터페이스에 save 메소드 존재
    Long countById(String id);  //아이디중복체크, 네이밍 규칙 적용 : 간단한 SQL 생성 후 실행결과 출력
    Optional<Member> findById(String id); //로그인 인증
}










