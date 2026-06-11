-- First, let's check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'vishalgkumar54@gmail.com';

-- If the user exists, assign admin role in user_roles table
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'vishalgkumar54@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also update the profiles table to have admin role
UPDATE profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'vishalgkumar54@gmail.com'
);

-- Verify the admin role assignment
SELECT 
  u.email,
  p.role as profile_role,
  ur.role as user_role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.role = 'admin'
WHERE u.email = 'vishalgkumar54@gmail.com'; 