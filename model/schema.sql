--@block
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL
);
--@block
CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) UNIQUE NOT NULL
);
--@block
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL
);
--@block
CREATE TABLE tool_types (
    tooltype_id SERIAL PRIMARY KEY,
    tooltype_name VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(category_id) NOT NULL
);
--@block
CREATE TABLE tool_subtypes (
    subtype_id SERIAL PRIMARY KEY,
    tooltype_id INT NOT NULL REFERENCES tool_types(tooltype_id) NOT NULL,
    subtype_name VARCHAR(255) NOT NULL
);
--@block
CREATE TYPE status AS ENUM ('m', 'ok', 'r');
--@block
CREATE TYPE usage AS ENUM ('o', 'r', 'c');
--@block
CREATE TABLE tools (
    tool_code SERIAL PRIMARY KEY,
    encryption_code VARCHAR(255) UNIQUE NOT NULL,
    subtype_id INT REFERENCES tool_subtypes(subtype_id),
    rack INT NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL,
    current_status STATUS NOT NULL,
    usage_type USAGE NOT NULL,
    last_scan TIMESTAMPTZ NOT NULL
);
--@block
CREATE TABLE scan_log (
    scan_log_id SERIAL PRIMARY KEY,
    tool_code INT REFERENCES tools(tool_code) NOT NULL,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT(NOW()),
    user_id INT REFERENCES users(user_id),
    current_status STATUS NOT NULL,
    usage_type USAGE NOT NULL,
    remarks text
);
--@block
CREATE TABLE inventory (
    subtype_id INT REFERENCES tool_subtypes(subtype_id) PRIMARY KEY,
    available INT CHECK(available >= 0)
);
--@block
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    tool_code INT REFERENCES tools(tool_code) NOT NULL,
    brand_id INT REFERENCES brands(brand_id) NOT NULL,
    quantity INT CHECK(quantity > 0) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL
)