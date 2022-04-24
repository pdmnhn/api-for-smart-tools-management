CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE tool_types (
    tooltype_id SERIAL PRIMARY KEY,
    tooltype_name VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(category_id) NOT NULL
);
CREATE TABLE tool_subtypes (
    subtype_id SERIAL PRIMARY KEY,
    tooltype_id INT NOT NULL REFERENCES tool_types(tooltype_id) NOT NULL,
    subtype_name VARCHAR(255) NOT NULL,
    available INT CHECK(available >= 0)
);
CREATE TYPE status AS ENUM ('m', 'ok', 'r');
CREATE TYPE usage AS ENUM ('o', 'r', 'c');
CREATE TABLE tools (
    tool_code SERIAL PRIMARY KEY,
    encryption_code VARCHAR(255) UNIQUE NOT NULL,
    subtype_id INT REFERENCES tool_subtypes(subtype_id) NOT NULL,
    rack INT NOT NULL,
    user_id INT REFERENCES users(user_id) ON DELETE
    SET NULL,
        current_status STATUS NOT NULL,
        usage_type USAGE NOT NULL,
        last_scan TIMESTAMPTZ NOT NULL
);
CREATE TABLE scan_log (
    scan_log_id SERIAL PRIMARY KEY,
    tool_code INT REFERENCES tools(tool_code) ON DELETE
    SET NULL,
        scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT(NOW()),
        user_id INT REFERENCES users(user_id) ON DELETE
    SET NULL,
        current_status STATUS NOT NULL,
        usage_type USAGE NOT NULL,
        remarks text
);
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    tool_code INT REFERENCES tools(tool_code) ON DELETE
    SET NULL,
        brand_id INT REFERENCES brands(brand_id) ON DELETE
    SET NULL,
        quantity INT CHECK(quantity > 0) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        user_id INT REFERENCES users(user_id) ON DELETE
    SET NULL
)