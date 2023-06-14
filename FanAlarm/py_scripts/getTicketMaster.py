import requests
import json
import mysql.connector
from config import SQL_HOSTNAME, SQL_USERNAME, SQL_PASSWORD, SQL_DB
statecodes = ["ON", "SK", "AB", "BC", "MB"] 
for state in statecodes:
    for i in range(1,5):
        res = requests.get(
            "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&page="+str(i)+"&countryCode=CA&size=200&stateCode="+str(state)+"&apikey=nbURA89kvA7ccZts3NF8sYPtKZhpGzY0")
        list = res.json()
        print(list)
        newList = []
        if '_embedded' in list:
            list = list['_embedded']['events']
            for i in list:
                if 'name' in i:
                    concert_name = i['name']
                else:
                    concert_name =''
                if 'url' in i:
                    concert_url = i['url']
                else:
                    concert_url =''
                if 'sales' in i:
                    sales = i['sales']
                    if 'public' in sales:
                        publiclist =[]
                        for j in sales['public']:
                            if 'startDateTime' in sales['public']:
                                concert_start = sales['public']['startDateTime']
                            else:
                                concert_start = None
                            if 'endDateTime' in sales['public']:
                                concert_end = sales['public']['endDateTime']
                            else:
                                concert_end = None
                            public = (int(True), concert_start, concert_end)
                            publiclist.append(public)
                    else:
                        public = (0,None,None)
                    if 'presales' in sales:
                        presaleslist = []
                        for presale in sales['presales']:
                            if 'startDateTime' in presale:
                                concert_start = presale['startDateTime']
                            else:
                                concert_start = None
                            if 'endDateTime' in presale:
                                concert_end = presale['endDateTime']
                            else:
                                concert_end = None
                            presales = (int(False),concert_start,concert_end)
                            publiclist.append(presales)
                    else:
                        presales = (0, None, None)
                    
                    concert_sales = publiclist
                else:
                    concert_sales = []
                if 'venues' in i['_embedded']:
                    venues = i['_embedded']['venues']
                    venuelist = []
                    for venue in venues:
                        venue_name = venue['name']
                        if 'city' in venue:
                            venue_city = venue['city']['name']
                        else:
                            venue_city = ''
                        if 'state' in venue:
                            venue_state = venue['state']['name']
                        else:
                            venue_state = ''
                        if 'country' in venue:
                            venue_country = venue['country']['name']
                        else:
                            venue_country = ''
                        if 'address' in venue:
                            if 'line1' in venue['address']:
                                venue_address = venue['address']['line1']
                            else:
                                venue_address = ''
                        else:
                            venue_address = ''
                        if 'location' in venue and 'longitude' in venue['location'] and 'latitude' in venue['location']:
                            venue_location = venue['location']['longitude'] + \
                                venue['location']['latitude']
                        else:
                            venue_location = ''
                        venueitem = (venue_name, venue_city, venue_state, venue_country, venue_address, venue_location,)
                        venuelist.append(venueitem)

                    
                else:
                    venues = ''
                if 'attractions' in i['_embedded']:
                    attractionlist = []
                    for attraction in i['_embedded']['attractions']:
                        if 'name' in attraction:
                            attractionitem = (attraction['name'],)
                        else:
                            attractionitem = ('',)
                        attractionlist.append(attractionitem)
                else:
                    attractions = ''
                dict = {
                    'concert' :concert_name,
                    'concert_url' :concert_url,
                    'concert_sales' :concert_sales,
                    'concert_venues' :venuelist,
                    'concert_attractions' :attractionlist

                }
                newList.append(dict)


            mydb = mysql.connector.connect (
                host=SQL_HOSTNAME,
                user = SQL_USERNAME,
                password = SQL_PASSWORD,
                database = SQL_DB,
                autocommit="True"
            )


            mycursor = mydb.cursor()

            for i in newList:
                val_attractions = i['concert_attractions']
                val_venues = i['concert_venues']
                val_sales = i['concert_sales']

                venues_check = "SELECT venues_id FROM venues WHERE name = %s AND city = %s AND state = %s AND country = %s AND address = %s AND location = %s LIMIT 1"
                venues_sql = "INSERT INTO venues (name, city, state, country, address, location) VALUES (%s, %s, %s, %s, %s, %s)"
                venue_ids = []
                mycursor.execute(venues_check, val_venues[0])
                myresult = mycursor.fetchall()

                if not myresult:
                    mycursor.execute(venues_sql,  val_venues[0])
                    venue_insert = (mycursor.lastrowid,)
                    venue_ids.append(venue_insert)
                else:
                    venue_ids.append(myresult[0])

                val_concerts = [(i['concert'], i['concert_url'], venue_ids[0][0])]
                concerts_check = "SELECT concerts_id FROM concerts WHERE name = %s AND url = %s AND venue_id = %s LIMIT 1"
                concerts_sql = "INSERT INTO concerts(name, url, venue_id) VALUES (%s, %s, %s)"
                mycursor.execute(concerts_check, val_concerts[0])
                myresult = mycursor.fetchall()
                if not myresult:
                    mycursor.execute(concerts_sql, val_concerts[0])
                    concert_insert = (mycursor.lastrowid,)
                    concert_id = concert_insert
                else:
                    concert_id = myresult[0]
                
                sales_check = "SELECT sales_id FROM sales WHERE public= %s AND start_date = %s AND end_date = %s AND concert_id = %s LIMIT 1"
                sales_sql = "INSERT INTO sales (public, start_date, end_date, concert_id) VALUES (%s, %s, %s, %s)"
                sale_ids = []

                for sale in val_sales:
                    sale = sale + concert_id
                    mycursor.execute(sales_check, sale)
                    myresult = mycursor.fetchall()
                    if not myresult:
                        mycursor.execute(sales_sql, sale)
                        sale_insert = (mycursor.lastrowid,)
                        sale_ids.append(sale_insert)
                    else:
                        sale_ids.append(myresult[0])

                attraction_count = len(val_attractions)
                attraction_check = "SELECT attractions_id FROM attractions WHERE name= %s LIMIT 1"
                attraction_sql = "INSERT INTO attractions (name) VALUES (%s)"
                attraction_ids = []

                for attraction in val_attractions:
                    mycursor.execute(attraction_check, (attraction[0],))
                    myresult = mycursor.fetchall()
                    if not myresult:
                        mycursor.execute(attraction_sql, (attraction[0],))
                        attraction_insert = mycursor.lastrowid
                        print(attraction_insert)
                        if not isinstance(concert_id, int):
                            concert_id = concert_id[0]
                        print(concert_id)
                        if isinstance(concert_id, tuple):
                            concert_id = concert_id[0][0]
                        attraction_ids.append((concert_id, attraction_insert))
                    else:
                        print(myresult[0][0])
                        if not isinstance(concert_id, int):
                            concert_id = concert_id[0]
                        print(concert_id)
                        if isinstance(concert_id, tuple):
                            concert_id = concert_id[0]
                        attraction_ids.append((concert_id, myresult[0][0]))
                mydb.commit()
                mycursor.execute("SET FOREIGN_KEY_CHECKS=0")
                attraction_concert_check = "SELECT * FROM attractions_concerts WHERE attractions_id = %s AND concerts_id = %s LIMIT 1"
                attraction_concert_sql = "INSERT INTO attractions_concerts (attractions_id, concerts_id) VALUES (%s, %s)"
                mycursor.executemany(attraction_concert_check, attraction_ids)
                myresult = mycursor.fetchall()
                if not myresult:
                    mycursor.executemany(attraction_concert_sql, attraction_ids)
                mydb.commit()






