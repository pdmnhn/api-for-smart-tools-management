INSERT INTO brands (brand_id, brand_name)
VALUES (1, 'Fluke'),
    (2, 'Siemens'),
    (3, 'Emerson'),
    (4, 'Mitsubishi');
INSERT INTO categories (category_id, category_name)
VALUES (1, 'Electrical'),
    (2, 'Mechanical'),
    (3, 'Electronics');
INSERT INTO tool_types (tooltype_id, tooltype_name, category_id)
VALUES (1, 'Drilling Machine', 1),
    (2, 'Motor', 2),
    (3, 'LASER Cutter', 3),
    (4, 'Electrode', 1);
INSERT INTO tool_subtypes (subtype_id, tooltype_id, subtype_name)
VALUES (1, 1, 'Handheld'),
    (2, 2, 'Induction Motor'),
    (3, 3, 'For Metal'),
    (4, 4, 'Medium Size');
INSERT INTO tools (
        tool_code,
        encryption_code,
        subtype_id,
        brand_id,
        rack,
        current_status,
        usage_type,
        last_scan
    )
VALUES (
        1,
        '136424553',
        3,
        1,
        3847,
        'good',
        'reusable',
        NOW()
    ),
    (
        2,
        '198273146',
        2,
        3,
        7502,
        'good',
        'reusable',
        NOW()
    );
INSERT INTO scan_log(tool_code, status, taken)
VALUES (1, 'good', false),
    (2, 'good', false);