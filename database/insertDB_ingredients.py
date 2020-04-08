from config import *
import csv
import cx_Oracle  

filename = "./processedData/ingredients.csv"

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
        id = row['id']
        ingredient = row['ingredient']

        query = "INSERT INTO Ingredients (id, ingredient) VALUES ({id}, '{ingredient}')".format(id=id, ingredient=ingredient)

        # Execute sql query
        cursor.execute(query) 


        # Commit
        db.commit()

        # Print 
        count += 1
        print(id, ingredient, ": successfully added", count)
      
except cx_Oracle.DatabaseError as e: 
    print("There is a problem with Oracle: ", e) 
  
# Close database operation even if any erro occurs
finally: 
    if cursor: 
        cursor.close() 
    if db: 
        db.close() 