CREATE DATABASE ilia_test;

\c ilia_test;

CREATE TABLE "time_sheet" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "date" DATE NOT NULL UNIQUE,
    "hours" VARCHAR(10)[] NOT NULL,
    "worked_hours" VARCHAR(10) NOT NULL
);

CREATE INDEX idx_date ON time_sheet("date");