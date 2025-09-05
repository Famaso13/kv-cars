PRAGMA foreign_keys = ON;

-- USERS
CREATE TABLE users (
  user_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT    NOT NULL UNIQUE,
  email        TEXT    NOT NULL UNIQUE,
  password     TEXT    NOT NULL,
  date_created TEXT    NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN date_of_birth TEXT;
ALTER TABLE users ADD COLUMN country TEXT;
ALTER TABLE users ADD COLUMN image BLOB;


-- LEAGUES
CREATE TABLE leagues (
  league_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT,
  private     INTEGER NOT NULL DEFAULT 0,      -- 0/1 
  owner_id    INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- CATEGORIES
CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL UNIQUE,
  description TEXT
);

-- CARS
CREATE TABLE cars (
  car_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  model       TEXT    NOT NULL,
  make        TEXT    NOT NULL,
  category_id INTEGER,
  horsepower  INTEGER,
  mass        REAL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);
ALTER TABLE cars ADD COLUMN image BLOB;

-- TIRES
CREATE TABLE tires (
  tire_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT    NOT NULL,
  manufacturer TEXT    NOT NULL
);

-- ACCEPTS
CREATE TABLE accepts (
  car_id  INTEGER NOT NULL,
  tire_id INTEGER NOT NULL,
  PRIMARY KEY (car_id, tire_id),
  FOREIGN KEY (car_id)  REFERENCES cars(car_id)    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tire_id) REFERENCES tires(tire_id)  ON DELETE CASCADE ON UPDATE CASCADE
);

-- TRACKS
CREATE TABLE tracks (
  track_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE,
  location   TEXT,
  length_km  REAL,
  famous_corner    TEXT
);

ALTER TABLE tracks ADD COLUMN image BLOB;

