CREATE FUNCTION create_order_for_reusable()
RETURNS TRIGGER
AS $$
DECLARE
    count integer;
BEGIN
    SELECT COUNT(*) INTO count FROM tools WHERE subtype_id = NEW.subtype_id AND
                                                usage_type = 'reusable' AND
                                                user_id IS NULL;
    RAISE INFO 'Current count of of tools subtype_id % is %', NEW.subtype_id, count;
    IF (count = 0) THEN
        INSERT INTO
            orders(subtype_id, brand_id, quantity, user_id)
        VALUES
            (NEW.subtype_id, NEW.brand_id, 5, NEW.user_id);
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER order_reusable
AFTER UPDATE
ON tools FOR EACH ROW EXECUTE PROCEDURE create_order_for_reusable();

CREATE FUNCTION create_order_for_once()
RETURNS TRIGGER
AS $$
DECLARE
    count integer;
BEGIN
    SELECT COUNT(*) INTO count FROM tools WHERE subtype_id = OLD.subtype_id AND
                                                usage_type = 'once';
    IF(count = 0) THEN
        INSERT INTO
            orders(subtype_id, brand_id, quantity)
        VALUES
            (OLD.subtype_id, OLD.brand_id, 5);
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER order_once
AFTER DELETE
ON tools FOR EACH ROW EXECUTE PROCEDURE create_order_for_once();