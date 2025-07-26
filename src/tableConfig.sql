-- Create userEvents table
CREATE TABLE
	userEvents (
		user_id INTEGER NOT NULL,
		event TEXT NOT NULL,
		is_verified BOOLEAN NOT NULL DEFAULT 0,
		payment_id TEXT,
		UNIQUE (user_id, event)
	);