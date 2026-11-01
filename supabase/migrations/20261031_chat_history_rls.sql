-- ==============================================================================
-- LexAI India: Permanent Chat History & Row Level Security (RLS) Migration
-- Target Tables: conversations, messages
-- Enables RLS and guarantees strict user isolation per authenticated Supabase UID.
-- ==============================================================================

-- 1. Ensure Table Structure for conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Legal Inquiry',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on user_id and updated_at for fast conversation list retrieval
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated 
    ON public.conversations(user_id, updated_at DESC);

-- 2. Ensure Table Structure for messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on conversation_id and created_at for fast chronological loading
CREATE INDEX IF NOT EXISTS idx_messages_conv_created 
    ON public.messages(conversation_id, created_at ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Conversations Policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.conversations;
CREATE POLICY "Users can insert their own conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
CREATE POLICY "Users can update their own conversations"
    ON public.conversations FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;
CREATE POLICY "Users can delete their own conversations"
    ON public.conversations FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Messages Policies (Cascading access through parent conversation ownership)
DROP POLICY IF EXISTS "Users can view messages of their conversations" ON public.messages;
CREATE POLICY "Users can view messages of their conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE public.conversations.id = public.messages.conversation_id
            AND public.conversations.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON public.messages;
CREATE POLICY "Users can insert messages into their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE public.conversations.id = public.messages.conversation_id
            AND public.conversations.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update messages of their conversations" ON public.messages;
CREATE POLICY "Users can update messages of their conversations"
    ON public.messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE public.conversations.id = public.messages.conversation_id
            AND public.conversations.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete messages of their conversations" ON public.messages;
CREATE POLICY "Users can delete messages of their conversations"
    ON public.messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE public.conversations.id = public.messages.conversation_id
            AND public.conversations.user_id = auth.uid()
        )
    );
