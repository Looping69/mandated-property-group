-- Migration: Add subscriptions and packages tables for Yoco integration

-- Packages table - defines available subscription tiers
CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL, -- Price in cents (ZAR)
    billing_period TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'once'
    max_listings INTEGER NOT NULL DEFAULT 1,
    top_agents INTEGER NOT NULL DEFAULT 0,
    featured_listings INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table - tracks user subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL REFERENCES packages(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table - tracks Yoco payment history
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
    yoco_checkout_id TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the default packages
INSERT INTO packages (id, name, slug, description, price_cents, billing_period, max_listings, top_agents, featured_listings) VALUES
    ('pkg_solo', 'Solo Entry', 'solo-entry', 'For first-time agents testing the floor', 8000, 'once', 1, 0, 0),
    ('pkg_solo5', 'Solo Entry (5 Pack)', 'solo-entry-5', '5 listings bundle for agents', 30000, 'once', 5, 0, 0),
    ('pkg_top_agent', 'Top Agent', 'top-agent', 'Monthly Top Agent visibility', 20000, 'monthly', 0, 1, 0),
    ('pkg_local', 'Local Presence', 'local-presence', 'Agency visibility in one area', 30000, 'monthly', 6, 1, 1),
    ('pkg_authority', 'Area Authority', 'area-authority', 'You''re no longer participating—you''re competing', 50000, 'monthly', 15, 2, 2),
    ('pkg_leader', 'Market Leader', 'market-leader', 'High-volume, high-visibility agencies', 70000, 'monthly', 25, 3, 3),
    ('pkg_regional', 'Regional Dominance', 'regional-dominance', 'Own the area. Control the traffic.', 100000, 'monthly', 40, 3, 3)
ON CONFLICT (slug) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
