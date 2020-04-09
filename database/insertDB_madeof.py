from config import *
import csv
import cx_Oracle

filename = "./processedData/madeof.csv"

try:
    # Connect to Oracle database
    db = cx_Oracle.connect(user+"/"+password+"@"+host + "/"+sid, encoding="UTF-8")

    # Initialize sql cursor
    cursor = db.cursor()

    # Open .csv file
    with open(filename, newline='') as csvfile:

        # Read .csv file
        csvreader = csv.DictReader(csvfile)
        count = 0

        for row in csvreader:

            dishId = row['dishId']
            ingredientId = row['ingredientId']

            query = "INSERT INTO MadeOf (dishId, ingredientId) VALUES ({dishId}, {ingredientId}) ".format(dishId=dishId, ingredientId=ingredientId)

            # Execute sql query
            cursor.execute(query) 

            # Commit
            db.commit()

            # Print 
            count += 1
            print(dishId, ingredientId, ": successfully added", count)


except cx_Oracle.DatabaseError as e:
    print("There is a problem with Oracle: ", e)

# Close database operation even if any erro occurs
finally:
    if cursor:
        cursor.close()
    if db:
        db.close()
