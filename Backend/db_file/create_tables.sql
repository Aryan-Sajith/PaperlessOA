-- Create the Employee table
CREATE TABLE Employee (
    employee_id serial PRIMARY KEY,
    position VARCHAR(255),
    is_manager BOOLEAN,
    start_date DATE,
    status VARCHAR(50),
    birth_date DATE,
    name VARCHAR(255),
    salary BIGINT,
    level VARCHAR(50)
);

-- Create the Employee_manager table
CREATE TABLE Employee_Manager (
    ID serial PRIMARY KEY,
    employee_id INT,
    manager_id INT,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (manager_id) REFERENCES Employee(employee_id)
);

-- Create the Workflow table
CREATE TABLE Workflow (
    ID serial PRIMARY KEY,
    assignee_id INT,
    status VARCHAR(50),
    content TEXT,
    type VARCHAR(50),
    workflow_id INT,
    time_stamp TIMESTAMP,
    FOREIGN KEY (assignee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (Workflow_id) REFERENCES Workflow(ID)
);

-- Create the Task table
CREATE TABLE task (
    ID INT PRIMARY KEY,
    assignee_id INT,
    status VARCHAR(50),
    description TEXT,
    type VARCHAR(50),
    due_date DATE,
    FOREIGN KEY (assignee_id) REFERENCES Employee(employee_id)
);