-- Up
ALTER TABLE Post
ADD COLUMN is_published INTEGER NOT NULL DEFAULT 0;

UPDATE Post
SET is_published = 1;

-- Down
