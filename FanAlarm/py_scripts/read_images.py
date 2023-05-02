from distutils.file_util import write_file
import fileinput
import base64
import mysql.connector
from mysql.connector import Error
from config import SQL_DB, SQL_HOSTNAME, SQL_PASSWORD, SQL_USERNAME


def create_server_connection(host_name, user_name, user_password, data_base):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=data_base
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection


connection = create_server_connection(
    SQL_HOSTNAME, SQL_USERNAME, SQL_PASSWORD, SQL_DB)

def readBLOB(emp_id):
    print("Reading BLOB data from python_employee table")

    try:
        cursor = connection.cursor()
        sql_fetch_blob_query = """SELECT * from posts_fanalarm where id_fanalarm = %s"""

        cursor.execute(sql_fetch_blob_query, (emp_id,))
        record = cursor.fetchall()
        for row in record:
            print("Id = ", row[0], )
            image = row[1]
            print("Storing employee image and bio-data on disk \n")
        with open("imageToSave.png", "wb") as fh:
            fh.write(image)
            

    except mysql.connector.Error as error:
        print("Failed to read BLOB data from MySQL table {}".format(error))

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")


readBLOB(1)
