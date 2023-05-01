# import all the modules
import os
import wget
import mysql.connector
from mysql.connector import Error
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common import exceptions
import time
import ssl
import pandas as pd
from config import SQL_HOSTNAME, SQL_USERNAME, SQL_PASSWORD, SQL_DB, IG_PASSWORD, IG_USERNAME
ssl._create_default_https_context = ssl._create_unverified_context


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


connection = create_server_connection(SQL_HOSTNAME, SQL_USERNAME, SQL_PASSWORD, SQL_DB)

def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData


def insertBLOB(photo):
    print("Inserting BLOB into python_employee table")
    try:

        cursor = connection.cursor()
        sql_insert_blob_query = """ INSERT INTO posts_fanalarm
                          (posts_images, caption) VALUES (%s, %s)"""

        empPicture = convertToBinaryData(photo)

        # Convert data into tuple format
        insert_blob_tuple = (empPicture, "")
        result = cursor.execute(sql_insert_blob_query, insert_blob_tuple)
        connection.commit()
        print("Image inserted successfully as a BLOB into posts_fanalarm table", result)

    except mysql.connector.Error as error:
        print("Failed inserting BLOB data into MySQL table {}".format(error))

def closeConnection():
        if connection.is_connected():
            connection.cursor.close()
            connection.close()
            print("MySQL connection is closed")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get('https://www.instagram.com')

username = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='username']")))

password = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))

username.clear()
username.send_keys(IG_USERNAME)

password.clear()
password.send_keys(IG_PASSWORD)
time.sleep(2)

button = WebDriverWait(driver, 2).until(EC.element_to_be_clickable(
    (By.CSS_SELECTOR, "button[type='submit']"))).click()

time.sleep(2)
login = WebDriverWait(driver, 15).until(EC.element_to_be_clickable(
    (By.XPATH, '//div[contains(text(), "Not Now")]'))).click()

time.sleep(2)
element_notnow = driver.find_element(
    By.XPATH, '//button[contains(text(), "Not Now")]')
if element_notnow.is_displayed():
    alert = WebDriverWait(driver, 15).until(EC.element_to_be_clickable(
        (By.XPATH, '//button[contains(text(), "Not Now")]'))).click()

keyword = "jedcal"
driver.get('https://www.instagram.com/'+ keyword)

yElem = WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),"+keyword+")]")))

images_links = driver.find_elements(By.TAG_NAME, 'a')
images_links = [a.get_attribute('href') for a in images_links]
images_links = [a for a in images_links if str(a).startswith("https://www.instagram.com/p/")]

path = os.getcwd()
path = os.path.join(path, keyword)
isExist = os.path.exists(path)
if not isExist:
   os.mkdir(path)
counter = 0
image_download = []
# for downloading images
for image in images_links:
    driver.get(image)
    newElem = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(),"+keyword+")]")))
    time.sleep(2)
    images_this = driver.find_elements(
        By.XPATH, "//*[not(ancestor::a)]/img")
    for imagethis in images_this:
        imagethis = imagethis.get_attribute("src")
        if imagethis.startswith("https://scontent.cdninstagram.com/"):
            save_as = os.path.join(path, keyword + str(counter) + '.jpg')
            image_download = wget.download(imagethis, save_as)
            insertBLOB(image_download)
            print("here 2")
            counter += 1


time.sleep(30)
driver.close()
closeConnection()