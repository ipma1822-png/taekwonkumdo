WTKF 회원가입 패치 v1

업로드할 파일/폴더
1) index.html                       - 메인 회원가입 버튼 추가
2) assets/js/app.js                - 모든 페이지 신청·문의 드롭다운에 회원가입 링크 자동 추가
3) member/index.html               - 실제 회원가입 신청서
4) admin/wtkf-members.html         - 관리자 회원신청 관리
5) admin/SUPABASE-WTKF-ADMIN-PHOTO-SETUP.sql - 관리자 사진 조회용 SQL (GitHub 업로드 필수 아님)

Supabase 준비사항
- public.wtkf_member_applications Data API ON
- 신청 INSERT RLS: anon + authenticated
- 관리자 SELECT/UPDATE RLS
- Storage bucket: wtkf-member-photos
- Storage INSERT: anon + authenticated
- 관리자 사진 확인을 위해 SQL Editor에서 SUPABASE-WTKF-ADMIN-PHOTO-SETUP.sql 한 번 실행

회원가입 주소: /member/
관리자 주소: /admin/wtkf-members.html
