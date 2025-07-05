-- Create work experiences table
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  key_achievements TEXT[],
  tools_used TEXT[],
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'work_experiences' AND policyname = 'Experiences are viewable by everyone'
  ) THEN
    CREATE POLICY "Experiences are viewable by everyone"
      ON public.work_experiences
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'work_experiences' AND policyname = 'Users can manage their own experiences'
  ) THEN
    CREATE POLICY "Users can manage their own experiences"
      ON public.work_experiences
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END
$$; 