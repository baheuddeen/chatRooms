CREATE TABLE users (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    display_name VARCHAR(140),
    email VARCHAR(140),
    password VARCHAR(140)
);

CREATE TABLE conversations (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title VARCHAR(140),
    created timestamp with time zone NOT NULL,
    conversation_participants_id bigint NOT NULL
);

CREATE TABLE conversation_messages (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id bigint NOT NULL,
    sender_id bigint NOT NULL,
    body TEXT NOT NULL,
    created timestamp with time zone NOT NULL
);

CREATE TABLE conversation_participants (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id bigint NOT NULL,
    user_id bigint NOT NULL
);


