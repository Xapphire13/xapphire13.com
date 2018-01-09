-- Up
CREATE TABLE Post (
  id INTEGER NOT NULL,
  name TEXT,
  PRIMARY KEY (id)
);

-- Down
DROP TABLE Post;
