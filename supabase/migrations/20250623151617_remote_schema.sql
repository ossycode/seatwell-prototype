create table "public"."games" (
    "id" uuid not null default uuid_generate_v4(),
    "home_team" text not null,
    "away_team" text not null,
    "date" timestamp with time zone not null,
    "venue" text not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."tickets" (
    "id" uuid not null default uuid_generate_v4(),
    "game_id" uuid,
    "seller_id" uuid,
    "price" numeric not null,
    "status" text not null,
    "seat_info" text,
    "created_at" timestamp with time zone default now(),
    "verification_code" text not null
);


create table "public"."transactions" (
    "id" uuid not null default uuid_generate_v4(),
    "ticket_id" uuid,
    "buyer_id" uuid,
    "purchased_at" timestamp with time zone default now()
);


create table "public"."users" (
    "id" uuid not null default uuid_generate_v4(),
    "email" text not null,
    "role" text not null,
    "created_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

CREATE UNIQUE INDEX tickets_verification_code_key ON public.tickets USING btree (verification_code);

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."tickets" add constraint "tickets_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_game_id_fkey";

alter table "public"."tickets" add constraint "tickets_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."tickets" validate constraint "tickets_seller_id_fkey";

alter table "public"."tickets" add constraint "tickets_verification_code_key" UNIQUE using index "tickets_verification_code_key";

alter table "public"."transactions" add constraint "transactions_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."transactions" validate constraint "transactions_buyer_id_fkey";

alter table "public"."transactions" add constraint "transactions_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE not valid;

alter table "public"."transactions" validate constraint "transactions_ticket_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";

grant delete on table "public"."transactions" to "anon";

grant insert on table "public"."transactions" to "anon";

grant references on table "public"."transactions" to "anon";

grant select on table "public"."transactions" to "anon";

grant trigger on table "public"."transactions" to "anon";

grant truncate on table "public"."transactions" to "anon";

grant update on table "public"."transactions" to "anon";

grant delete on table "public"."transactions" to "authenticated";

grant insert on table "public"."transactions" to "authenticated";

grant references on table "public"."transactions" to "authenticated";

grant select on table "public"."transactions" to "authenticated";

grant trigger on table "public"."transactions" to "authenticated";

grant truncate on table "public"."transactions" to "authenticated";

grant update on table "public"."transactions" to "authenticated";

grant delete on table "public"."transactions" to "service_role";

grant insert on table "public"."transactions" to "service_role";

grant references on table "public"."transactions" to "service_role";

grant select on table "public"."transactions" to "service_role";

grant trigger on table "public"."transactions" to "service_role";

grant truncate on table "public"."transactions" to "service_role";

grant update on table "public"."transactions" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


