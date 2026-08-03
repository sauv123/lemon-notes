-- Setup Database Schema for AI Study Assistant

-- Folders Table
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Study Kits Table
CREATE TABLE public.study_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    notes TEXT NOT NULL,
    summary_data JSONB, -- stores { summary: "", concepts: [], tags: [] }
    quiz_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure the tables with Row Level Security (RLS)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_kits ENABLE ROW LEVEL SECURITY;

-- Create Policies so users can only access their own data
CREATE POLICY "Users can fully manage their own folders."
    ON public.folders FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can fully manage their own study kits."
    ON public.study_kits FOR ALL
    USING (auth.uid() = user_id);
