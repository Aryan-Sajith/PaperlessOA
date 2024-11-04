# How to start

## install dependency
run `pip3 install requirement.txt`

## install postgresql
python package `psycopg2` require postgresql to be installed locally
run `brew install postgresql`

## connect to db
create a `.env` file in the Backend directory with the following setting
````
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=5432
DB_NAME=your_database_name
````

## Run the app
run the app using `python3 run.py`