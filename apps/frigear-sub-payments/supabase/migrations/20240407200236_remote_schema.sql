create extension if not exists "wrappers" with schema "extensions";


alter type "public"."pricing_plan_interval" rename to "pricing_plan_interval__old_version_to_be_dropped";

create type "public"."pricing_plan_interval" as enum ('day', 'week', 'month', 'quarter', 'year', 'life');

alter table "public"."prices" alter column interval type "public"."pricing_plan_interval" using interval::text::"public"."pricing_plan_interval";

drop type "public"."pricing_plan_interval__old_version_to_be_dropped";


