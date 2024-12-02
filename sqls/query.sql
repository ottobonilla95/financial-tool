-- see all users
select U.name, CU.name from users U 
join currency CU
on U.currency_id = CU.id
ORDER by U.created_at desc


-- see those active
SELECT 
    U.name, 
    U.email, 
    CU.name AS currency_name, 
    DATE(U.created_at) AS created_date, 
    DATE(U.last_updated) AS last_updated
FROM 
    users U
JOIN 
    currency CU ON U.currency_id = CU.id
WHERE 
    DATE(U.created_at) <> DATE(U.last_updated);