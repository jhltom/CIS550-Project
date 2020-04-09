from config import *
import csv
import cx_Oracle  

filename = "./processedData/serves_clean.csv"

try: 
    # Connect to Oracle database 
    db = cx_Oracle.connect(user+"/"+password+"@"+host+"/"+sid, encoding="UTF-8") 
   
    # Initialize sql cursor
    cursor = db.cursor() 

    # Open .csv file
    with open(filename, newline='') as csvfile:

      # Read .csv file
      csvreader = csv.DictReader(csvfile)
      count = 0
      for row in csvreader:
        businessId = row['businessId']
        cuisineId = row['cuisineId']

        query = "INSERT INTO Serve (businessId, cuisineId) VALUES ({businessId}, '{cuisineId}')".format(businessId=businessId, cuisineId=cuisineId)

        # Execute sql query
        cursor.execute(query) 


        # Commit
        db.commit()

        # Print 
        count += 1
        print(businessId, cuisineId, ": successfully added", count)
      
except cx_Oracle.DatabaseError as e: 
    print("There is a problem with Oracle: ", e) 
  
# Close database operation even if any erro occurs
finally: 
    if cursor: 
        cursor.close() 
    if db: 
        db.close() 