from config import *
import csv
import cx_Oracle

filename = "./processedData/restaurants_clean.csv"

try:
    # Connect to Oracle database
    db = cx_Oracle.connect(user+"/"+password+"@"+host +
                           "/"+sid, encoding="UTF-8")

    # Initialize sql cursor
    cursor = db.cursor()

    # Open .csv file
    with open(filename, newline='') as csvfile:

        # Read .csv file
        csvreader = csv.DictReader(csvfile)
        count = 0

        for row in csvreader:
            businessId = row['businessId']
            name = row['name']
            address = row['address']
            city = row['city']
            state = row['state']
            postalCode = row['postalCode']
            latitude = row['latitude']
            longitude = row['longitude']
            stars = row['stars']
            reviewCount = row['reviewCount']

            query = """
            INSERT INTO Restaurants (businessId, name, address, city, state, postalCode, latitude, longitude, stars, reviewCount) 
            VALUES ({businessId}, '{name}', '{address}', '{city}', '{state}', {postalCode}, {latitude}, {longitude}, {stars}, {reviewCount})
            """.format(businessId=businessId, name=name, address=address, city=city, state=state, postalCode=postalCode, latitude=latitude, longitude=longitude, stars=stars, reviewCount=reviewCount)

            # Execute sql query
            cursor.execute(query)

            # Commit
            db.commit()

            # # Print
            count += 1
            print(businessId, name, ": successfully added", count)

    # # Execute sql query
    # cursor.execute(query)

    # # Commit
    # db.commit()
    # print("All ", count ," rows added successfully")

except cx_Oracle.DatabaseError as e:
    print("There is a problem with Oracle: ", e)

# Close database operation even if any erro occurs
finally:
    if cursor:
        cursor.close()
    if db:
        db.close()
