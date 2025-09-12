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
ALTER TABLE users ADD COLUMN admin INTEGER NOT NULL DEFAULT 0 CHECK (admin IN (0,1));



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
CREATE INDEX ix_competes_league_driver ON competes(league_id, driver_id);
CREATE INDEX ix_laps_track_driver ON laps(track_id, driver_id);


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
  ('Classic',   'Klasici i oldtimeri iz različitih era.'),
  ('Sport',   'Sportski automobili visokih performansi, fokusirani na agilnost, ubrzanje i upravljivost na stazi i cesti.');

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

  INSERT INTO track_conditions (conditions_id, track_id, "time", weather_id, track_temperature, tire_id) VALUES
  (39,1,'2025-09-10 10:00:00',2,30.0,1),
  (40,1,'2025-09-11 11:00:00',3,24.0,2),
  (41,1,'2025-09-12 12:00:00',8,18.0,4),
  (42,1,'2025-09-13 13:00:00',1,33.0,1),
  (43,2,'2025-09-10 10:00:00',2,30.0,1),
  (44,2,'2025-09-11 11:00:00',3,24.0,2),
  (45,2,'2025-09-12 12:00:00',8,18.0,4),
  (46,2,'2025-09-13 13:00:00',1,33.0,1),
  (47,3,'2025-09-10 10:00:00',2,30.0,1),
  (48,3,'2025-09-11 11:00:00',3,24.0,2),
  (49,3,'2025-09-12 12:00:00',8,18.0,4),
  (50,3,'2025-09-13 13:00:00',1,33.0,1),
  (51,4,'2025-09-10 10:00:00',2,30.0,1),
  (52,4,'2025-09-11 11:00:00',3,24.0,2),
  (53,4,'2025-09-12 12:00:00',8,18.0,4),
  (54,4,'2025-09-13 13:00:00',1,33.0,1),
  (55,5,'2025-09-10 10:00:00',2,30.0,1),
  (56,5,'2025-09-11 11:00:00',3,24.0,2),
  (57,5,'2025-09-12 12:00:00',8,18.0,4),
  (58,5,'2025-09-13 13:00:00',1,33.0,1),
  (59,6,'2025-09-10 10:00:00',2,30.0,1),
  (60,6,'2025-09-11 11:00:00',3,24.0,2),
  (61,6,'2025-09-12 12:00:00',8,18.0,4),
  (62,6,'2025-09-13 13:00:00',1,33.0,1),
  (63,12,'2025-09-10 10:00:00',2,30.0,1),
  (64,12,'2025-09-11 11:00:00',3,24.0,2),
  (65,12,'2025-09-12 12:00:00',8,18.0,4),
  (66,12,'2025-09-13 13:00:00',1,33.0,1);

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

-- Laps for track_id 1 (Monza)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,1,39,98791,'2025-09-12'),
  (2,2,1,40,100742,'2025-09-10'),
  (3,3,1,41,122512,'2025-09-12'),
  (4,4,1,42,100524,'2025-09-12'),
  (5,13,1,39,100027,'2025-09-10'),
  (10,1,1,40,100207,'2025-09-12'),
  (11,2,1,41,117433,'2025-09-12'),
  (1,3,1,42,105403,'2025-09-11'),
  (2,4,1,39,105388,'2025-09-10'),
  (3,13,1,40,100706,'2025-09-10'),
  (4,1,1,41,111573,'2025-09-10'),
  (5,2,1,42,104859,'2025-09-11'),
  (10,8,1,39,83592,'2025-09-12'),
  (11,9,1,40,80572,'2025-09-11'),
  (1,10,1,41,99804,'2025-09-12'),
  (2,11,1,42,80436,'2025-09-12'),
  (3,21,1,39,115931,'2025-09-12'),
  (4,22,1,40,137242,'2025-09-10'),
  (5,23,1,41,136273,'2025-09-11'),
  (10,24,1,42,113607,'2025-09-11');

-- Laps for track_id 2 (Silverstone)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,2,43,119998,'2025-09-12'),
  (2,2,2,44,116753,'2025-09-12'),
  (3,3,2,45,143320,'2025-09-12'),
  (4,4,2,46,119410,'2025-09-11'),
  (5,13,2,43,123611,'2025-09-12'),
  (10,1,2,44,117346,'2025-09-10'),
  (11,2,2,45,137385,'2025-09-11'),
  (1,3,2,46,126597,'2025-09-12'),
  (2,4,2,43,123353,'2025-09-12'),
  (3,13,2,44,121471,'2025-09-12'),
  (4,1,2,45,144947,'2025-09-10'),
  (5,2,2,46,124059,'2025-09-12'),
  (10,8,2,43,93254,'2025-09-11'),
  (11,9,2,44,93387,'2025-09-10'),
  (1,10,2,45,111876,'2025-09-10'),
  (2,11,2,46,96586,'2025-09-10'),
  (3,21,2,43,145372,'2025-09-10'),
  (4,22,2,44,153323,'2025-09-11'),
  (5,23,2,45,178691,'2025-09-10'),
  (10,24,2,46,159899,'2025-09-12');

