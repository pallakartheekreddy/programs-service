CREATE TYPE status AS ENUM ('Draft', 'Live');
CREATE TYPE programtype AS ENUM ('public', 'private');
CREATE TABLE program
(
    program_id character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    content_types text[] COLLATE pg_catalog."default",
    collection_ids text[] COLLATE pg_catalog."default",
    type programtype,
    startdate timestamp without time zone DEFAULT timezone('utc'::text, (CURRENT_DATE)::timestamp with time zone),
    enddate timestamp without time zone,
    nomination_enddate timestamp without time zone,
    shortlisting_enddate timestamp without time zone,
    content_submission_enddate timestamp without time zone,
    image character varying COLLATE pg_catalog."default",
    status status,
    slug character varying COLLATE pg_catalog."default",
    config text COLLATE pg_catalog."default" NOT NULL,
    channel character varying COLLATE pg_catalog."default" DEFAULT 'DIKSHA'::character varying,
    template_id character varying COLLATE pg_catalog."default" DEFAULT 'template1'::character varying,
    rootorg_id character varying COLLATE pg_catalog."default",
    sourcing_org_name character varying COLLATE pg_catalog."default",
    createdby character varying COLLATE pg_catalog."default",
    createdon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updatedby character varying COLLATE pg_catalog."default",
    updatedon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT pk_program_id PRIMARY KEY (program_id)
)

CREATE TYPE nominationstatus AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE SEQUENCE nomination_id_seq;
CREATE TABLE nomination
(
    id integer NOT NULL DEFAULT nextval('nomination_id_seq'::regclass),
    program_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    organisation_id character varying COLLATE pg_catalog."default",
    status nominationstatus,
    content_types text[] COLLATE pg_catalog."default",
    collection_ids text[] COLLATE pg_catalog."default",
    feedback text COLLATE pg_catalog."default",
    rolemapping json,
    createdby character varying COLLATE pg_catalog."default",
    createdon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updatedby character varying COLLATE pg_catalog."default",
    updatedon timestamp with time zone,
    CONSTRAINT pk_id PRIMARY KEY (id)
)


CREATE SEQUENCE IF NOT EXISTS contentid_seq;
CREATE TYPE contenttypesenum AS ENUM ('TeachingMethod', 'PedagogyFlow', 'FocusSpot', 'LearningOutcomeDefinition', 'PracticeQuestionSet', 'CuriosityQuestionSet', 'MarkingSchemeRubric', 'ExplanationResource', 'ExperientialResource', 'ConceptMap', 'SelfAssess');
CREATE TABLE contenttypes (
    id int4 NOT NULL DEFAULT nextval('contentid_seq'::regclass),
    name varchar NOT NULL,
    value contenttypesenum NOT NULL,
    createdon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updatedon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY ("id")
);
INSERT INTO contenttypes ("name", "value") VALUES ('Teaching Method', 'TeachingMethod');
INSERT INTO contenttypes ("name", "value") VALUES ('Pedagogy Flow', 'PedagogyFlow');
INSERT INTO contenttypes ("name", "value") VALUES ('Focus Spot', 'FocusSpot');
INSERT INTO contenttypes ("name", "value") VALUES ('Learning Outcome Definition', 'LearningOutcomeDefinition');
INSERT INTO contenttypes ("name", "value") VALUES ('Practice Question Set', 'PracticeQuestionSet');
INSERT INTO contenttypes ("name", "value") VALUES ('Curiosity Question Set', 'CuriosityQuestionSet');
INSERT INTO contenttypes ("name", "value") VALUES ('Marking Scheme Rubric', 'MarkingSchemeRubric');
INSERT INTO contenttypes ("name", "value") VALUES ('Explanation Resource', 'ExplanationResource');
INSERT INTO contenttypes ("name", "value") VALUES ('Experiential Resource', 'ExperientialResource');
INSERT INTO contenttypes ("name", "value") VALUES ('Concept Map', 'ConceptMap');
INSERT INTO contenttypes ("name", "value") VALUES ('Self Assess', 'SelfAssess');

ALTER TYPE nominationstatus ADD VALUE 'Initiated';
ALTER TABLE public.program ADD COLUMN guidelines_url TEXT;
ALTER TABLE public.program ADD COLUMN rolemapping json;

CREATE SEQUENCE IF NOT EXISTS configurationid_seq;
CREATE TYPE configurationstatus AS ENUM ('active', 'inactive');
CREATE TABLE configuration (
	id int4 NOT NULL DEFAULT nextval('configurationid_seq'::regclass),
	key varchar NOT NULL,
	value VARCHAR NOT NULL,
    status configurationstatus,
    createdby character varying COLLATE pg_catalog."default",
    createdon timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updatedby character varying COLLATE pg_catalog."default",
    updatedon timestamp with time zone DEFAULT timezone('utc'::text, now()),
	PRIMARY KEY ("id")
);
INSERT INTO "public"."configuration" ("key", "value", "status") VALUES ('smsNominationAccept', 'VidyaDaan: Your nomination for $projectName is accepted. Please login to $url to start contributing content.', 'active');
INSERT INTO "public"."configuration" ("key", "value", "status") VALUES ('smsNominationReject', 'VidyaDaan: Your nomination for $projectName  has not been accepted. Thank you for your interest. Please login to $url for details.', 'active');
