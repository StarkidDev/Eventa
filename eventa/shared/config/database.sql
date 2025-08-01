-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT CHECK (role IN ('voter', 'organizer', 'admin')) DEFAULT 'voter',
    status TEXT CHECK (status IN ('active', 'suspended', 'pending')) DEFAULT 'active',
    profile_pic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizer_applications table
CREATE TABLE IF NOT EXISTS public.organizer_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    org_name TEXT NOT NULL,
    gov_id_url TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('vote', 'ticket')) NOT NULL,
    organizer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contestants table (for voting events)
CREATE TABLE IF NOT EXISTS public.contestants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    media_url TEXT,
    code TEXT NOT NULL, -- USSD voting code (e.g., "101")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, code)
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Nullable for USSD votes
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    contestant_id UUID REFERENCES public.contestants(id) ON DELETE CASCADE NOT NULL,
    method TEXT CHECK (method IN ('app', 'ussd')) NOT NULL,
    vote_count INTEGER DEFAULT 1,
    phone_number TEXT, -- For USSD votes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table (for ticket events)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- e.g., "VIP", "General", "Early Bird"
    price DECIMAL(10,2) NOT NULL,
    quantity_total INTEGER NOT NULL,
    quantity_sold INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    qr_code TEXT NOT NULL UNIQUE,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create results_snapshot table (for caching vote results)
CREATE TABLE IF NOT EXISTS public.results_snapshot (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    contestant_id UUID REFERENCES public.contestants(id) ON DELETE CASCADE NOT NULL,
    total_votes INTEGER NOT NULL,
    snapshot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_contestants_event_id ON public.contestants(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_event_id ON public.votes(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_contestant_id ON public.votes(contestant_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON public.votes(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_ticket_id ON public.purchases(ticket_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_purchase_id ON public.check_ins(purchase_id);
CREATE INDEX IF NOT EXISTS idx_results_snapshot_event_id ON public.results_snapshot(event_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_applications_updated_at BEFORE UPDATE ON public.organizer_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contestants_updated_at BEFORE UPDATE ON public.contestants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results_snapshot ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view published events" ON public.events
    FOR SELECT USING (is_published = true);

CREATE POLICY "Organizers can view their own events" ON public.events
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Contestants policies
CREATE POLICY "Anyone can view contestants for published events" ON public.contestants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = contestants.event_id 
            AND events.is_published = true
        )
    );

CREATE POLICY "Organizers can manage contestants for their events" ON public.contestants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = contestants.event_id 
            AND events.organizer_id = auth.uid()
        )
    );

-- Votes policies
CREATE POLICY "Users can view votes for published events" ON public.votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = votes.event_id 
            AND events.is_published = true
        )
    );

CREATE POLICY "Authenticated users can vote" ON public.votes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = votes.event_id 
            AND events.is_published = true
            AND events.type = 'vote'
            AND NOW() BETWEEN events.start_date AND events.end_date
        )
    );

-- Tickets policies
CREATE POLICY "Anyone can view tickets for published events" ON public.tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = tickets.event_id 
            AND events.is_published = true
        )
    );

CREATE POLICY "Organizers can manage tickets for their events" ON public.tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = tickets.event_id 
            AND events.organizer_id = auth.uid()
        )
    );

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases" ON public.purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for vote counting and analytics
CREATE OR REPLACE FUNCTION get_vote_stats(event_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_votes', COALESCE(SUM(vote_count), 0),
        'contestants', json_agg(
            json_build_object(
                'contestant_id', c.id,
                'name', c.name,
                'vote_count', COALESCE(vote_totals.total, 0),
                'percentage', CASE 
                    WHEN total_votes.sum > 0 THEN 
                        ROUND((COALESCE(vote_totals.total, 0)::DECIMAL / total_votes.sum) * 100, 2)
                    ELSE 0 
                END
            )
        ),
        'by_method', json_build_object(
            'app', COALESCE(method_stats.app_votes, 0),
            'ussd', COALESCE(method_stats.ussd_votes, 0)
        )
    ) INTO result
    FROM public.contestants c
    LEFT JOIN (
        SELECT contestant_id, SUM(vote_count) as total
        FROM public.votes
        WHERE event_id = event_uuid
        GROUP BY contestant_id
    ) vote_totals ON c.id = vote_totals.contestant_id
    CROSS JOIN (
        SELECT SUM(vote_count) as sum
        FROM public.votes
        WHERE event_id = event_uuid
    ) total_votes
    CROSS JOIN (
        SELECT 
            SUM(CASE WHEN method = 'app' THEN vote_count ELSE 0 END) as app_votes,
            SUM(CASE WHEN method = 'ussd' THEN vote_count ELSE 0 END) as ussd_votes
        FROM public.votes
        WHERE event_id = event_uuid
    ) method_stats
    WHERE c.event_id = event_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;