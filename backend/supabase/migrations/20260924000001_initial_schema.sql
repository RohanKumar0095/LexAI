-- =============================================================================
-- LexAI Database Foundation Migration
-- Module: Supabase Auth + Profiles + Conversations + Messages + Search History + User Memory
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Helper function for updating timestamps
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Profiles Table (1:1 with auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles trigger for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    NEW.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 3. Conversations Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations trigger for updated_at
DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Messages Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. Search History Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID NULL REFERENCES public.conversations(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 6. User Memories Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NULL,
  content TEXT NOT NULL,
  source_conversation_id UUID NULL REFERENCES public.conversations(id) ON DELETE SET NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Memories trigger for updated_at
DROP TRIGGER IF EXISTS set_user_memories_updated_at ON public.user_memories;
CREATE TRIGGER set_user_memories_updated_at
  BEFORE UPDATE ON public.user_memories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 7. Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON public.search_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_memories_user_id ON public.user_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memories_created_at ON public.user_memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_memories_is_active ON public.user_memories(is_active);

-- -----------------------------------------------------------------------------
-- 8. Row Level Security (RLS) & Policies
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Conversations Policies
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages Policies (Linked via conversation ownership)
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE public.conversations.id = messages.conversation_id
        AND public.conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;
CREATE POLICY "Users can insert messages in own conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE public.conversations.id = messages.conversation_id
        AND public.conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON public.messages;
CREATE POLICY "Users can delete messages in own conversations"
  ON public.messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE public.conversations.id = messages.conversation_id
        AND public.conversations.user_id = auth.uid()
    )
  );

-- Search History Policies
DROP POLICY IF EXISTS "Users can view own search history" ON public.search_history;
CREATE POLICY "Users can view own search history"
  ON public.search_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own search history" ON public.search_history;
CREATE POLICY "Users can insert own search history"
  ON public.search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own search history" ON public.search_history;
CREATE POLICY "Users can delete own search history"
  ON public.search_history FOR DELETE
  USING (auth.uid() = user_id);

-- User Memories Policies
DROP POLICY IF EXISTS "Users can view own memories" ON public.user_memories;
CREATE POLICY "Users can view own memories"
  ON public.user_memories FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own memories" ON public.user_memories;
CREATE POLICY "Users can insert own memories"
  ON public.user_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own memories" ON public.user_memories;
CREATE POLICY "Users can update own memories"
  ON public.user_memories FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own memories" ON public.user_memories;
CREATE POLICY "Users can delete own memories"
  ON public.user_memories FOR DELETE
  USING (auth.uid() = user_id);
