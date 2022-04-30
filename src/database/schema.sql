CREATE TYPE usage AS ENUM ('once', 'reusable');
CREATE TYPE status AS ENUM (
    'maintenance required',
    'good',
    'requires repair'
);
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE brands (
    brand_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand_name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE categories (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE tool_types (
    tooltype_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tooltype_name VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(category_id) NOT NULL
);
CREATE TABLE tool_subtypes (
    subtype_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tooltype_id INT NOT NULL REFERENCES tool_types(tooltype_id) NOT NULL,
    subtype_name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE tools (
    tool_code INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    encryption_code VARCHAR(255) UNIQUE NOT NULL,
    subtype_id INT REFERENCES tool_subtypes(subtype_id) NOT NULL,
    brand_id INT REFERENCES brands(brand_id) NOT NULL,
    rack INT NOT NULL,
    user_id INT REFERENCES users(user_id),
    --user_id = null means the tool is not taken, else it is currently in use
    current_status STATUS NOT NULL,
    usage_type USAGE NOT NULL,
    last_scan TIMESTAMPTZ NOT NULL
);
CREATE TABLE scan_log (
    scan_log_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tool_code INT REFERENCES tools(tool_code) NOT NULL,
    scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT(NOW()),
    user_id INT REFERENCES users(user_id) NOT NULL,
    status STATUS NOT NULL,
    taken BOOLEAN NOT NULL,
    -- true means, when this record is added the tool is taken else the tool is returned
    remarks text
);
CREATE TABLE orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subtype_id INT REFERENCES tool_subtypes(subtype_id) NOT NULL,
    brand_id INT REFERENCES brands(brand_id) NOT NULL,
    quantity INT CHECK(quantity > 0) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(NOW()),
    user_id INT REFERENCES users(user_id) NOT NULL
)