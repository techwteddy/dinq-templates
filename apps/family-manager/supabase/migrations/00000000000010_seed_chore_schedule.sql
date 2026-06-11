-- Replace chore_schedule with the weekly chore schedule (customize with your kids' names)
delete from public.chore_schedule;

insert into public.chore_schedule (kid_name, chore_name, day_of_week) values
  -- Sunday (0)
  ('Kid1', 'Feed pets',    0),
  ('Kid2', 'Kitchen',      0),
  ('Kid2', 'Trash',        0),
  ('Kid3', 'Sweep',        0),

  -- Monday (1)
  ('Kid1', 'Trash (curb)', 1),
  ('Kid1', 'Sweep',        1),
  ('Kid2', 'Feed pets',    1),
  ('Kid3', 'Kitchen',      1),

  -- Tuesday (2)
  ('Kid1', 'Feed pets',    2),
  ('Kid2', 'Kitchen',      2),
  ('Kid3', 'Trash',        2),
  ('Kid3', 'Sweep',        2),

  -- Wednesday (3)
  ('Kid1', 'Kitchen',      3),
  ('Kid1', 'Sweep',        3),
  ('Kid2', 'Trash (curb)', 3),
  ('Kid3', 'Feed pets',    3),

  -- Thursday (4)
  ('Kid1', 'Trash',        4),
  ('Kid2', 'Sweep',        4),
  ('Kid3', 'Kitchen',      4),
  ('Kid3', 'Feed pets',    4),

  -- Friday (5)
  ('Kid1', 'Kitchen',      5),
  ('Kid2', 'Sweep',        5),
  ('Kid2', 'Feed pets',    5),
  ('Kid3', 'Trash',        5),

  -- Saturday (6)
  ('Kid1', 'Kitchen',      6),
  ('Kid1', 'Feed pets',    6),
  ('Kid2', 'Sweep',        6),
  ('Kid3', 'Trash (curb)', 6);
