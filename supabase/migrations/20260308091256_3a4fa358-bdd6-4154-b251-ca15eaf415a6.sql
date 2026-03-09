
-- Fix user_roles policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix assessment_attempts policies
DROP POLICY IF EXISTS "Users can view own attempts" ON public.assessment_attempts;
DROP POLICY IF EXISTS "Admins can view all attempts" ON public.assessment_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.assessment_attempts;
DROP POLICY IF EXISTS "Users can update own attempts" ON public.assessment_attempts;

CREATE POLICY "Users can view own attempts" ON public.assessment_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all attempts" ON public.assessment_attempts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own attempts" ON public.assessment_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON public.assessment_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix questions policies
DROP POLICY IF EXISTS "Questions viewable by authenticated" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

CREATE POLICY "Questions viewable by authenticated" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix engagement_reports policies
DROP POLICY IF EXISTS "Users can view own reports" ON public.engagement_reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON public.engagement_reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.engagement_reports;

CREATE POLICY "Users can view own reports" ON public.engagement_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.engagement_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON public.engagement_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix skills policy
DROP POLICY IF EXISTS "Skills are viewable by everyone" ON public.skills;
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
