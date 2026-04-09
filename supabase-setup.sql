-- =============================================
-- SKCT 앱 Supabase 설정 SQL
-- Supabase 대시보드 > SQL Editor에서 실행
-- =============================================

-- 1. pdf_uploads 테이블 생성
CREATE TABLE pdf_uploads (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  page_count   INTEGER NOT NULL,
  file_size    BIGINT NOT NULL,
  is_paid      BOOLEAN DEFAULT false,
  payment_key  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS(Row Level Security) 활성화
ALTER TABLE pdf_uploads ENABLE ROW LEVEL SECURITY;

-- 3. 사용자는 자신의 레코드만 조회/삽입/수정 가능
CREATE POLICY "Users manage their own uploads"
ON pdf_uploads
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Storage 버킷 설정 (대시보드에서 직접 설정)
-- =============================================
-- 1. Storage > New bucket
--    이름: pdf-files
--    Public: OFF (비공개)
--    파일 크기 제한: 52428800 (50MB)
--    허용 MIME: application/pdf

-- 2. Storage Policies (아래 SQL 실행)
CREATE POLICY "Users upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pdf-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
