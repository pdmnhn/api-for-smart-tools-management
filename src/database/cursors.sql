CREATE FUNCTION get_all_email()
	RETURNS TEXT AS $$
DECLARE

emails TEXT DEFAULT '';
cur_users CURSOR
		  FOR SELECT email
		  FROM users;
email users.email%TYPE;

BEGIN
OPEN cur_users;
	
LOOP
	FETCH cur_users INTO email;
	EXIT WHEN NOT FOUND;
	
	emails := emails || email || ', ';

END LOOP;
	
CLOSE cur_users;

RETURN emails;
END; $$

LANGUAGE PLPGSQL;