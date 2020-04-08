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

        query = "INSERT ALL "

        for row in csvreader:
            dishId = row['dishId']
            ingredientId = row['ingredientId']

            query += "INTO MadeOf (dishId, ingredientId) VALUES ({dishId}, {ingredientId}) ".format(
                dishId=dishId, ingredientId=ingredientId)

            # Print
            count += 1
            print(dishId, ingredientId, ": query constructed", count)

    query += "SELECT 1 FROM DUAL"

    # Execute sql query
    cursor.execute(query)

    # Commit
    db.commit()
    print("All ", count ," rows added successfully")

except cx_Oracle.DatabaseError as e:
    print("There is a problem with Oracle: ", e)

# Close database operation even if any erro occurs
finally:
    if cursor:
        cursor.close()
    if db:
        db.close()
