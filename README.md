<img src="https://capsule-render.vercel.app/api?type=soft&color=auto&height=200&section=header&text=TeamProject&fontSize=70" />

# TeamProject
Acorn 아카데미 Team Project 멍냥프로젝트
- 프로젝트 주소 : https://github.com/titlejjk/mn-project
- 일정 계획 : 2023/08/12~2023/09/06 예정
- 자원 계획 : FrontEnd 4명 BackEnd 3명

## 프로젝트 개요

### 목적

이 프로젝트는 반려동물과 관련된 레시피를 공유하는 커뮤니티 플랫폼을 제공하는 것을 목적으로 합니다.

### 주요 기능

- 레시피 업로드, 수정, 삭제 
- 레시피 검색 및 카테고리 별 분류 
- 관리자의 회원 관리

### 동기
학원에서 시켰습니다.

## 기술 스택

### Java 11

- 주 프로그래밍 언어로 Java 11을 선택하였습니다.

### React.js

- 사용자 인터페이스를 구성하기 위해 React.js를 사용하였습니다. 컴포넌트 기반의 개발로 빠르고 유지보수가 쉬운 프론트엔드를 구축할 수 있습니다.

### Spring Boot

- 백엔드 개발 프레임워크로 Spring Boot를 사용하였습니다. Spring Boot의 다양한 스타터 패키지와 보안 기능이 이 프로젝트에 유용하다고 판단하였습니다.

### MariaDB와 MyBatis

- 데이터베이스로는 MariaDB를 선택하였고, ORM으로 MyBatis를 사용하였습니다. MariaDB는 MySQL과 호환성이 뛰어나면서도 더 나은 성능을 보여주므로 선택하게 되었습니다. MyBatis는 직관적인 SQL 쿼리 작성이 가능하여 선택하게 되었습니다.

### Gradle

- 빌드 도구로는 Gradle을 사용하였습니다. Gradle은 빠른 빌드 속도와 유연한 설정이 가능하여 이 프로젝트에 적합하다고 판단하였습니다.

### Git, GitHub

- 소스 코드 버전 관리는 Git을 사용하고, 협업은 GitHub를 통해 이루어졌습니다. 
- GitHub의 Pull Request와 Code Review 기능을 활용하여 코드 품질을 높였습니다.
- 또한 버전관리 전략으로는 Git Flow를 이용하여 진행하였습니다.


## 주요 클래스와 로직 설명


### Git Branch 관리 전략 

Git Flow를 사용하여 브랜치를 관리하였습니다.
모든 브랜치는 Pull Request에 리뷰를 진행한 후 merge를 진행합니다. 
- Main : 배포시 사용합니다. 
- Develop : 개발 종료 부분에 대해서만 merge를 진행합니다. 
- Feature : 기능 개발 시 사용합니다. 

### 테스트 
- JUnit을 활용한 테스트 코드 작성
- Postman 활용 

## 화면 설계 

### 홈 화면

### 레시피 게시판 

### 축하파티 게시판 

### 공지사항 

##


