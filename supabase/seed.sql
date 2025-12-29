SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict lEkg0XK1YpXyJowV1yFLuFn6hJse9HuCL8wAkkU48Boso8YveyBHLXElKZ2ugtV

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '4ecf57d9-6e2b-4ef3-9827-96a4e6582934', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"testuser@example.com","user_id":"38e8e3e3-40e5-439f-bbce-0db4e63a6f8b","user_phone":""}}', '2025-11-04 17:33:09.767072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5359e27-ac3f-4aac-90f9-f659cd669571', '{"action":"login","actor_id":"38e8e3e3-40e5-439f-bbce-0db4e63a6f8b","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 17:33:54.78745+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2cfbdb9-0ce2-436f-a079-62eb9e4bbc74', '{"action":"login","actor_id":"38e8e3e3-40e5-439f-bbce-0db4e63a6f8b","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 17:36:07.087972+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a619d6e-248a-4981-a4c1-78a3e079bed6', '{"action":"login","actor_id":"38e8e3e3-40e5-439f-bbce-0db4e63a6f8b","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 17:39:16.085881+00', ''),
	('00000000-0000-0000-0000-000000000000', '4362034b-7959-4d61-8de5-ef5fcd2f43ff', '{"action":"login","actor_id":"38e8e3e3-40e5-439f-bbce-0db4e63a6f8b","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 17:39:38.565559+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab5aace7-985b-4cc2-ba4d-7e949f31f386', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test@test.com","user_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","user_phone":""}}', '2025-11-04 20:23:48.143664+00', ''),
	('00000000-0000-0000-0000-000000000000', '932bba91-1232-4ffc-a8a4-be6bd66fed2e', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:37:28.698734+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a75a968b-b094-41c9-b117-7a9084198162', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:37:45.294779+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8e0ab28-bc9a-43fb-8a57-49f3de27d7f3', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:40:44.477538+00', ''),
	('00000000-0000-0000-0000-000000000000', '09dbc2b4-7fbf-4759-b5f9-7b2e4b5c1d96', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:41:27.622204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee27df1b-0967-4fc1-9442-f72bda5de3ed', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:42:10.116305+00', ''),
	('00000000-0000-0000-0000-000000000000', '71aab664-346f-4ee3-a4dc-051daac13824', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:42:23.732243+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1f68851-8e45-471e-b254-799b6254d842', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:50:12.090263+00', ''),
	('00000000-0000-0000-0000-000000000000', '01153c7e-cdab-43a9-9c0e-860ab5758f67', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 20:50:26.508841+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd441cf8b-5cc9-4ca5-bfc0-7e0f7ec324a8', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:02:29.654554+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9ea5080-46e3-4377-8d2c-47184efa6463', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:02:38.615221+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b61583dd-d49f-439c-b50b-c46dacdecc5c', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:06:48.402526+00', ''),
	('00000000-0000-0000-0000-000000000000', '315a23f7-1caa-4a05-bfb5-1b55a9c7e5f4', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:07:52.320829+00', ''),
	('00000000-0000-0000-0000-000000000000', '540bda0b-b182-4bc5-8694-6c0b86b08fef', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:08:29.201543+00', ''),
	('00000000-0000-0000-0000-000000000000', '19c1cc7f-f9ec-4046-bfdd-a79f31945a6e', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:09:11.863299+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2186afa-af2b-4ce0-b907-8c146ecfbd0e', '{"action":"login","actor_id":"fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-11-04 21:10:17.01135+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$E.JoLoGUNprc.5/hN23kDuN718Tt.zW6f3SH3NRvaKqidZC10UT8y', '2025-11-04 20:23:48.144366+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-04 21:10:17.012431+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-11-04 20:23:48.14175+00', '2025-11-04 21:10:17.01413+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', 'authenticated', 'authenticated', 'testuser@example.com', '$2a$10$B./feZdrOycYDZ8c9VyYRugehMUN9p3P4ewb/05//5/fmNNG9K83m', '2025-11-04 17:33:09.768127+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-04 17:39:38.566102+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-11-04 17:33:09.764924+00', '2025-11-04 17:39:38.567488+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '{"sub": "38e8e3e3-40e5-439f-bbce-0db4e63a6f8b", "email": "testuser@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-11-04 17:33:09.766268+00', '2025-11-04 17:33:09.766294+00', '2025-11-04 17:33:09.766294+00', '1dff1b93-e97f-4752-98e7-066cac8b8d81'),
	('fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '{"sub": "fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-11-04 20:23:48.142923+00', '2025-11-04 20:23:48.142976+00', '2025-11-04 20:23:48.142976+00', '447c6554-2825-476d-8556-17308aaf5b47');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") VALUES
	('1275703c-8063-48f7-b368-71c86a72fba6', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '2025-11-04 17:33:54.789312+00', '2025-11-04 17:33:54.789312+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '172.18.0.1', NULL, NULL),
	('2665f270-9433-4fda-8a48-da0f6bcebd6d', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '2025-11-04 17:36:07.088571+00', '2025-11-04 17:36:07.088571+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '172.18.0.1', NULL, NULL),
	('bda7653c-5a9d-471d-813e-81d1442a3727', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '2025-11-04 17:39:16.087101+00', '2025-11-04 17:39:16.087101+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '172.18.0.1', NULL, NULL),
	('73fce7a8-daed-43fe-9b52-23464bd80de4', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', '2025-11-04 17:39:38.56615+00', '2025-11-04 17:39:38.56615+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '172.18.0.1', NULL, NULL),
	('29f88530-4ed1-4b1e-94bc-ed8d50f955e2', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:37:28.700214+00', '2025-11-04 20:37:28.700214+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('5fd8a963-39b9-48de-a938-c6d8d42f77aa', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:37:45.295497+00', '2025-11-04 20:37:45.295497+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('bec22c3f-a767-4f9d-86de-56c14e0ae690', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:40:44.478487+00', '2025-11-04 20:40:44.478487+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('60725c8c-45e5-40aa-8c9f-ec072290add4', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:41:27.62285+00', '2025-11-04 20:41:27.62285+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('d3385b1c-ee5b-4000-87cd-994a9a0ac568', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:42:10.117132+00', '2025-11-04 20:42:10.117132+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('8734736a-f6cf-4113-8edf-27088d24acb7', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:42:23.73276+00', '2025-11-04 20:42:23.73276+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('0d25fbed-9e5f-4fd6-aa19-0ab1dd969f7f', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:50:12.091694+00', '2025-11-04 20:50:12.091694+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('c12e934a-c0ba-403b-87b6-735df28f8947', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 20:50:26.509557+00', '2025-11-04 20:50:26.509557+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('b349be49-aed5-4168-bf3f-60902a68a01f', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:02:29.655475+00', '2025-11-04 21:02:29.655475+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('7aff263d-eed2-42e0-b346-3fe2e9bce2df', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:02:38.615809+00', '2025-11-04 21:02:38.615809+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('a54c8840-f6fd-43d4-95a7-341fc3c9b994', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:06:48.403381+00', '2025-11-04 21:06:48.403381+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('359c3110-402c-4372-a8a3-36d66a4b5f08', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:07:52.321841+00', '2025-11-04 21:07:52.321841+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('a059e1a6-9105-4aae-9ca6-463b5e97b7f7', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:08:29.202281+00', '2025-11-04 21:08:29.202281+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('ddd8a81f-99d3-4666-93c4-0fe0a549f487', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:09:11.864493+00', '2025-11-04 21:09:11.864493+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL),
	('b5792607-6974-44d0-b776-ab7375280801', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', '2025-11-04 21:10:17.01249+00', '2025-11-04 21:10:17.01249+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('1275703c-8063-48f7-b368-71c86a72fba6', '2025-11-04 17:33:54.791994+00', '2025-11-04 17:33:54.791994+00', 'password', '684b0ca6-b488-462f-b0c0-a9c6f5b3721f'),
	('2665f270-9433-4fda-8a48-da0f6bcebd6d', '2025-11-04 17:36:07.089978+00', '2025-11-04 17:36:07.089978+00', 'password', 'cd5b8a8a-a040-4e09-95b3-cd114638aa57'),
	('bda7653c-5a9d-471d-813e-81d1442a3727', '2025-11-04 17:39:16.088558+00', '2025-11-04 17:39:16.088558+00', 'password', '3c194ab9-279a-4650-874f-d6b514b54a19'),
	('73fce7a8-daed-43fe-9b52-23464bd80de4', '2025-11-04 17:39:38.567685+00', '2025-11-04 17:39:38.567685+00', 'password', 'f3704c0b-8706-46db-9db8-e5299e64e94c'),
	('29f88530-4ed1-4b1e-94bc-ed8d50f955e2', '2025-11-04 20:37:28.703215+00', '2025-11-04 20:37:28.703215+00', 'password', 'e97fdda9-1e3c-4080-937d-4d9858fc8689'),
	('5fd8a963-39b9-48de-a938-c6d8d42f77aa', '2025-11-04 20:37:45.296864+00', '2025-11-04 20:37:45.296864+00', 'password', '905967d8-9980-471f-8c1b-8479b44908b3'),
	('bec22c3f-a767-4f9d-86de-56c14e0ae690', '2025-11-04 20:40:44.480777+00', '2025-11-04 20:40:44.480777+00', 'password', '65daf125-33c2-4b55-9352-278d5cbe2d21'),
	('60725c8c-45e5-40aa-8c9f-ec072290add4', '2025-11-04 20:41:27.624448+00', '2025-11-04 20:41:27.624448+00', 'password', '6a457841-3056-4587-a4d4-cb1c7c17b71d'),
	('d3385b1c-ee5b-4000-87cd-994a9a0ac568', '2025-11-04 20:42:10.118502+00', '2025-11-04 20:42:10.118502+00', 'password', '86c114cd-52d0-40cc-a2b5-d47a8992a5ce'),
	('8734736a-f6cf-4113-8edf-27088d24acb7', '2025-11-04 20:42:23.7341+00', '2025-11-04 20:42:23.7341+00', 'password', '7098259d-ea62-45d4-910c-94ac9627fd26'),
	('0d25fbed-9e5f-4fd6-aa19-0ab1dd969f7f', '2025-11-04 20:50:12.093677+00', '2025-11-04 20:50:12.093677+00', 'password', '3c30ab28-2570-4859-a945-6b2a4c2b2acf'),
	('c12e934a-c0ba-403b-87b6-735df28f8947', '2025-11-04 20:50:26.510973+00', '2025-11-04 20:50:26.510973+00', 'password', 'da1adb69-9fe2-4f62-93aa-cd4f042b8909'),
	('b349be49-aed5-4168-bf3f-60902a68a01f', '2025-11-04 21:02:29.656971+00', '2025-11-04 21:02:29.656971+00', 'password', '78bb453a-8227-447d-ba25-37472a68ec40'),
	('7aff263d-eed2-42e0-b346-3fe2e9bce2df', '2025-11-04 21:02:38.616923+00', '2025-11-04 21:02:38.616923+00', 'password', 'bd191029-157b-4ab0-847a-b9f75d0853bd'),
	('a54c8840-f6fd-43d4-95a7-341fc3c9b994', '2025-11-04 21:06:48.405158+00', '2025-11-04 21:06:48.405158+00', 'password', '6cc47ee0-deb8-4f30-b4a5-2c5b4d0baddc'),
	('359c3110-402c-4372-a8a3-36d66a4b5f08', '2025-11-04 21:07:52.323685+00', '2025-11-04 21:07:52.323685+00', 'password', 'b19cf049-3fc0-441d-89ff-879418ef3e0d'),
	('a059e1a6-9105-4aae-9ca6-463b5e97b7f7', '2025-11-04 21:08:29.203722+00', '2025-11-04 21:08:29.203722+00', 'password', 'f9191baa-5c3c-49a9-9d63-35794cc88275'),
	('ddd8a81f-99d3-4666-93c4-0fe0a549f487', '2025-11-04 21:09:11.866463+00', '2025-11-04 21:09:11.866463+00', 'password', '7079d44d-0e75-40b0-9133-a154acc26c27'),
	('b5792607-6974-44d0-b776-ab7375280801', '2025-11-04 21:10:17.014393+00', '2025-11-04 21:10:17.014393+00', 'password', 'c5521a29-0b8b-4bda-aea9-18b648f46d34');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'togiqdihnisa', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', false, '2025-11-04 17:33:54.790628+00', '2025-11-04 17:33:54.790628+00', NULL, '1275703c-8063-48f7-b368-71c86a72fba6'),
	('00000000-0000-0000-0000-000000000000', 2, '6asus5hzvjma', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', false, '2025-11-04 17:36:07.089171+00', '2025-11-04 17:36:07.089171+00', NULL, '2665f270-9433-4fda-8a48-da0f6bcebd6d'),
	('00000000-0000-0000-0000-000000000000', 3, 'e2xf3vzfzo43', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', false, '2025-11-04 17:39:16.087739+00', '2025-11-04 17:39:16.087739+00', NULL, 'bda7653c-5a9d-471d-813e-81d1442a3727'),
	('00000000-0000-0000-0000-000000000000', 4, 'jsveepnhcycr', '38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', false, '2025-11-04 17:39:38.566779+00', '2025-11-04 17:39:38.566779+00', NULL, '73fce7a8-daed-43fe-9b52-23464bd80de4'),
	('00000000-0000-0000-0000-000000000000', 5, 'y4fu26rz7wh4', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:37:28.701459+00', '2025-11-04 20:37:28.701459+00', NULL, '29f88530-4ed1-4b1e-94bc-ed8d50f955e2'),
	('00000000-0000-0000-0000-000000000000', 6, 'h7gdcpxpgwcg', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:37:45.296061+00', '2025-11-04 20:37:45.296061+00', NULL, '5fd8a963-39b9-48de-a938-c6d8d42f77aa'),
	('00000000-0000-0000-0000-000000000000', 7, '26bznr45nqtn', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:40:44.479569+00', '2025-11-04 20:40:44.479569+00', NULL, 'bec22c3f-a767-4f9d-86de-56c14e0ae690'),
	('00000000-0000-0000-0000-000000000000', 8, 'ylvviwgbr6qz', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:41:27.623681+00', '2025-11-04 20:41:27.623681+00', NULL, '60725c8c-45e5-40aa-8c9f-ec072290add4'),
	('00000000-0000-0000-0000-000000000000', 9, '4qny5xrn5e5m', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:42:10.117749+00', '2025-11-04 20:42:10.117749+00', NULL, 'd3385b1c-ee5b-4000-87cd-994a9a0ac568'),
	('00000000-0000-0000-0000-000000000000', 10, 'cmqoha66lib2', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:42:23.733399+00', '2025-11-04 20:42:23.733399+00', NULL, '8734736a-f6cf-4113-8edf-27088d24acb7'),
	('00000000-0000-0000-0000-000000000000', 11, 'xahy5c3yn3xo', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:50:12.092556+00', '2025-11-04 20:50:12.092556+00', NULL, '0d25fbed-9e5f-4fd6-aa19-0ab1dd969f7f'),
	('00000000-0000-0000-0000-000000000000', 12, '3sgcnhru2fyj', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 20:50:26.5102+00', '2025-11-04 20:50:26.5102+00', NULL, 'c12e934a-c0ba-403b-87b6-735df28f8947'),
	('00000000-0000-0000-0000-000000000000', 13, 'fafzvv3273n6', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:02:29.656089+00', '2025-11-04 21:02:29.656089+00', NULL, 'b349be49-aed5-4168-bf3f-60902a68a01f'),
	('00000000-0000-0000-0000-000000000000', 14, 'fmyiti6psvf4', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:02:38.616272+00', '2025-11-04 21:02:38.616272+00', NULL, '7aff263d-eed2-42e0-b346-3fe2e9bce2df'),
	('00000000-0000-0000-0000-000000000000', 15, 'opbtcjqimgr5', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:06:48.404035+00', '2025-11-04 21:06:48.404035+00', NULL, 'a54c8840-f6fd-43d4-95a7-341fc3c9b994'),
	('00000000-0000-0000-0000-000000000000', 16, 'xaglzdy446o5', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:07:52.322707+00', '2025-11-04 21:07:52.322707+00', NULL, '359c3110-402c-4372-a8a3-36d66a4b5f08'),
	('00000000-0000-0000-0000-000000000000', 17, 'oyite5gwrlq7', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:08:29.202911+00', '2025-11-04 21:08:29.202911+00', NULL, 'a059e1a6-9105-4aae-9ca6-463b5e97b7f7'),
	('00000000-0000-0000-0000-000000000000', 18, 'jk2gw4jfi362', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:09:11.865338+00', '2025-11-04 21:09:11.865338+00', NULL, 'ddd8a81f-99d3-4666-93c4-0fe0a549f487'),
	('00000000-0000-0000-0000-000000000000', 19, 'lpoweo3rlfqo', 'fcbdd6eb-cb65-4615-b0c8-d0c84a2101ad', false, '2025-11-04 21:10:17.013214+00', '2025-11-04 21:10:17.013214+00', NULL, 'b5792607-6974-44d0-b776-ab7375280801');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."households" ("id", "name", "created_at", "timezone") OVERRIDING SYSTEM VALUE VALUES
	(1, 'Test Household', '2025-11-04 17:32:02.684025', NULL);


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: archived_products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "household_id", "name", "brand", "barcode", "quantity", "unit", "expiration_date", "status", "opened", "to_buy", "opened_date", "created_at", "main_image_url") OVERRIDING SYSTEM VALUE VALUES
	(1, 1, 'Organic Milk', NULL, NULL, 1, 'l', '2025-12-15', 'draft', false, false, NULL, '2025-11-04 17:39:16.173491', NULL),
	(2, 1, 'Premium Butter', 'Dairy Best', '9876543210', 250, 'g', '2025-12-20', 'active', false, false, NULL, '2025-11-04 17:39:16.222934', 'https://example.com/butter.jpg'),
	(3, 1, 'Yogurt', 'Bio Natural', NULL, 500, 'g', '2025-11-10', 'active', true, false, '2025-11-04 10:00:00', '2025-11-04 17:39:16.255407', NULL),
	(4, 1, 'Rice', 'Golden Grain', NULL, 2.5, 'kg', '2026-06-01', 'draft', false, false, NULL, '2025-11-04 17:39:16.289308', NULL),
	(5, 1, 'Eggs', NULL, NULL, 12, 'pcs', '2025-11-20', 'draft', false, false, NULL, '2025-11-04 17:39:16.325225', NULL),
	(6, 1, 'Coffee', 'Premium Roast', NULL, 500, 'g', '2026-01-01', 'draft', false, true, NULL, '2025-11-04 17:39:16.359645', NULL),
	(7, 1, 'Apple Juice', NULL, NULL, 1, 'l', '2025-11-30', 'draft', false, false, NULL, '2025-11-04 17:39:16.397814', NULL),
	(8, 1, 'Organic Milk', NULL, NULL, 1, 'l', '2025-12-15', 'draft', false, false, NULL, '2025-11-04 17:39:38.613099', NULL),
	(9, 1, 'Yogurt', 'Bio Natural', NULL, 500, 'g', '2025-11-10', 'active', true, false, '2025-11-04 10:00:00', '2025-11-04 17:39:38.684717', NULL),
	(10, 1, 'Rice', 'Golden Grain', NULL, 2.5, 'kg', '2026-06-01', 'draft', false, false, NULL, '2025-11-04 17:39:38.716909', NULL),
	(11, 1, 'Eggs', NULL, NULL, 12, 'pcs', '2025-11-20', 'draft', false, false, NULL, '2025-11-04 17:39:38.749207', NULL),
	(12, 1, 'Coffee', 'Premium Roast', NULL, 500, 'g', '2026-01-01', 'draft', false, true, NULL, '2025-11-04 17:39:38.781845', NULL),
	(13, 1, 'Apple Juice', NULL, NULL, 1, 'l', '2025-11-30', 'draft', false, false, NULL, '2025-11-04 17:39:38.813336', NULL);


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: scans_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopping_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopping_list_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_households; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_households" ("user_id", "household_id") VALUES
	('38e8e3e3-40e5-439f-bbce-0db4e63a6f8b', 1);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 19, true);


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."analytics_events_id_seq"', 1, false);


--
-- Name: archived_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."archived_products_id_seq"', 1, false);


--
-- Name: households_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."households_id_seq"', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."images_id_seq"', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 13, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq"', 1, false);


--
-- Name: scans_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."scans_log_id_seq"', 1, false);


--
-- Name: shopping_list_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shopping_list_items_id_seq"', 1, false);


--
-- Name: shopping_lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shopping_lists_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict lEkg0XK1YpXyJowV1yFLuFn6hJse9HuCL8wAkkU48Boso8YveyBHLXElKZ2ugtV

RESET ALL;
