use restaurant_db;

-- Insere 10 registros de consumidores usando o procedimento armazenado
CALL insert_new_customer('João', 'Silva', '1985-01-15', 'M', TRUE, '11', '912345678', TRUE);
CALL insert_new_customer('Maria', 'Oliveira', '1990-02-20', 'F', FALSE, '21', '923456789', FALSE);
CALL insert_new_customer('Carlos', 'Pereira', '1987-03-10', 'M', FALSE, '31', '934567890', TRUE);
CALL insert_new_customer('Ana', 'Santos', '1995-04-25', 'F', TRUE, '41', '945678901', TRUE);
CALL insert_new_customer('Paulo', 'Souza', '1992-05-30', 'M', FALSE, '51', '956789012', FALSE);
CALL insert_new_customer('Fernanda', 'Rodrigues', '1988-06-15', 'F', FALSE, '61', '967890123', TRUE);
CALL insert_new_customer('Ricardo', 'Almeida', '1986-07-20', 'M', TRUE, '71', '978901234', FALSE);
CALL insert_new_customer('Juliana', 'Ferreira', '1991-08-05', 'F', TRUE, '81', '989012345', TRUE);
CALL insert_new_customer('Marcelo', 'Costa', '1989-09-10', 'M', FALSE, '91', '990123456', TRUE);
CALL insert_new_customer('Patrícia', 'Lima', '1993-10-25', 'F', TRUE, '12', '901234567', FALSE);

-- inserir 10 registros de reservas
-- Insere 10 registros de reservas com os campos obrigatórios e horários próximos
INSERT INTO `restaurant_db`.`reservations` (
    reservation_status,
    reservation_requested_capability,
    reservation_record_datetime,
    reservation_checked_in_datetime,
    customer_id
) VALUES
('checked-in', 4, '2024-06-14 18:00:00', '2024-06-14 17:50:00', 1),
('checked-in', 2, '2024-06-14 18:15:00', '2024-06-14 18:55:00', 2),
('checked-in', 3, '2024-06-14 18:30:00', '2024-06-14 17:43:00', 3),
('checked-in', 4, '2024-06-14 18:45:00', '2024-06-14 19:45:00', 4),
('checked-in', 2, '2024-06-14 19:00:00', '2024-06-14 19:01:00', 5),
('checked-in', 3, '2024-06-14 19:15:00', '2024-06-14 19:18:00', 6),
('checked-in', 4, '2024-06-14 19:30:00', '2024-06-14 19:35:00', 7),
('checked-in', 2, '2024-06-14 19:45:00', '2024-06-14 19:30:00', 8),
('checked-in', 3, '2024-06-14 20:00:00', '2024-06-14 20:00:00', 9),
('checked-in', 4, '2024-06-14 20:15:00', '2024-06-14 20:00:00', 10);

-- 