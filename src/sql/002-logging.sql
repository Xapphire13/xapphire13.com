-- Up
CREATE TABLE Log (
  id INTEGER PRIMARY KEY,
  message TEXT,
  exception TEXT,
  timestamp TIME NOT NULL
);

CREATE TRIGGER MaxLogMessages
AFTER INSERT ON Log
WHEN (SELECT COUNT(*) FROM Log) > 200
BEGIN
  DELETE FROM Log
  WHERE ID IN (SELECT id FROM Log ORDER BY id ASC LIMIT 1);
END;

-- Down
DROP TRIGGER MaxLogMessages;
DROP TABLE Log;