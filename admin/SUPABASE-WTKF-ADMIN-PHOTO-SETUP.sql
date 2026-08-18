-- WTKF 관리자 사진 조회 정책
-- 이미 존재해도 다시 실행할 수 있도록 같은 이름의 정책을 먼저 삭제합니다.
drop policy if exists "WTKF admin read member photos" on storage.objects;

create policy "WTKF admin read member photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'wtkf-member-photos'
  and (auth.jwt() ->> 'email') = 'jeonseongkweon@gmail.com'
);
