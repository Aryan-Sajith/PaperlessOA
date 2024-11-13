# How to start

## install dependency
run `pip3 install -r requirements.txt`

## install postgresql and psycopg2
python package `psycopg2` require postgresql to be installed locally
run `brew install postgresql` to install postgresql
run `pip3 install psycopg2` to install psycopg2

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