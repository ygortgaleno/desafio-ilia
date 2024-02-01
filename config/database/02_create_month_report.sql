\c ilia_test;

CREATE TABLE IF NOT EXISTS "month_report" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "month_year" VARCHAR(10) NOT NULL UNIQUE,
    "worked_hours" VARCHAR(10) NOT NULL,
    "overtime_hours" VARCHAR(10) NOT NULL,
    "owed_hours" VARCHAR(10) NOT NULL,
    "hash" VARCHAR(255) NOT NULL
);

CREATE INDEX idx_month_year ON month_report("month_year");