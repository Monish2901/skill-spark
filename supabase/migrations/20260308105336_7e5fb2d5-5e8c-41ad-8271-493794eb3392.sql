
CREATE TABLE public.user_selected_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id)
);

ALTER TABLE public.user_selected_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own selections"
  ON public.user_selected_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selections"
  ON public.user_selected_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selections"
  ON public.user_selected_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
