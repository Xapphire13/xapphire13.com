-- Up
CREATE TABLE Post (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  created TIME NOT NULL,
  last_modified TIME NOT NULL,
  markdown_text TEXT NOT NULL
);

CREATE TABLE Tag (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE PostTags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  CONSTRAINT PK_PostTags PRIMARY KEY (post_id, tag_id),
  CONSTRAINT FK_PostId FOREIGN KEY (post_id) REFERENCES Post(id),
  CONSTRAINT FK_TagId FOREIGN KEY (tag_id) REFERENCES Tag(id)
);

-- Down
DROP TABLE Post;
