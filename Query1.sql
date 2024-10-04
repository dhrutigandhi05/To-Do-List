-- CREATE TABLE TodoItems (
--     ItemID INT PRIMARY KEY IDENTITY(1,1),
--     Description NVARCHAR(255),
--     IsCompleted BIT,
--     DueDate DATETIME
-- );

-- INSERT INTO TodoItems (Description, IsCompleted) VALUES ('finish project', 0);


-- INSERT INTO TodoItems ([Description], IsCompleted, DueDate) VALUES ('study', 0, '2024-04-13 05:15:12')

-- DELETE FROM TodoItems WHERE ItemID = 2

SELECT * FROM TodoItems
