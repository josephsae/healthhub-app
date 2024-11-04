CREATE SEQUENCE IF NOT EXISTS appointments_id_seq;

CREATE TABLE "public"."appointments" (
    "id" int4 NOT NULL DEFAULT nextval('appointments_id_seq'::regclass),
    "date" timestamp NOT NULL,
    "reason" varchar NOT NULL,
    "userId" int4,
    "specialistId" int4,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS authorizations_id_seq;
DROP TYPE IF EXISTS "public"."authorizations_type_enum";
CREATE TYPE "public"."authorizations_type_enum" AS ENUM ('PROCEDURE', 'MEDICATION_REQUEST');
DROP TYPE IF EXISTS "public"."authorizations_status_enum";
CREATE TYPE "public"."authorizations_status_enum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "public"."authorizations" (
    "id" int4 NOT NULL DEFAULT nextval('authorizations_id_seq'::regclass),
    "type" "public"."authorizations_type_enum" NOT NULL,
    "status" "public"."authorizations_status_enum" NOT NULL DEFAULT 'PENDING'::authorizations_status_enum,
    "request" text NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "userId" int4,
    "medicationRequestId" int4,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS examinationresults_id_seq;

CREATE TABLE "public"."examinationresults" (
    "id" int4 NOT NULL DEFAULT nextval('examinationresults_id_seq'::regclass),
    "resultData" text NOT NULL,
    "date" timestamp NOT NULL DEFAULT now(),
    "appointmentId" int4,
    "examinationId" int4,
    "procedureId" int4,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS examinations_id_seq;

CREATE TABLE "public"."examinations" (
    "id" int4 NOT NULL DEFAULT nextval('examinations_id_seq'::regclass),
    "name" varchar NOT NULL,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS medicalrecords_id_seq;

CREATE TABLE "public"."medicalrecords" (
    "id" int4 NOT NULL DEFAULT nextval('medicalrecords_id_seq'::regclass),
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "userId" int4,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS medicationrequests_id_seq;
DROP TYPE IF EXISTS "public"."medicationrequests_status_enum";
CREATE TYPE "public"."medicationrequests_status_enum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "public"."medicationrequests" (
    "id" int4 NOT NULL DEFAULT nextval('medicationrequests_id_seq'::regclass),
    "status" "public"."medicationrequests_status_enum" NOT NULL DEFAULT 'PENDING'::medicationrequests_status_enum,
    "requestedAt" timestamp NOT NULL DEFAULT now(),
    "approvedAt" timestamp,
    "rejectedAt" timestamp,
    "comments" text,
    "userId" int4,
    "medicationId" int4,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS medications_id_seq;

CREATE TABLE "public"."medications" (
    "id" int4 NOT NULL DEFAULT nextval('medications_id_seq'::regclass),
    "name" varchar NOT NULL,
    "description" varchar NOT NULL,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS procedures_id_seq;

CREATE TABLE "public"."procedures" (
    "id" int4 NOT NULL DEFAULT nextval('procedures_id_seq'::regclass),
    "name" varchar NOT NULL,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS specialists_id_seq;

CREATE TABLE "public"."specialists" (
    "id" int4 NOT NULL DEFAULT nextval('specialists_id_seq'::regclass),
    "name" varchar NOT NULL,
    "specialization" varchar NOT NULL,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS users_id_seq;

CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar NOT NULL,
    "password" varchar NOT NULL,
    PRIMARY KEY ("id")
);
