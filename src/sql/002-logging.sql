-- Up
CREATE TABLE Log (
  timestamp TIME NOT NULL,
  message TEXT,
  exception TEXT,
  level INTEGER NOT NULL
);

CREATE TRIGGER MaxLogMessages
AFTER INSERT ON Log
BEGIN
  DELETE FROM Log
  WHERE timestamp < datetime("now", "-7 days");
END;

-- Down
DROP TRIGGER MaxLogMessages;
DROP TABLE Log;
