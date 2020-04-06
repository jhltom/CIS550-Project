from config import *
import csv
import cx_Oracle  

filename = "test.csv"

try: 
    # Connect to Oracle database 
    db = cx_Oracle.connect(user+"/"+password+"@"+host+"/"+sid, encoding="UTF-8") 
   
    # Initialize sql cursor
    cursor = db.cursor() 

    # Open .csv file
    with open(filename, newline='') as csvfile:

      # Read .csv file
      csvreader = csv.DictReader(csvfile)
      for row in csvreader:
        id = row['id']
        val = row['val']
        query = "INSERT INTO Testing (id, val) VALUES ({id}, {val})".format(id=id, val=val)

        # Execute sql query
        cursor.execute(query) 

        # Commit
        db.commit()
      
except cx_Oracle.DatabaseError as e: 
    print("There is a problem with Oracle: ", e) 
  
# Close database operation even if any erro occurs
finally: 
    if cursor: 
        cursor.close() 
    if db: 
        db.close() 