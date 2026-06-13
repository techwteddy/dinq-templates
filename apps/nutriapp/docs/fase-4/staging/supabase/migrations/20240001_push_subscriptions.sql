-- supabase/migrations/20240001_push_subscriptions.sql
--
-- Tabla para almacenar las suscripciones Web Push del usuario.
-- Un usuario puede tener múltiples suscripciones (móvil, escritorio, etc.)

create table if not exists public.push_subscriptions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,

  -- Datos de la suscripción Web Push
  endpoint         text not null unique,
  expiration_time  bigint,                  -- null si no caduca
  p256dh           text not null,           -- clave pública de cifrado
  auth             text not null,           -- clave auth

  -- Metadatos opcionales
  user_agent       text,

  -- Timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Índice para consultas por usuario (envío masivo)
create index if not exists idx_push_subscriptions_user_id
  on public.push_subscriptions (user_id);

-- RLS: cada usuario sólo ve sus propias suscripciones
alter table public.push_subscriptions enable row level security;

create policy "Usuarios ven sus propias suscripciones"
  on public.push_subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Usuarios insertan sus propias suscripciones"
  on public.push_subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Usuarios actualizan sus propias suscripciones"
  on public.push_subscriptions
  for update
  using (auth.uid() = user_id);

create policy "Usuarios eliminan sus propias suscripciones"
  on public.push_subscriptions
  for delete
  using (auth.uid() = user_id);

-- Trigger: actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger push_subscriptions_updated_at
  before update on public.push_subscriptions
  for each row execute procedure public.handle_updated_at();

-- Comentarios de documentación
comment on table  public.push_subscriptions            is 'Suscripciones Web Push por usuario y dispositivo.';
comment on column public.push_subscriptions.endpoint   is 'URL única del push service (identifica el dispositivo).';
comment on column public.push_subscriptions.p256dh     is 'Clave pública para cifrado ECDH del payload.';
comment on column public.push_subscriptions.auth       is 'Secreto de autenticación del cliente.';