-- TRACK CONDITIONS 
CREATE TABLE track_conditions (
  conditions_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id         INTEGER NOT NULL,
  time             TEXT,           -- ISO datetime
  weather          TEXT,           
  track_temperature REAL,
  tire_id          INTEGER,
  FOREIGN KEY (track_id) REFERENCES tracks(track_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tire_id)  REFERENCES tires(tire_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- WORKING ON THIS
ALTER TABLE track_conditions ADD COLUMN weather_id INTEGER;

UPDATE track_conditions
SET weather_id = (
  SELECT weathers.weathers_id
  FROM weathers
  WHERE weathers.weather = track_conditions.weather
);

CREATE TABLE track_conditions (
  conditions_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id           INTEGER NOT NULL,
  time               TEXT,                -- ISO datetime
  weather_id         INTEGER NOT NULL,    -- sada FK umjesto TEXT
  track_temperature  REAL,
  tire_id            INTEGER,
  FOREIGN KEY (track_id) REFERENCES tracks(track_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tire_id)  REFERENCES tires(tire_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (weather_id) REFERENCES weathers(weathers_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- WEATHER
CREATE TABLE weathers (
  weathers_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  weather TEXT
);

-- COMPETES 
CREATE TABLE competes (
  driver_id INTEGER NOT NULL,
  league_id INTEGER NOT NULL,
  PRIMARY KEY (driver_id, league_id),
  FOREIGN KEY (driver_id) REFERENCES users(user_id)   ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (league_id) REFERENCES leagues(league_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- LAPS
CREATE TABLE laps (
  lap_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id     INTEGER NOT NULL,
  car_id        INTEGER NOT NULL,
  track_id      INTEGER NOT NULL,
  conditions_id INTEGER,                 
  lap_time_ms   INTEGER NOT NULL,       
  date          TEXT    NOT NULL DEFAULT (date('now')),
  FOREIGN KEY (driver_id)     REFERENCES users(user_id)          ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (car_id)        REFERENCES cars(car_id)            ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (track_id)      REFERENCES tracks(track_id)        ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (conditions_id) REFERENCES track_conditions(conditions_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_laps_driver   ON laps(driver_id);
CREATE INDEX idx_laps_track    ON laps(track_id);
CREATE INDEX idx_laps_date     ON laps(date);
CREATE INDEX idx_tc_track_time ON track_conditions(track_id, time);
CREATE INDEX idx_accepts_car   ON accepts(car_id);
CREATE INDEX idx_accepts_tire  ON accepts(tire_id);
CREATE INDEX idx_competes_drv  ON competes(driver_id);
CREATE INDEX idx_competes_lig  ON competes(league_id);
CREATE INDEX idx_track_conditions_weather_id ON track_conditions(weather_id);


-- INSERTS
-- USERS
INSERT INTO users (username, email, password) VALUES
  ('marko',   'marko@example.com',   'pass123'),
  ('ivana',   'ivana@example.com',   'secret456'),
  ('petar',   'petar@example.com',   'qwerty789'),
  ('ana',     'ana@example.com',     'letmein'),
  ('nikola',  'nikola@example.com',  '123456');



select * from users;

-- CATEGORIES
INSERT INTO categories (name, description) VALUES
  ('GT3',       'Moderna trkaća klasa GT3.'),
  ('GT2',       'Trkaća klasa GT2 sa većom snagom.'),
  ('Touring',   'Turing automobili zasnovani na serijskim modelima.'),
  ('Formula',   'Jednosjedi otvorenih kotača.'),
  ('Classic',   'Klasici i oldtimeri iz različitih era.');

select * from categories;

-- CARS
INSERT INTO cars (model, make, category_id, horsepower, mass) VALUES
  -- GT3 (category_id = 1)
  ('488 GT3',     'Ferrari',      1, 550, 1250),
  ('Huracan GT3', 'Lamborghini',  1, 580, 1280),
  ('R8 LMS',      'Audi',         1, 560, 1275),

  -- GT2 (category_id = 2)
  ('911 GT2 RS',  'Porsche',      2, 690, 1470),

  -- Touring (category_id = 3)
  ('155 V6 TI',   'Alfa Romeo',   3, 420, 1040),
  ('M3 E30 DTM',  'BMW',          3, 300, 950),
  ('Focus ST',    'Ford',         3, 250, 1350),

  -- Formula (category_id = 4)
  ('Formula Abarth', 'Tatuus',    4, 180, 570),
  ('Lotus 98T',      'Lotus',     4, 900, 540),

  -- Classic (category_id = 5)
  ('312T',        'Ferrari',      5, 510, 575),
  ('72D',         'Lotus',        5, 450, 535),
  ('917K',        'Porsche',      5, 600, 800);

  select * from cars;

  -- TIRES
  INSERT INTO tires (type, manufacturer) VALUES
  ('Slick Soft',     'Pirelli'),
  ('Slick Medium',   'Pirelli'),
  ('Slick Hard',     'Pirelli'),
  ('Wet',            'Michelin'),
  ('Street Sport',   'Bridgestone'),
  ('Drift',          'Nitto'),
  ('Classic',        'Dunlop');

  select * from tires;

-- ACCEPTS
-- GT3 cars (Ferrari 488 GT3, Huracan GT3, R8 LMS) koriste sve slick + wet
INSERT INTO accepts (car_id, tire_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3), (2, 4),
  (3, 1), (3, 2), (3, 3), (3, 4);

-- GT2 (Porsche 911 GT2 RS) isto slick + wet
INSERT INTO accepts (car_id, tire_id) VALUES
  (4, 1), (4, 2), (4, 3), (4, 4);

-- Touring (Alfa, BMW, Ford) koriste Street Sport + Wet
INSERT INTO accepts (car_id, tire_id) VALUES
  (5, 5), (5, 4),
  (6, 5), (6, 4),
  (7, 5), (7, 4);

-- Formula (Tatuus, Lotus 98T) koriste samo Slick Soft/Medium/Hard
INSERT INTO accepts (car_id, tire_id) VALUES
  (8, 1), (8, 2), (8, 3),
  (9, 1), (9, 2), (9, 3);

-- Classic (Ferrari 312T, Lotus 72D, Porsche 917K) koriste Classic + Wet
INSERT INTO accepts (car_id, tire_id) VALUES
  (10, 7), (10, 4),
  (11, 7), (11, 4),
  (12, 7), (12, 4);

  SELECT * FROM accepts;

  -- TRACKS
INSERT INTO tracks (name, location, length_km, famous_corner) VALUES
  ('Monza',            'Italy',      5.79,  'Parabolica'),
  ('Silverstone',      'UK',         5.89,  'Maggots & Becketts'),
  ('Spa-Francorchamps','Belgium',    7.00,  'Eau Rouge'),
  ('Nürburgring GP',   'Germany',    5.15,  'Mercedes Arena'),
  ('Imola',            'Italy',      4.90,  'Acque Minerali'),
  ('Laguna Seca',      'USA',        3.60,  'Corkscrew');

SELECT * FROM tracks;

-- TRACK CONDITIONS 
INSERT INTO track_conditions (track_id, time, weather, track_temperature, tire_id) VALUES
  -- Monza (track_id = 1)
  (1, '2025-05-10 10:00:00', 'Sunny',     28.0, 2),
  (1, '2025-05-10 14:00:00', 'Sunny',     33.0, 1),
  (1, '2025-05-11 18:30:00', 'Cloudy',    24.5, 3),
  (1, '2025-06-01 12:00:00', 'Rain',      19.0, 4),
  (1, '2025-06-15 09:00:00', 'Overcast',  22.0, 2),

  -- Silverstone (track_id = 2)
  (2, '2025-05-12 11:00:00', 'Overcast',  18.5, 3),
  (2, '2025-05-12 15:30:00', 'Sunny',     23.0, 2),
  (2, '2025-05-13 09:15:00', 'Light Rain',16.0, 4),
  (2, '2025-06-02 13:45:00', 'Windy',     20.0, 3),
  (2, '2025-06-20 17:00:00', 'Rain',      14.5, 4),

  -- Spa-Francorchamps (track_id = 3)
  (3, '2025-05-14 10:30:00', 'Sunny',     21.0, 2),
  (3, '2025-05-14 14:20:00', 'Cloudy',    19.0, 3),
  (3, '2025-05-15 16:10:00', 'Rain',      13.0, 4),
  (3, '2025-06-03 09:40:00', 'Foggy',     12.5, 3),
  (3, '2025-06-22 11:55:00', 'Sunny',     24.0, 1),

  -- Nürburgring GP (track_id = 4)
  (4, '2025-05-16 09:00:00', 'Overcast',  17.0, 3),
  (4, '2025-05-16 13:30:00', 'Sunny',     22.5, 2),
  (4, '2025-05-17 15:45:00', 'Light Rain',15.0, 4),
  (4, '2025-06-05 10:15:00', 'Windy',     18.0, 3),
  (4, '2025-06-25 18:00:00', 'Sunny',     26.0, 1),

  -- Imola (track_id = 5)
  (5, '2025-05-18 08:45:00', 'Sunny',     24.0, 2),
  (5, '2025-05-18 12:30:00', 'Hot',       34.0, 1),
  (5, '2025-05-19 17:20:00', 'Cloudy',    22.0, 3),
  (5, '2025-06-06 11:10:00', 'Rain',      19.0, 4),
  (5, '2025-06-27 16:00:00', 'Sunny',     31.0, 5),

  -- Laguna Seca (track_id = 6)
  (6, '2025-05-20 09:50:00', 'Sunny',     20.0, 5),
  (6, '2025-05-20 13:20:00', 'Windy',     22.0, 2),
  (6, '2025-05-21 16:05:00', 'Foggy',     17.0, 7),
  (6, '2025-06-07 12:25:00', 'Overcast',  19.0, 3),
  (6, '2025-06-29 14:40:00', 'Rain',      16.5, 4);

SELECT * FROM track_conditions;

INSERT INTO weathers (weather) VALUES
  ('Hot'),
  ('Sunny'),
  ('Cloudy'),
  ('Overcast'),
  ('Windy'),
  ('Foggy'),
  ('Light Rain'),
  ('Rain');

SELECT * FROM weathers;

-- LAPS
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms) VALUES
  -- Monza (track_id = 1)
  (1, 1, 1, (SELECT conditions_id FROM track_conditions WHERE track_id=1 AND time='2025-05-10 10:00:00'), 108500), -- Ferrari 488 GT3, Slick Medium
  (2, 2, 1, (SELECT conditions_id FROM track_conditions WHERE track_id=1 AND time='2025-05-10 14:00:00'), 107352), -- Huracan GT3, Slick Soft
  (3, 3, 1, (SELECT conditions_id FROM track_conditions WHERE track_id=1 AND time='2025-05-11 18:30:00'), 109800), -- Audi R8 LMS, Slick Hard
  (4, 4, 1, (SELECT conditions_id FROM track_conditions WHERE track_id=1 AND time='2025-06-01 12:00:00'), 115900), -- Porsche 911 GT2 RS, Wet
  (5, 1, 1, (SELECT conditions_id FROM track_conditions WHERE track_id=1 AND time='2025-06-15 09:00:00'), 108900), -- Ferrari 488 GT3, Slick Medium

  -- Silverstone (track_id = 2)
  (1, 2, 2, (SELECT conditions_id FROM track_conditions WHERE track_id=2 AND time='2025-05-12 11:00:00'), 120100), -- Huracan GT3, Slick Hard
  (2, 3, 2, (SELECT conditions_id FROM track_conditions WHERE track_id=2 AND time='2025-05-12 15:30:00'), 119800), -- Audi R8 LMS, Slick Medium
  (3, 4, 2, (SELECT conditions_id FROM track_conditions WHERE track_id=2 AND time='2025-05-13 09:15:00'), 128600), -- Porsche 911 GT2 RS, Wet
  (4, 1, 2, (SELECT conditions_id FROM track_conditions WHERE track_id=2 AND time='2025-06-02 13:45:00'), 121200), -- Ferrari 488 GT3, Slick Hard
  (5, 2, 2, (SELECT conditions_id FROM track_conditions WHERE track_id=2 AND time='2025-06-20 17:00:00'), 129500), -- Huracan GT3, Wet

  -- Spa-Francorchamps (track_id = 3)
  (1, 3, 3, (SELECT conditions_id FROM track_conditions WHERE track_id=3 AND time='2025-05-14 10:30:00'), 138345), -- Audi R8 LMS, Slick Medium
  (2, 8, 3, (SELECT conditions_id FROM track_conditions WHERE track_id=3 AND time='2025-05-14 14:20:00'), 142700), -- Formula Abarth, Slick Hard
  (3, 4, 3, (SELECT conditions_id FROM track_conditions WHERE track_id=3 AND time='2025-05-15 16:10:00'), 150000), -- Porsche 911 GT2 RS, Wet
  (4, 9, 3, (SELECT conditions_id FROM track_conditions WHERE track_id=3 AND time='2025-06-03 09:40:00'), 139800), -- Lotus 98T, Slick Hard
  (5, 1, 3, (SELECT conditions_id FROM track_conditions WHERE track_id=3 AND time='2025-06-22 11:55:00'), 137500), -- Ferrari 488 GT3, Slick Soft

  -- Nürburgring GP (track_id = 4)
  (1, 2, 4, (SELECT conditions_id FROM track_conditions WHERE track_id=4 AND time='2025-05-16 09:00:00'), 122500), -- Huracan GT3, Slick Hard
  (2, 8, 4, (SELECT conditions_id FROM track_conditions WHERE track_id=4 AND time='2025-05-16 13:30:00'), 125700), -- Formula Abarth, Slick Medium
  (3, 10, 4, (SELECT conditions_id FROM track_conditions WHERE track_id=4 AND time='2025-05-17 15:45:00'), 144600), -- Ferrari 312T, Wet
  (4, 9, 4, (SELECT conditions_id FROM track_conditions WHERE track_id=4 AND time='2025-06-05 10:15:00'), 127900), -- Lotus 98T, Slick Hard
  (5, 3, 4, (SELECT conditions_id FROM track_conditions WHERE track_id=4 AND time='2025-06-25 18:00:00'), 123800), -- Audi R8 LMS, Slick Soft

  -- Imola (track_id = 5)
  (1, 5, 5, (SELECT conditions_id FROM track_conditions WHERE track_id=5 AND time='2025-05-18 08:45:00'), 116777), -- Alfa 155 V6 TI, Street Sport
  (2, 7, 5, (SELECT conditions_id FROM track_conditions WHERE track_id=5 AND time='2025-05-18 12:30:00'), 119200), -- Ford Focus ST, Street Sport
  (3, 6, 5, (SELECT conditions_id FROM track_conditions WHERE track_id=5 AND time='2025-05-19 17:20:00'), 120800), -- BMW M3 E30 DTM, Slick Hard
  (4, 4, 5, (SELECT conditions_id FROM track_conditions WHERE track_id=5 AND time='2025-06-06 11:10:00'), 127300), -- Porsche 911 GT2 RS, Wet
  (5, 5, 5, (SELECT conditions_id FROM track_conditions WHERE track_id=5 AND time='2025-06-27 16:00:00'), 115900), -- Alfa 155 V6 TI, Street Sport

  -- Laguna Seca (track_id = 6)
  (1, 7, 6, (SELECT conditions_id FROM track_conditions WHERE track_id=6 AND time='2025-05-20 09:50:00'), 118700), -- Ford Focus ST, Street Sport
  (2, 2, 6, (SELECT conditions_id FROM track_conditions WHERE track_id=6 AND time='2025-05-20 13:20:00'), 121600), -- Huracan GT3, Slick Medium
  (3, 12, 6, (SELECT conditions_id FROM track_conditions WHERE track_id=6 AND time='2025-05-21 16:05:00'), 140300), -- Porsche 917K, Classic
  (4, 9, 6, (SELECT conditions_id FROM track_conditions WHERE track_id=6 AND time='2025-06-07 12:25:00'), 126900), -- Lotus 98T, Slick Hard
  (5, 11, 6, (SELECT conditions_id FROM track_conditions WHERE track_id=6 AND time='2025-06-29 14:40:00'), 141800); -- Lotus 72D, Wet

-- Provjera
SELECT * FROM laps;

