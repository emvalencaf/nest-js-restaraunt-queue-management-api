# Restaraunt Queue Management API (API de Gerenciamento de Fila de Restaurante)

## TO-DO

## [Documentação da API](https://documenter.getpostman.com/view/21997570/2sA3XPE3SY)


## Como Usar

1. Criar um arquivo `.env.development.local` na raiz do projeto

![Print](/docs/how-to-use/create-env-file.png)

2. Preencher o arquivo `.env.development.local` com as seguintes variáveis de ambiente:
```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

JWT_SECRET=
JWT_EXPIRES_IN=
``` 
- As variáveis com o pré-fixo `DB` se referem ao banco de dados e são essenciais para a conexão do `back-end` com o `database` (Para esse projeto, foi usado o `MySQL`)
- As variáveis com o pré-fixo `JWT` se referem a criptografia dos tokens de autenticação, a ausência delas impedirá o uso das rotas que exijam autenticação.

3. Abrir o projeto no terminal e digitar o seguinte comando: `npm run start:dev`

## Lógica

### feat: Fazer reserva ou emitir uma ticket de espera

1. Para emitir um ticket de espera ou fazer uma reserva é necessário fazer uma requisição HTTP POST a rota `/reservations/customer` com o `body` que tenha obrigatoriamente: `requestedCapability` (a capacidade requisitada da mesa).
    - Essa rota é autenticada, portanto, é necessário que o consumidor esteja autenticado
    - O atributo `isQueueTicket` é facultativo e por padrão é falso, sendo uma flag para determinar se é um ticket de fila ou uma reserva
    - O atributo `recordDatetime` é facultativo se tratar de uma ticket de fila e por padrão retorna o horário atual.

![Criação de uma reserva](/docs/feats/create_reservation.png)
![Criação de uma ficha de fila](/docs/feats/create_queue_ticket.png)

### feat: Gerenciamento de fila de espera e reserva

1. A gerência é feita pelo funcionário através de uma requisição HTTP GET ao *endpoint* `/employees/queue` da fila de espera que fará a execução da *view* fact_queue:
```
CREATE VIEW `fact_queue` AS
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
```

2. A fila é de prioridades em que:
    - Tem prioridade quem tem necessidades especiais e tem reserva
    - Quem tem reserva e o horário de check-in mais antigo
    - Quem tem reserva e o horário marcado mais antigo
    - Quem tem ficha de espera e tem necessidade especial
    - Quem tem ficha de espera e tem o horário de check-in mais antigo
    - Quem tem ficha de espera e o horário de emissão mais antigo.

3. A fila pode ser filtrada pelo número de pessoas para a mesa através do *queryparam* `requestedCapability` (se for 0, será todos):

![Requisição HTTP GET para conseguir a fila](/docs/feats/queue_managment.png)

### feat: Mudança de estados da reservas

1. O usuário pode cancelar sua reserva ou ticket de fila por meio da requisição HTTP PATCH ao *endpoint* `/reservations` o id da reserva é passado como um parâmetro da *query*. O consumidor só pode cancelar sua própria reserva e o funcionário pode cancelar a de todos.

![Requisição HTTP PATCH para cancelar a reserva](/docs/feats/cancel_reservation.png)

2. O mesmo *endpoint* é usado para gerenciar o estado das reservas, para: `confirmed`,`checked-in`, `cancelled`, `in_use`, `done`; cada um desses estados dispará um trigger diferente:
    - `confirmed`: é um estado usado exclusivamente para as reservas, e servem para o restaurante entrar em contato confirmando o interesse da reserva.
    - `checked-in`: é um estado feito pelo funcionário quando o cliente se apresenta no restaurante, isso desencadeia a atualização do campo `reservation_checked_in_datetime` registrando o horário do *check-in*.
    - `cancelled`: cria um registro de *log* na tabela `cancelled_reservations` que registra quem foi que cancelou (consumidor ou funcionário - registrando o id do funcionário) e o horário do cancelamento.
    - `assigned`: é um estado feito para sinalizar que a reserva foi designada a uma ou mais mesas quem faz essa mudança do estado é o funcionário através do *endpoint* `/employees/assign-table`
    - `in_use`: é um estado feito para sinalizar que a reserva está em uso, é o funcionário quem faz a mudança do estado e atualiza o estado. Ao ser feita a atualização é registrado no campo `reservation_start_datetime` o horário que o consumidor passou a ocupar a mesa.
    - `done`: é o estado que sinaliza que o cliente terminou a sua reserva, é o funcionário quem faz a mudança do eestado e atualiza. Ao ser feita a atualização é registrado no campo `reservation_end_datetime` o horário que o consumidor saiu da mesa.

```
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
END
```

```
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
END
```

3. O funcionário é responsável por determinar quais mesas serão designadas a qual reserva, o sistema não permitirá que uma mesa com capacidade menor que a requisitada seja ocupada. Entretanto, a capacidade de mesas pode sobrepor a capacidade requisitada. Para fazer a designação o deverá ser acessado o *endpoint* `/employees/assign-table` e passar como query parâmetro o id da reserva e no corpo da requisição HTTP POST uma array com o id das mesas.

![Designando duas mesas a uma reserva ou ticket de espera](/docs/feats/assign_reservation_to_table.png)

### feat: Visualização do lugar na fila de espera e reserva

1. O consumidor poderá ver seu lugar na espera através da requisição HTTP GET ao *endpoint* `/customer/queue`
    - Será retornado a posição em que ele se encontra em relação a sua sub-fila (ou seja, quantas pessoas com o mesmo número de pessoas para mesa estão na frente dele)
    - Será retornado também o tempo médio das pessoas que já foram chamadas na sub-fila dele
    - Essa lógica é feita graças a junção da função `get_avg_wait_time` e a *view* `fact_assigned_reservations`
```
CREATE VIEW `fact_assigned_reservations` AS
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
```

```
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
END
```

![Checar posição em lugar](/docs/feats/check_position_in_queue.png)