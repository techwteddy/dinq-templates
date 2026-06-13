-- Menyuntikkan real data dari public testing APIs ke database lokal
INSERT INTO public.health_logs (env_name, url, status, latency_ms, created_at)
VALUES 
  -- Siklus Pengecekan 1: 10 menit yang lalu (Semua Normal)
  ('DEV', 'https://jsonplaceholder.typicode.com/todos/1', 'Healthy', 45, now() - interval '10 minutes'),
  ('SIT', 'https://reqres.in/api/users/2', 'Healthy', 65, now() - interval '10 minutes'),
  ('PROD', 'https://httpbin.org/get', 'Healthy', 120, now() - interval '10 minutes'),
  
  -- Siklus Pengecekan 2: 5 menit yang lalu (DEV mulai lambat/Degraded)
  ('DEV', 'https://jsonplaceholder.typicode.com/todos/1', 'Degraded', 2150, now() - interval '5 minutes'),
  ('SIT', 'https://reqres.in/api/users/2', 'Healthy', 58, now() - interval '5 minutes'),
  ('PROD', 'https://httpbin.org/get', 'Healthy', 115, now() - interval '5 minutes'),
  
  -- Siklus Pengecekan 3: Waktu sekarang (DEV Down/Timeout)
  ('DEV', 'https://jsonplaceholder.typicode.com/todos/1', 'Down', 5000, now()),
  ('SIT', 'https://reqres.in/api/users/2', 'Healthy', 62, now()),
  ('PROD', 'https://httpbin.org/get', 'Healthy', 118, now());