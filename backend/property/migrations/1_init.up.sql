
CREATE TABLE listings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    price BIGINT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    beds INTEGER DEFAULT 0,
    baths NUMERIC(3,1) DEFAULT 0,
    size INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
