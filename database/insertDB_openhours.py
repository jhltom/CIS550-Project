from config import *
import csv
import cx_Oracle  

filename = "./processedData/open_hours_final_final.csv"

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
        
        if count < 72852 : 
            count += 1
            continue
        
        businessId = row['businessId']
        day = row['day']
        startHour = row['startHour']
        endHour = row['endHour']
        allDay = row['allDay']

        query = "INSERT INTO OpenHours (businessId, day, startHour, endHour, allDay) VALUES ({businessId}, '{day}', {startHour}, {endHour}, {allDay})".format(
            businessId=businessId, day=day, startHour=startHour, endHour=endHour, allDay=allDay)

        # Execute sql query
        cursor.execute(query) 


        # Commit
        db.commit()

        # Print 
        count += 1
        print(businessId, day, startHour, endHour, allDay, ": successfully added", count)
      
except cx_Oracle.DatabaseError as e: 
    print("There is a problem with Oracle: ", e) 
  
# Close database operation even if any erro occurs
finally: 
    if cursor: 
        cursor.close() 
    if db: 
        db.close() 