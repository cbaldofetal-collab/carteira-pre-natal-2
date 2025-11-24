-- Create a storage bucket for exams
insert into storage.buckets (id, name, public)
values ('exames', 'exames', true)
on conflict (id) do nothing;

-- Set up access policies for the storage bucket
-- Allow public access to view files (SELECT)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'exames' );

-- Allow public access to upload files (INSERT)
-- In a real app, you should restrict this to authenticated users
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'exames' );
