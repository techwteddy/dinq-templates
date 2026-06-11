-- Rename "Dog poop" to "Poop"
update public.chore_schedule set chore_name = 'Poop' where chore_name = 'Dog poop';
