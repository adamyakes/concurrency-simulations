--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: css; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE css WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE css OWNER TO postgres;

\connect css

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pseudo_encrypt(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pseudo_encrypt(value integer) RETURNS integer
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
 l1:= (value >> 16) & 65535;
 r1:= value & 65535;
 WHILE i < 3 LOOP
   l2 := r1;
   r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
   l1 := l2;
   r1 := r2;
   i := i + 1;
 END LOOP;
 return ((r1 << 16) + l1);
END;
$$;


ALTER FUNCTION public.pseudo_encrypt(value integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buffer_run; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buffer_run (
    id integer NOT NULL,
    session_id text DEFAULT 'default'::text NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    duration bigint NOT NULL,
    buffer_size integer NOT NULL,
    num_producers integer NOT NULL,
    num_consumers integer NOT NULL,
    produce_time bigint NOT NULL,
    consume_time bigint NOT NULL,
    variation bigint NOT NULL,
    sleep_time bigint NOT NULL
);


ALTER TABLE public.buffer_run OWNER TO postgres;

--
-- Name: buffer_run_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buffer_run_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buffer_run_id_seq OWNER TO postgres;

--
-- Name: buffer_run_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buffer_run_id_seq OWNED BY public.buffer_run.id;


--
-- Name: buffer_stat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buffer_stat (
    buffer_run_id integer NOT NULL,
    buffer_number integer NOT NULL,
    actor_type text NOT NULL,
    cycles integer NOT NULL,
    max_action_time bigint NOT NULL,
    max_wait_time bigint NOT NULL,
    min_action_time bigint NOT NULL,
    min_wait_time bigint NOT NULL,
    total_action_time bigint NOT NULL,
    total_wait_time bigint NOT NULL
);


ALTER TABLE public.buffer_stat OWNER TO postgres;

--
-- Name: dp_run; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dp_run (
    id integer NOT NULL,
    session_id text DEFAULT 'default'::text NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    duration bigint NOT NULL,
    num_philosophers integer NOT NULL,
    think_time bigint NOT NULL,
    eat_time bigint NOT NULL,
    variation bigint NOT NULL,
    deadlocked boolean NOT NULL,
    solution integer NOT NULL
);


ALTER TABLE public.dp_run OWNER TO postgres;

--
-- Name: dp_run_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dp_run_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dp_run_id_seq OWNER TO postgres;

--
-- Name: dp_run_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dp_run_id_seq OWNED BY public.dp_run.id;


--
-- Name: dp_stat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dp_stat (
    dp_run_id integer NOT NULL,
    philosopher_number integer NOT NULL,
    cycles integer NOT NULL,
    max_hungry bigint NOT NULL,
    max_eating bigint NOT NULL,
    max_thinking bigint NOT NULL,
    min_hungry bigint NOT NULL,
    min_eating bigint NOT NULL,
    min_thinking bigint NOT NULL,
    total_hungry bigint NOT NULL,
    total_eating bigint NOT NULL,
    total_thinking bigint NOT NULL
);


ALTER TABLE public.dp_stat OWNER TO postgres;

--
-- Name: rw_run; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rw_run (
    id integer NOT NULL,
    session_id text DEFAULT 'default'::text NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    duration bigint NOT NULL,
    solution integer NOT NULL,
    num_readers integer NOT NULL,
    num_writers integer NOT NULL,
    read_time bigint NOT NULL,
    write_time bigint NOT NULL,
    variation bigint NOT NULL,
    read_sleep bigint DEFAULT 0 NOT NULL,
    write_sleep bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.rw_run OWNER TO postgres;

--
-- Name: rw_run_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rw_run_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rw_run_id_seq OWNER TO postgres;

--
-- Name: rw_run_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rw_run_id_seq OWNED BY public.rw_run.id;


--
-- Name: rw_stat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rw_stat (
    rw_run_id integer NOT NULL,
    rw_number integer NOT NULL,
    actor_type text NOT NULL,
    cycles integer NOT NULL,
    max_action_time bigint NOT NULL,
    max_wait_time bigint NOT NULL,
    min_action_time bigint NOT NULL,
    min_wait_time bigint NOT NULL,
    total_action_time bigint NOT NULL,
    total_wait_time bigint NOT NULL
);


ALTER TABLE public.rw_stat OWNER TO postgres;

--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_id_seq OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id character varying(16) DEFAULT to_hex(public.pseudo_encrypt((nextval('public.session_id_seq'::regclass))::integer)) NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: unisex_run; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unisex_run (
    id integer NOT NULL,
    session_id text DEFAULT 'default'::text NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    duration bigint NOT NULL,
    solution integer NOT NULL,
    num_males integer NOT NULL,
    num_females integer NOT NULL,
    female_time bigint NOT NULL,
    male_time bigint NOT NULL,
    variation bigint NOT NULL,
    sleep_time bigint NOT NULL
);


ALTER TABLE public.unisex_run OWNER TO postgres;

--
-- Name: unisex_run_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unisex_run_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unisex_run_id_seq OWNER TO postgres;

--
-- Name: unisex_run_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unisex_run_id_seq OWNED BY public.unisex_run.id;


--
-- Name: unisex_stat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unisex_stat (
    unisex_run_id integer NOT NULL,
    unisex_number integer NOT NULL,
    actor_type text NOT NULL,
    cycles integer NOT NULL,
    max_action_time bigint NOT NULL,
    max_wait_time bigint NOT NULL,
    min_action_time bigint NOT NULL,
    min_wait_time bigint NOT NULL,
    total_action_time bigint NOT NULL,
    total_wait_time bigint NOT NULL
);


ALTER TABLE public.unisex_stat OWNER TO postgres;

--
-- Name: buffer_run id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buffer_run ALTER COLUMN id SET DEFAULT nextval('public.buffer_run_id_seq'::regclass);


--
-- Name: dp_run id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dp_run ALTER COLUMN id SET DEFAULT nextval('public.dp_run_id_seq'::regclass);


--
-- Name: rw_run id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rw_run ALTER COLUMN id SET DEFAULT nextval('public.rw_run_id_seq'::regclass);


--
-- Name: unisex_run id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unisex_run ALTER COLUMN id SET DEFAULT nextval('public.unisex_run_id_seq'::regclass);


--
-- Name: buffer_run buffer_run_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buffer_run
    ADD CONSTRAINT buffer_run_pk PRIMARY KEY (id);


--
-- Name: buffer_stat buffer_stat_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buffer_stat
    ADD CONSTRAINT buffer_stat_pk PRIMARY KEY (buffer_run_id, buffer_number);


--
-- Name: dp_run dp_run_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dp_run
    ADD CONSTRAINT dp_run_pk PRIMARY KEY (id);


--
-- Name: dp_stat dp_stat_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dp_stat
    ADD CONSTRAINT dp_stat_pk PRIMARY KEY (dp_run_id, philosopher_number);


--
-- Name: rw_run rw_run_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rw_run
    ADD CONSTRAINT rw_run_pk PRIMARY KEY (id);


--
-- Name: rw_stat rw_stat_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rw_stat
    ADD CONSTRAINT rw_stat_pk PRIMARY KEY (rw_number, rw_run_id);


--
-- Name: session session_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pk PRIMARY KEY (id);


--
-- Name: unisex_run unisex_run_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unisex_run
    ADD CONSTRAINT unisex_run_pk PRIMARY KEY (id);


--
-- Name: unisex_stat unisex_stat_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unisex_stat
    ADD CONSTRAINT unisex_stat_pk PRIMARY KEY (unisex_run_id, unisex_number);


--
-- Name: buffer_run buffer_run_session_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buffer_run
    ADD CONSTRAINT buffer_run_session_id_fk FOREIGN KEY (session_id) REFERENCES public.session(id) ON DELETE CASCADE;


--
-- Name: buffer_stat buffer_stat_buffer_run_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buffer_stat
    ADD CONSTRAINT buffer_stat_buffer_run_id_fk FOREIGN KEY (buffer_run_id) REFERENCES public.buffer_run(id) ON DELETE CASCADE;


--
-- Name: dp_run dp_run_session_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dp_run
    ADD CONSTRAINT dp_run_session_id_fk FOREIGN KEY (session_id) REFERENCES public.session(id) ON DELETE CASCADE;


--
-- Name: dp_stat dp_stat_dp_run_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dp_stat
    ADD CONSTRAINT dp_stat_dp_run_id_fk FOREIGN KEY (dp_run_id) REFERENCES public.dp_run(id) ON DELETE CASCADE;


--
-- Name: rw_run rw_run_session_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rw_run
    ADD CONSTRAINT rw_run_session_id_fk FOREIGN KEY (session_id) REFERENCES public.session(id) ON DELETE CASCADE;


--
-- Name: rw_stat rw_stat_rw_run_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rw_stat
    ADD CONSTRAINT rw_stat_rw_run_id_fk FOREIGN KEY (rw_run_id) REFERENCES public.rw_run(id) ON DELETE CASCADE;


--
-- Name: unisex_run unisex_run_session_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unisex_run
    ADD CONSTRAINT unisex_run_session_id_fk FOREIGN KEY (session_id) REFERENCES public.session(id);


--
-- Name: unisex_stat unisex_stat_unisex_run_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unisex_stat
    ADD CONSTRAINT unisex_stat_unisex_run_id_fk FOREIGN KEY (unisex_run_id) REFERENCES public.unisex_run(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

