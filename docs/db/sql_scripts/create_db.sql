-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema restaurant_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema restaurant_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `restaurant_db` DEFAULT CHARACTER SET utf8 ;
USE `restaurant_db` ;

-- -----------------------------------------------------
-- Table `restaurant_db`.`customers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`customers` (
  `customer_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_first_name` VARCHAR(45) NOT NULL,
  `customer_last_name` VARCHAR(45) NOT NULL,
  `customer_birthday` DATE NOT NULL,
  `customer_sex` CHAR(1) NOT NULL,
  `customer_has_special_needs` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`customer_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`customer_phones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`customer_phones` (
  `customer_id` INT UNSIGNED NOT NULL,
  `phone_number` VARCHAR(9) NOT NULL,
  `phone_code_area` VARCHAR(2) NOT NULL,
  `phone_is_whatsapp` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `INDEX_PHONE_FULL_NUMBER` (`phone_code_area` ASC, `phone_number` ASC) INVISIBLE,
  CONSTRAINT `customer_phone_id`
    FOREIGN KEY (`customer_id`)
    REFERENCES `restaurant_db`.`customers` (`customer_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`reservations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`reservations` (
  `reservation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reservation_status` ENUM("pending", "confirmed", "checked-in", "called", "in_use", "cancelled", "done") NOT NULL DEFAULT 'pending',
  `reservation_requested_capability` INT NOT NULL,
  `reservation_record_datetime` DATETIME NOT NULL,
  `reservation_start_datetime` DATETIME NULL,
  `reservation_end_datetime` DATETIME NULL,
  `reservation_checked_in_datetime` DATETIME NULL,
  `reservation_is_queue_ticket` TINYINT NULL DEFAULT 0,
  `customer_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`reservation_id`),
  INDEX `reservation_customer_id_idx` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `reservation_customer_id`
    FOREIGN KEY (`customer_id`)
    REFERENCES `restaurant_db`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`tables`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`tables` (
  `table_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `table_max_capability` INT NOT NULL,
  `table_status` ENUM('available', 'occupied', 'assigned', 'maintenance') NOT NULL DEFAULT 'available',
  `table_is_combinable` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`table_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`employees`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`employees` (
  `employee_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_first_name` VARCHAR(45) NOT NULL,
  `employee_last_name` VARCHAR(45) NOT NULL,
  `employee_birthday` DATE NOT NULL,
  `employee_email` VARCHAR(45) NOT NULL,
  `employee_sex` CHAR(1) NOT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE INDEX `employee_email_UNIQUE` (`employee_email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`cancelled_reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`cancelled_reservation` (
  `reservation_id` INT UNSIGNED NOT NULL,
  `cancelled_reservation_datetime` DATETIME NOT NULL,
  `employee_id` INT UNSIGNED NULL,
  PRIMARY KEY (`reservation_id`),
  INDEX `cancelled_reservation_employee_id_idx` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `cancelled_reservation_reservation_id`
    FOREIGN KEY (`reservation_id`)
    REFERENCES `restaurant_db`.`reservations` (`reservation_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cancelled_reservation_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `restaurant_db`.`employees` (`employee_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`employee_credentials`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`employee_credentials` (
  `employee_id` INT UNSIGNED NOT NULL,
  `employee_username` VARCHAR(45) NOT NULL,
  `employee_password` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`employee_id`),
  CONSTRAINT `employee_credential_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `restaurant_db`.`employees` (`employee_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`employee_phones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`employee_phones` (
  `employee_id` INT UNSIGNED NOT NULL,
  `phone_number` VARCHAR(9) NOT NULL,
  `phone_code_area` VARCHAR(2) NOT NULL,
  `phone_is_whatsapp` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`employee_id`),
  UNIQUE INDEX `INDEX_PHONE_FULL_NUMBER` (`phone_code_area` ASC, `phone_number` ASC) INVISIBLE,
  CONSTRAINT `employee_phone_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `restaurant_db`.`employees` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`closedreservationdays`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`closedreservationdays` (
  `closed_reservation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `closed_reservation_day_date` DATE NOT NULL,
  `closed_reservation_day_created_at` DATETIME NOT NULL,
  `employee_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`closed_reservation_id`),
  INDEX `closed_reservation_day_employee_id_idx` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `closed_reservation_day_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `restaurant_db`.`employees` (`employee_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `restaurant_db`.`AssignedTableReservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`AssignedTableReservation` (
  `assigned_table_reservation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assigned_table_reservation_datetime` DATETIME NULL,
  `table_id` INT UNSIGNED NOT NULL,
  `reservation_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`assigned_table_reservation_id`),
  INDEX `assigned_table_reservation_reservation_id_idx` (`reservation_id` ASC) VISIBLE,
  INDEX `assigned_table_reservation_table_id_idx` (`table_id` ASC) VISIBLE,
  CONSTRAINT `assigned_table_reservation_reservation_id`
    FOREIGN KEY (`reservation_id`)
    REFERENCES `restaurant_db`.`reservations` (`reservation_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `assigned_table_reservation_table_id`
    FOREIGN KEY (`table_id`)
    REFERENCES `restaurant_db`.`tables` (`table_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `restaurant_db` ;

-- -----------------------------------------------------
-- Placeholder table for view `restaurant_db`.`dim_customers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`dim_customers` (`customer_id` INT, `customer_first_name` INT, `customer_last_name` INT, `customer_sex` INT, `customer_birthday` INT, `customer_has_special_needs` INT, `phone_code_area` INT, `phone_number` INT, `phone_is_whatsapp` INT);

-- -----------------------------------------------------
-- Placeholder table for view `restaurant_db`.`fact_queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`fact_queue` (`customer_id` INT, `customer_first_name` INT, `customer_last_name` INT, `customer_has_special_needs` INT, `reservation_id` INT, `reservation_record_datetime` INT, `reservation_checked_in_datetime` INT, `reservation_requested_capability` INT, `reservation_average_wait_time` INT, `reservation_is_queue_ticket` INT);

-- -----------------------------------------------------
-- Placeholder table for view `restaurant_db`.`fact_assigned_reservations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_db`.`fact_assigned_reservations` (`customer_id` INT, `customer_first_name` INT, `customer_last_name` INT, `customer_has_special_needs` INT, `reservation_id` INT, `reservation_record_datetime` INT, `reservation_checked_in_datetime` INT, `assigned_table_reservation_datetime` INT, `reservation_requested_capability` INT, `reservation_is_queue_ticket` INT);

-- -----------------------------------------------------
-- procedure insert_new_customer
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `insert_new_customer` (in p_customer_first_name VARCHAR(45),
										in p_customer_last_name VARCHAR(45),
										in p_customer_birthday DATE,
										in p_customer_sex CHAR(1),
                                        in p_customer_has_special_needs BOOLEAN,
										in p_phone_code_area CHAR(2),
										in p_phone_number VARCHAR(9),
										in p_phone_is_whatsapp BOOLEAN)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Capturar a mensagem de erro
        GET DIAGNOSTICS CONDITION 1
            @p1 = RETURNED_SQLSTATE, 
            @p2 = MESSAGE_TEXT;

        ROLLBACK;
        -- Re-transmitir o erro capturado
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @p2;
    END;

    START TRANSACTION;

    -- Insert new customer
    INSERT INTO `restaurant_db`.`customers` (
        customer_first_name,
        customer_last_name,
        customer_birthday,
        customer_sex,
        customer_has_special_needs
    ) VALUES (
        p_customer_first_name,
        p_customer_last_name,
        p_customer_birthday,
        p_customer_sex,
        p_customer_has_special_needs
    );

    -- Insert phone details for the new customer
    INSERT INTO `restaurant_db`.`customer_phones` (
        customer_id,
        phone_code_area,
        phone_number,
        phone_is_whatsapp
    ) VALUES (
        LAST_INSERT_ID(),
        p_phone_code_area,
        p_phone_number,
        p_phone_is_whatsapp
    );

    COMMIT;
    
    SELECT
		*
	FROM `restaurant_db`.`dim_customers`
    WHERE customer_id = last_insert_id();
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_table_status
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `update_table_status` (p_table_id INT,
										p_table_status ENUM('available',
                                                            'occupied',
                                                            'assigned',
                                                            'maintenance'))
BEGIN
	UPDATE `restaurant_db`.`tables`
    SET table_status = p_table_status
    WHERE table_id = p_table_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_reservation_status
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `update_reservation_status` (p_reservation_id INT,
											  p_reservation_status ENUM("pending",
																		"confirmed",
                                                                        "checked-in",
                                                                        "in_use",
                                                                        "cancelled",
                                                                        "done"))
BEGIN
	UPDATE `restaurant_db`.`reservations`
    SET reservation_status = p_reservation_status
    WHERE reservant_id = p_reservation_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure cancel_reservation
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `cancel_reservation` (in p_reservation_id INT,
									   in p_employee_id INT)
BEGIN
	INSERT INTO `restaurant_db`.`cancelled_reservation` (
		reservation_id,
        employee_id,
        cancelled_reservation_datetime
    ) VALUES (
		p_reservation_id,
        p_employee_id,
        NOW()
    );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_new_employee
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `insert_new_employee` (in p_employee_first_name VARCHAR(45),
										in p_employee_last_name VARCHAR(45),
										in p_employee_birthday DATE,
										in p_employee_sex CHAR(1),
                                        in p_employee_email VARCHAR(45),
										in p_phone_number VARCHAR(9),
										in p_phone_code_area CHAR(2),
										in p_phone_is_whatsapp BOOLEAN,
                                        in p_employee_username VARCHAR(45),
                                        in p_employee_password VARCHAR(60))
BEGIN
	DECLARE last_employee_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Capturar a mensagem de erro
        GET DIAGNOSTICS CONDITION 1
            @p1 = RETURNED_SQLSTATE, 
            @p2 = MESSAGE_TEXT;

        ROLLBACK;
        -- Re-transmitir o erro capturado
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @p2;
    END;
    
    START TRANSACTION;
    
	INSERT INTO `restaurant_db`.`employees` (employee_first_name,
											 employee_last_name,
											 employee_birthday,
											 employee_sex,
                                             employee_email)
    VALUES (p_employee_first_name,
			p_employee_last_name,
            p_employee_birthday,
            p_employee_sex,
            p_employee_email);
	
    SET last_employee_id = last_insert_id();
    
    INSERT INTO `restaurant_db`.`employee_phones` (employee_id,
												   phone_code_area,
												   phone_number,
                                                   phone_is_whatsapp)
	VALUES (last_employee_id,
			p_phone_code_area,
            p_phone_number,
            p_phone_is_whatsapp);
            
    INSERT INTO `restaurant_db`.`employee_credentials` (employee_id,
												        employee_username,
												        employee_password)
	VALUES (last_employee_id,
			p_employee_username,
            p_employee_password);
            
	COMMIT;
    
    SELECT
		emp.employee_id,
        emp.employee_first_name,
		emp.employee_last_name,
		emp.employee_birthday,
		emp.employee_sex,
		emp.employee_email,
		emp_cre.employee_username,
		emp_cre.employee_password,
		emp_ph.phone_code_area,
		emp_ph.phone_number,
		emp_ph.phone_is_whatsapp
    FROM `restaurant_db`.`employees` as emp
		INNER JOIN `restaurant_db`.`employee_credentials` as emp_cre on emp_cre.employee_id = emp.employee_id
        INNER JOIN `restaurant_db`.`employee_phones` as emp_ph on emp.employee_id = emp_ph.employee_id
	WHERE emp.employee_id = last_employee_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_new_table
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `insert_new_table` (
	in p_table_max_capability INT,
    in p_table_is_combinable BOOLEAN
)
BEGIN
	INSERT INTO `restaurant_db`.`tables` (
		table_max_capability,
        table_is_combinable
    ) VALUES (
		p_table_max_capability,
        p_table_is_combinable
    );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_new_closed_day_for_reservation
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `insert_new_closed_day_for_reservation` (
	p_closed_reservation_day_date DATE,
    p_employee_id INT
)
BEGIN
	INSERT INTO `restaurant_db`.`closedreservationdays` (
		closed_reservation_day_date,
        closed_reservation_day_created_at,
		employee_id
    ) values (
		p_closed_reservation_day_date,
		NOW(),
        p_employee_id
    );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_new_reservation
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `insert_new_reservation` (
	IN p_reservation_record_datetime DATETIME,
    IN p_reservation_requested_capability INT,
    IN p_reservation_is_queue_ticket BOOLEAN,
    IN p_customer_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Capturar a mensagem de erro
        GET DIAGNOSTICS CONDITION 1
            @p1 = RETURNED_SQLSTATE, 
            @p2 = MESSAGE_TEXT;

        ROLLBACK;
        -- Re-transmitir o erro capturado
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @p2;
    END;
    
    START TRANSACTION;
    
    INSERT INTO `restaurant_db`.`reservations`(
		reservation_record_datetime,
        reservation_requested_capability,
        reservation_is_queue_ticket,
        customer_id
    ) values (
		p_reservation_record_datetime,
        p_reservation_requested_capability,
        p_reservation_is_queue_ticket,
        p_customer_id
    );
    
	COMMIT;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_position_in_queue
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE PROCEDURE `get_position_in_queue` (
	in p_customer_id int
)
BEGIN
	DECLARE requested_capability_found INT;

	-- Will get the oldest checked-in reservation
	SELECT
		res.reservation_requested_capability INTO requested_capability_found
	FROM
		restaurant_db.customers as cus
        INNER JOIN restaurant_db.reservations as res ON res.customer_id = p_customer_id
	WHERE
		res.reservation_status = 'checked-in'
	ORDER BY
		res.reservation_checked_in_datetime ASC
	LIMIT 1;
    
    -- will get the position in line
    WITH RankedQueue AS (
		SELECT 
			ROW_NUMBER() OVER (
    ORDER BY CASE
        WHEN f_q.reservation_is_queue_ticket = 0 THEN f_q.customer_has_special_needs END DESC,
    CASE
        WHEN f_q.reservation_is_queue_ticket = 0 THEN f_q.reservation_checked_in_datetime END ASC,
    CASE
        WHEN f_q.reservation_is_queue_ticket = 0 THEN f_q.reservation_start_datetime END ASC,
    CASE
        WHEN f_q.reservation_is_queue_ticket = 1 THEN f_q.customer_has_special_needs END DESC,
    CASE
        WHEN f_q.reservation_is_queue_ticket = 1 THEN f_q.reservation_checked_in_datetime END ASC,
    CASE
        WHEN f_q.reservation_is_queue_ticket = 1 THEN f_q.reservation_start_datetime END ASC
            ) AS reservation_queue_position,
            f_q.*
		FROM 
			fact_queue as f_q
		WHERE
			f_q.reservation_requested_capability = requested_capability_found
		)
		SELECT *
		FROM RankedQueue
		WHERE customer_id = p_customer_id
        LIMIT 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function get_avg_wait_time
-- -----------------------------------------------------

DELIMITER $$
USE `restaurant_db`$$
CREATE FUNCTION `get_avg_wait_time` (
	p_requested_capability INT
)
RETURNS DATETIME
DETERMINISTIC
BEGIN
	DECLARE AVG_TIME TIME;
    
    -- Since a reservation can be assign to a two tables in diff times
    -- We need a way to protect the integrity of the avg time
    -- So only the earliest assigned_table_reservation_datetime will be count
    SELECT
		SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(assigned_table_reservation_datetime, reservation_record_datetime)))) INTO AVG_TIME
    FROM (
        SELECT 
            reservation_id,
            reservation_record_datetime,
            MIN(assigned_table_reservation_datetime) AS assigned_table_reservation_datetime
        FROM 
            restaurant_db.fact_assigned_reservations
        WHERE 
            reservation_requested_capability = p_requested_capability
        GROUP BY 
            reservation_id, reservation_record_datetime
    ) AS earliest_reservation;
    
	RETURN AVG_TIME;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `restaurant_db`.`dim_customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `restaurant_db`.`dim_customers`;
USE `restaurant_db`;
CREATE  OR REPLACE VIEW `dim_customers` AS
    SELECT 
        `cus`.`customer_id` AS `customer_id`,
        `cus`.`customer_first_name` AS `customer_first_name`,
        `cus`.`customer_last_name` AS `customer_last_name`,
        `cus`.`customer_sex` AS `customer_sex`,
        `cus`.`customer_birthday` AS `customer_birthday`,
        `cus`.`customer_has_special_needs` AS `customer_has_special_needs`,
        `cus_ph`.`phone_code_area` AS `phone_code_area`,
        `cus_ph`.`phone_number` AS `phone_number`,
        `cus_ph`.`phone_is_whatsapp` AS `phone_is_whatsapp`
    FROM
        (`restaurant_db`.`customers` `cus`
        JOIN `restaurant_db`.`customer_phones` `cus_ph` ON ((`cus_ph`.`customer_id` = `cus`.`customer_id`)));

-- -----------------------------------------------------
-- View `restaurant_db`.`fact_queue`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `restaurant_db`.`fact_queue`;
USE `restaurant_db`;
CREATE  OR REPLACE VIEW `fact_queue` AS
SELECT
	cus.customer_id,
    cus.customer_first_name,
    cus.customer_last_name,
    cus.customer_has_special_needs,
    res.reservation_id,
    res.reservation_record_datetime,
    res.reservation_checked_in_datetime,
    res.reservation_requested_capability,
    get_avg_wait_time(res.reservation_requested_capability) AS reservation_average_wait_time,
    res.reservation_is_queue_ticket
FROM
    `restaurant_db`.`customers` AS cus
    INNER JOIN `restaurant_db`.`reservations` AS res ON cus.customer_id = res.customer_id
WHERE
    res.reservation_status = 'checked-in'
ORDER BY
    CASE
        WHEN res.reservation_is_queue_ticket = 0 THEN cus.customer_has_special_needs END DESC,
    CASE
        WHEN res.reservation_is_queue_ticket = 0 THEN res.reservation_checked_in_datetime END ASC,
    CASE
        WHEN res.reservation_is_queue_ticket = 0 THEN res.reservation_record_datetime END ASC,
    CASE
        WHEN res.reservation_is_queue_ticket = 1 THEN cus.customer_has_special_needs END DESC,
    CASE
        WHEN res.reservation_is_queue_ticket = 1 THEN res.reservation_checked_in_datetime END ASC,
    CASE
        WHEN res.reservation_is_queue_ticket = 1 THEN res.reservation_record_datetime END ASC;

-- -----------------------------------------------------
-- View `restaurant_db`.`fact_assigned_reservations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `restaurant_db`.`fact_assigned_reservations`;
USE `restaurant_db`;
CREATE  OR REPLACE VIEW `fact_assigned_reservations` AS
SELECT
	cus.customer_id,
    cus.customer_first_name,
    cus.customer_last_name,
    cus.customer_has_special_needs,
    res.reservation_id,
    res.reservation_record_datetime,
    res.reservation_checked_in_datetime,
    as_res.assigned_table_reservation_datetime,
    res.reservation_requested_capability,
    res.reservation_is_queue_ticket
FROM
    `restaurant_db`.`customers` AS cus
    INNER JOIN `restaurant_db`.`reservations` AS res ON cus.customer_id = res.customer_id
    INNER JOIN `restaurant_db`.`assignedtablereservation` as as_res
WHERE
	res.reservation_status = "called";
USE `restaurant_db`;

DELIMITER $$
USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`customer_phones_BEFORE_INSERT` BEFORE INSERT ON `customer_phones` FOR EACH ROW
BEGIN
    IF NEW.phone_number = '' OR LENGTH(NEW.phone_number) < 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone number cannot be empty or less than 9 digit long';
    END IF;
    
    IF NEW.phone_code_area = '' OR LENGTH(NEW.phone_number) < 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone code area cannot be empty or less than 2 digit long';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`reservations_BEFORE_INSERT` BEFORE INSERT ON `reservations` FOR EACH ROW
BEGIN
    -- Check if customer_id is provided
    IF NEW.customer_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer ID cannot be empty';
    END IF;

    -- Check if customer_id exists in the customers table
    IF NOT EXISTS (
        SELECT 1
        FROM `customers`
        WHERE `customer_id` = NEW.customer_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer ID does not exist';
    END IF;

    -- Check if reservation requested capability is greater than 0
    IF NEW.reservation_requested_capability <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Reservation requested capability must be greater than 0';
    END IF;
    
    -- Check if the reservation date is a closed reservation day
    IF EXISTS (
        SELECT 1
        FROM `restaurant_db`.`closedreservationdays`
        WHERE closed_reservation_day_date = DATE(NEW.reservation_start_datetime)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Reservations cannot be made on that date';
    END IF;
    
    -- Reservations for the same day can only be made before 1:00 PM
    IF DATE(NEW.reservation_start_datetime) = CURDATE() AND CURTIME() > '11:00:00' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Same day reservations can only be made before 11:00 AM';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`reservations_BEFORE_UPDATE` BEFORE UPDATE ON `reservations` FOR EACH ROW
BEGIN
	IF NEW.reservation_status = 'checked-in' THEN
		-- set reservation datetime
		SET NEW.reservation_checked_in_datetime = now();
	ELSEIF NEW.reservation_status = 'in_use' THEN
		SET NEW.reservation_start_datetime = now();
	ELSEIF NEW.reservation_status = 'done' THEN
		SET NEW.reservation_end_datetime = now();
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`reservations_AFTER_UPDATE` AFTER UPDATE ON `reservations` FOR EACH ROW
BEGIN
	-- update table status to available 
	IF NEW.reservation_status = "done" THEN
		UPDATE TABLES
        SET table_status = 'available'
        WHERE table_id in (
			SELECT table_id
            FROM restaurant_db.assignedtablereservation as as_re
            WHERE as_re.reservation_id = OLD.reservation_id
        );
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`tables_BEFORE_INSERT` BEFORE INSERT ON `tables` FOR EACH ROW
BEGIN
    IF NEW.table_max_capability <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Table max capability must be greater than 0';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`cancelled_reservation_BEFORE_INSERT` BEFORE INSERT ON `cancelled_reservation` FOR EACH ROW
BEGIN
    DECLARE is_same_customer BOOLEAN;

    -- Check if the employee_id exists
    IF NEW.employee_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM `restaurant_db`.`employees` WHERE employee_id = NEW.employee_id) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Employee ID does not exist';
        END IF;
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`cancelled_reservation_AFTER_INSERT` AFTER INSERT ON `cancelled_reservation` FOR EACH ROW
BEGIN
	UPDATE `restaurant_db`.`reservations` as re
    SET re.reservation_status = "cancelled"
    WHERE re.reservation_id = NEW.reservation_id;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`employee_credentials_BEFORE_INSERT` BEFORE INSERT ON `employee_credentials` FOR EACH ROW
BEGIN
	IF NEW.employee_username = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee username cannot be empty';
    END IF;
    
    IF NEW.employee_password = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee password cannot be empty';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`employee_phones_BEFORE_INSERT` BEFORE INSERT ON `employee_phones` FOR EACH ROW
BEGIN
    IF NEW.phone_number = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone number cannot be empty';
    END IF;
    
    IF NEW.phone_code_area = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone code area cannot be empty';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`closedreservationdays_BEFORE_INSERT` BEFORE INSERT ON `closedreservationdays` FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT closed_reservation_day_date
        FROM `restaurant_db`.`closedreservationdays`
        WHERE closed_reservation_day_date = DATE(NEW.closed_reservation_day_date)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The date is already closed for reservations';
    END IF;
    
    -- Check if the date is in the past
    IF CURDATE() > NEW.closed_reservation_day_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The date has passed';
    END IF;
END$$

USE `restaurant_db`$$
CREATE DEFINER = CURRENT_USER TRIGGER `restaurant_db`.`AssignedTableReservation_BEFORE_INSERT` BEFORE INSERT ON `AssignedTableReservation` FOR EACH ROW
BEGIN
	SET NEW.assigned_table_reservation_datetime = now();
    
    -- update tables status to assigned
    UPDATE restaurant_db.tables as tb
    SET tb.table_status = 'assigned'
    WHERE
		tb.table_id = NEW.table_id;
    
    -- update reservation status to called
    UPDATE restaurant_db.reservations as res
    SET res.reservation_status = "called"
    WHERE
		res.reservation_id = NEW.reservation_id;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