-- Laps for track_id 3 (Spa)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,3,47,132240,'2025-09-11'),
  (2,2,3,48,131129,'2025-09-11'),
  (3,3,3,49,156755,'2025-09-12'),
  (4,4,3,50,140232,'2025-09-10'),
  (5,13,3,47,137591,'2025-09-12'),
  (10,1,3,48,134885,'2025-09-12'),
  (11,2,3,49,165816,'2025-09-10'),
  (1,3,3,50,152190,'2025-09-12'),
  (2,4,3,47,131552,'2025-09-11'),
  (3,13,3,48,135445,'2025-09-11'),
  (4,1,3,49,174543,'2025-09-12'),
  (5,2,3,50,151052,'2025-09-11'),
  (10,8,3,47,110177,'2025-09-12'),
  (11,9,3,48,113532,'2025-09-11'),
  (1,10,3,49,129536,'2025-09-12'),
  (2,11,3,50,113799,'2025-09-10'),
  (3,21,3,47,168834,'2025-09-12'),
  (4,22,3,48,192677,'2025-09-12'),
  (5,23,3,49,208216,'2025-09-12'),
  (10,24,3,50,175964,'2025-09-10');

-- Laps for track_id 4 (Nurb GP)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,4,51,107219,'2025-09-10'),
  (2,2,4,52,108998,'2025-09-12'),
  (3,3,4,53,128178,'2025-09-10'),
  (4,4,4,54,103358,'2025-09-10'),
  (5,13,4,51,102833,'2025-09-12'),
  (10,1,4,52,108217,'2025-09-12'),
  (11,2,4,53,127674,'2025-09-11'),
  (1,3,4,54,108664,'2025-09-10'),
  (2,4,4,51,107346,'2025-09-11'),
  (3,13,4,52,110478,'2025-09-12'),
  (4,1,4,53,121210,'2025-09-10'),
  (5,2,4,54,102157,'2025-09-10'),
  (10,8,4,51,90453,'2025-09-11'),
  (11,9,4,52,93708,'2025-09-11'),
  (1,10,4,53,113562,'2025-09-11'),
  (2,11,4,54,90946,'2025-09-10'),
  (3,21,4,51,150276,'2025-09-10'),
  (4,22,4,52,125257,'2025-09-10'),
  (5,23,4,53,169170,'2025-09-10'),
  (10,24,4,54,131962,'2025-09-10');

-- Laps for track_id 5 (Imola)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,5,55,114419,'2025-09-11'),
  (2,2,5,56,107827,'2025-09-11'),
  (3,3,5,57,126118,'2025-09-12'),
  (4,4,5,58,104879,'2025-09-10'),
  (5,13,5,55,109544,'2025-09-12'),
  (10,1,5,56,101322,'2025-09-11'),
  (11,2,5,57,130695,'2025-09-12'),
  (1,3,5,58,112365,'2025-09-10'),
  (2,4,5,55,99688,'2025-09-10'),
  (3,13,5,56,107493,'2025-09-10'),
  (4,1,5,57,119285,'2025-09-12'),
  (5,2,5,58,100865,'2025-09-12'),
  (10,8,5,55,101060,'2025-09-12'),
  (11,9,5,56,101479,'2025-09-10'),
  (1,10,5,57,114056,'2025-09-11'),
  (2,11,5,58,99883,'2025-09-11'),
  (3,21,5,55,120340,'2025-09-10'),
  (4,22,5,56,148659,'2025-09-12'),
  (5,23,5,57,153715,'2025-09-10'),
  (10,24,5,58,146702,'2025-09-11');

-- Laps for track_id 6 (Laguna Seca)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,6,59,83933,'2025-09-11'),
  (2,2,6,60,91032,'2025-09-12'),
  (3,3,6,61,101341,'2025-09-12'),
  (4,4,6,62,84199,'2025-09-12'),
  (5,13,6,59,84570,'2025-09-10'),
  (10,1,6,60,88017,'2025-09-12'),
  (11,2,6,61,95065,'2025-09-12'),
  (1,3,6,62,88319,'2025-09-12'),
  (2,27,6,59,104582,'2025-09-11'),
  (3,28,6,60,98288,'2025-09-10'),
  (4,29,6,61,110339,'2025-09-11'),
  (5,30,6,62,115728,'2025-09-10'),
  (10,32,6,59,110752,'2025-09-12'),
  (11,33,6,60,94564,'2025-09-12'),
  (1,14,6,61,145502,'2025-09-12'),
  (2,20,6,62,113517,'2025-09-11'),
  (3,21,6,59,95897,'2025-09-10'),
  (4,22,6,60,125862,'2025-09-10'),
  (5,23,6,61,135322,'2025-09-10'),
  (10,24,6,62,124708,'2025-09-12');

-- Laps for track_id 12 (Nordschleife)
INSERT INTO laps (driver_id, car_id, track_id, conditions_id, lap_time_ms, date) VALUES
  (1,1,12,63,435978,'2025-09-12'),
  (2,2,12,64,442218,'2025-09-10'),
  (3,3,12,65,494953,'2025-09-10'),
  (4,4,12,66,437511,'2025-09-12'),
  (5,13,12,63,436907,'2025-09-11'),
  (10,1,12,64,422052,'2025-09-10'),
  (11,2,12,65,478148,'2025-09-10'),
  (1,3,12,66,416813,'2025-09-11'),
  (2,4,12,63,422786,'2025-09-11'),
  (3,13,12,64,419397,'2025-09-10'),
  (4,29,12,65,566759,'2025-09-11'),
  (5,30,12,66,488561,'2025-09-11'),
  (10,32,12,63,566823,'2025-09-12'),
  (11,33,12,64,470455,'2025-09-10'),
  (1,14,12,65,603598,'2025-09-10'),
  (2,20,12,66,458786,'2025-09-10'),
  (3,21,12,63,542142,'2025-09-12'),
  (4,22,12,64,469670,'2025-09-12'),
  (5,23,12,65,554400,'2025-09-10'),
  (10,11,12,66,405633,'2025-09-10');

  -- Provjera
SELECT * FROM laps;