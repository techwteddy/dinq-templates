CREATE TABLE public.health_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    env_name VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_health_logs_env_created_at ON public.health_logs (env_name, created_at DESC);

ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.health_logs 
FOR SELECT 
USING (true);