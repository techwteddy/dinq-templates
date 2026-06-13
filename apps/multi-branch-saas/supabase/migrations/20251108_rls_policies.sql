-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own user record
CREATE POLICY "Users can read own user record"
ON users FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Service role can do everything (for server-side operations)
CREATE POLICY "Service role can manage users"
ON users FOR ALL
TO service_role
USING (true);

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Users with proper permissions can read profiles in their branch hierarchy
CREATE POLICY "Users can read profiles in branch hierarchy"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()::text
    AND (
      -- User is in HQ (can see all)
      p.branch_id IN (SELECT id FROM branches WHERE type = 'HEADQUARTERS')
      OR
      -- Profile is in same branch
      profiles.branch_id = p.branch_id
      OR
      -- Profile is in child branch
      profiles.branch_id IN (
        WITH RECURSIVE branch_tree AS (
          SELECT id, parent_id FROM branches WHERE id = p.branch_id
          UNION ALL
          SELECT b.id, b.parent_id FROM branches b
          INNER JOIN branch_tree bt ON b.parent_id = bt.id
        )
        SELECT id FROM branch_tree
      )
    )
  )
);

-- Service role can manage all profiles
CREATE POLICY "Service role can manage profiles"
ON profiles FOR ALL
TO service_role
USING (true);

-- ============================================
-- BRANCHES TABLE POLICIES
-- ============================================

-- All authenticated users can read branches
CREATE POLICY "Authenticated users can read branches"
ON branches FOR SELECT
TO authenticated
USING (true);

-- Service role can manage branches
CREATE POLICY "Service role can manage branches"
ON branches FOR ALL
TO service_role
USING (true);

-- ============================================
-- ROLES TABLE POLICIES
-- ============================================

-- All authenticated users can read roles
CREATE POLICY "Authenticated users can read roles"
ON roles FOR SELECT
TO authenticated
USING (true);

-- Service role can manage roles
CREATE POLICY "Service role can manage roles"
ON roles FOR ALL
TO service_role
USING (true);

-- ============================================
-- PERMISSIONS TABLE POLICIES
-- ============================================

-- All authenticated users can read permissions
CREATE POLICY "Authenticated users can read permissions"
ON permissions FOR SELECT
TO authenticated
USING (true);

-- Service role can manage permissions
CREATE POLICY "Service role can manage permissions"
ON permissions FOR ALL
TO service_role
USING (true);

-- ============================================
-- USER_ROLES TABLE POLICIES
-- ============================================

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
ON user_roles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = user_roles.profile_id
    AND profiles.user_id = auth.uid()::text
  )
);

-- Service role can manage user roles
CREATE POLICY "Service role can manage user_roles"
ON user_roles FOR ALL
TO service_role
USING (true);

-- ============================================
-- ROLE_PERMISSIONS TABLE POLICIES
-- ============================================

-- All authenticated users can read role permissions
CREATE POLICY "Authenticated users can read role_permissions"
ON role_permissions FOR SELECT
TO authenticated
USING (true);

-- Service role can manage role permissions
CREATE POLICY "Service role can manage role_permissions"
ON role_permissions FOR ALL
TO service_role
USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user's role level
CREATE OR REPLACE FUNCTION get_user_role_level(user_uuid TEXT)
RETURNS INT AS $$
  SELECT MIN(r.level)
  FROM profiles p
  JOIN user_roles ur ON ur.profile_id = p.id
  JOIN roles r ON r.id = ur.role_id
  WHERE p.user_id = user_uuid
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  user_uuid TEXT,
  resource_name TEXT,
  action_name TEXT,
  scope_name TEXT
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN user_roles ur ON ur.profile_id = p.id
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions perm ON perm.id = rp.permission_id
    WHERE p.user_id = user_uuid
    AND perm.resource = resource_name
    AND perm.action = action_name
    AND perm.scope::text = scope_name
  )
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get user's branch hierarchy
CREATE OR REPLACE FUNCTION get_user_branch_ids(user_uuid TEXT)
RETURNS TABLE(branch_id TEXT) AS $$
  WITH RECURSIVE branch_tree AS (
    SELECT b.id, b.parent_id
    FROM branches b
    JOIN profiles p ON p.branch_id = b.id
    WHERE p.user_id = user_uuid

    UNION ALL

    SELECT b.id, b.parent_id
    FROM branches b
    INNER JOIN branch_tree bt ON b.parent_id = bt.id
  )
  SELECT id AS branch_id FROM branch_tree
$$ LANGUAGE SQL SECURITY DEFINER;
