# Connecting to Oracle DB from Python

## Instructions

1. [Download](https://www.oracle.com/database/technologies/instant-client/macos-intel-x86-downloads.html) Oracle Instant Client (Basic Light Package) and (install)[https://www.oracle.com/database/technologies/instant-client/macos-intel-x86-downloads.html#ic_osx_inst]
2. Install cx_Oracle from PyPI with `python -m pip install cx_Oracle --upgrade`
3. Place the db configurations `config.py` in `./database/` 
4. Place .csv file in `./database/` 
5. In `populateDB.py` change `filename` and structure the query according to the table's columns
6. Run script

## Useful Commands (Oracle SQL)
1. Get all tables:  `SELECT table_name FROM user_tables`