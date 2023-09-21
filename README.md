<img src="https://capsule-render.vercel.app/api?type=soft&color=auto&height=200&section=header&text=TeamProject&fontSize=70" />

# Team Project
Acorn 아카데미 Team Project 멍냥프로젝트
- 프로젝트 주소 : https://github.com/titlejjk/mn-project
- 일정 계획 : 2023/08/12~2023/09/06 예정
- 자원 계획 : FrontEnd 4명 BackEnd 3명

## 프로젝트 개요

---
### 목적

- 반려동물 관련 레시피 공유 
- 레시피 댓글 기능을 통한 사용자 간 정보 공유 및 소통 기능 제공
- 반려동물 기념일을 공유할 수 있는 커뮤니티 기능 제공 

### 주요 기능

- 레시피 업로드, 수정, 삭제 
- 레시피 검색 및 카테고리 별 분류 
- 관리자의 회원 관리


## 기술 스택

---
### Java 11

- 주 프로그래밍 언어로 Java 11을 선택하였습니다.

### React.js

- 사용자 인터페이스를 구성하기 위해 React.js를 사용하였습니다. 
- 컴포넌트 기반의 개발로 빠르고 유지보수가 쉬운 프론트엔드를 구축할 수 있습니다.

### Spring Boot

- 백엔드 개발 프레임워크로 Spring Boot를 사용하였습니다. 
- Spring Boot의 다양한 스타터 패키지와 보안 기능이 이 프로젝트에 유용하다고 판단하였습니다.

### MariaDB와 MyBatis

- 데이터베이스로는 MariaDB를 선택하였고, ORM으로 MyBatis를 사용하였습니다. 
- MariaDB는 MySQL과 호환성이 뛰어나면서도 더 나은 성능을 보여주기에 선택하게 되었습니다. 
- MyBatis는 직관적인 SQL 쿼리 작성이 가능하여 선택하게 되었습니다.

### Gradle

- 빌드 도구로는 Gradle을 사용하였습니다. 
- Gradle은 빠른 빌드 속도와 유연한 설정이 가능하여 이 프로젝트에 적합하다고 판단하였습니다.

### Git, GitHub

- 소스 코드 버전 관리는 Git을 사용하고, 협업은 GitHub를 통해 이루어졌습니다. 
- GitHub의 Pull Request와 Code Review 기능을 활용하여 코드 품질을 높였습니다.
- 버전관리 전략으로는 Git Flow를 이용하여 진행하였습니다.
- 모든 브랜치는 Pull Request에 리뷰를 진행한 후 merge를 진행합니다.

## Git Branch 관리 전략

---
- Main : 배포시 사용합니다.
- Develop : 개발 종료 부분에 대해서만 merge를 진행합니다.
- Feature : 기능 개발 시 사용합니다.

## 담당 업무 및 역할  

---
### [프론트엔드]
백민규
- 공지사항/레시피/축하파티 상세페이지
- MQTT

이슬아
- 프론트엔드 Git 총괄
- 메인페이지 (홈화면)
- 공지사항/레시피/축하파티 글 작성페이지
- PPT 내용정리 

정혜영
- 전체 프로젝트 디자인 담당
- 로그인 및 회원가입 
- 비밀번호 변경
- 마이페이지, 관리자 페이지 
- PPT 디자인

조새은
- 프로젝트 서기
- Jira 정리 총괄
- 공지사항/레시피/축하파티 메인페이지
- 팀 프로젝트 Git 관리 

### [백엔드]
김수정
- 레시피/축하파티 게시판
- 이미지 업로드 기능
- 댓글, 좋아요, 검색 기능
- 게시글 카테고리 분류
- 유스케이스 작성

이준규 
- 공지사항 게시판
- 파일 업로드 기능 
- 시퀀스 다이어그램 작성

조준근
- 관리자 및 회원정보 담당
- 요구사항 정의서 작성
- 아키텍처 설계
- MQTT 

## 주요 클래스 및 로직 설명

---

김수정 
- `RecipeController`: 레시피 게시글 업로드, 조회, 수정, 삭제 API 처리
- `RecipeBoardMapper`: 레시피 게시판 데이터 CRUD를 SQL 쿼리로 처리하는 MyBatis 매퍼
- `RecipeService`: 레시피 업로드, 수정, 삭제, 조회 비즈니스 로직 처리
- `LikeService`: 레시피 게시판 좋아요 토글, 개수, 순위 조회 비즈니스 로직 처리
- `ReplyService`: 레시피 게시판 댓글 업로드, 수정, 삭제, 조회 비즈니스 로직 처리

이준규
- `NoticeController`: 공지사항 생성, 조회, 수정, 삭제 및 파일 업로드, 삭제 API 처리 
- `NoticeService`: 공지사항 생성, 조회, 업데이트, 삭제 비즈니스 로직 처리 
- `FileApiController`: 파일업로드 리스트 조회 공지사항 파일다운로드 API 처리 
- `FileUtils`: 단일/다중 파일 업로드 처리, 파일 저장명 및 업로드 경로 생성, 삭제  
- `FileService`: 공지사항 파일 저장, 수정, 삭제 비즈니스 로직 처리 

조준근
- `AuthController`: 사용자 인증 관련 (회원가입, 로그인, 이메일 중복 확인) API 처리
- `UserService`: 사용자 생성, 조회, 수정, 삭제 비즈니스 로직을 처리
- `UserMapper`: 사용자 데이터 CRUD를 SQL 쿼리로 처리하는 MyBatis 매퍼
- `WebSecurityConfig`: 스프링 시큐리티 설정, CORS, CSRF, 세션 설정 등을 포함

## 테스트 

---
- JUnit을 활용한 테스트 코드 작성
- Postman 활용 


## 프로젝트 설계 문서

---
- Flowchart

![flowchart](https://github.com/titlejjk/mn-project/blob/main/resources/images/flowchart.png)
![flowchart](src/main/resources/images/flowchart.png)
![](https://velog.velcdn.com/images/katejo6011/post/a65bf09f-bdcc-4b13-9157-f19f629f9fb6/image.png)
- ERD

![erd](https://github.com/titlejjk/mn-project/blob/main/resources/images/erd.png)
![erd](src/main/resources/images/erd.png)

- Usecase

![usecase](https://github.com/titlejjk/mn-project/blob/main/resources/images/usecase.png)
![flowchart](src/main/resources/images/usecase.png)


## 화면 설계 

---

