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
import mysql.connector
from mysql.connector import Error
import pandas as pd

ssl._create_default_https_context = ssl._create_unverified_context

connection = create_server_connection("localhost", "root", pw)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get('https://www.instagram.com')


# username
acc_name = "_gui_pat"
username = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='username']")))
# password
passw = "Malachi3:10"
password = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))

# enter username and password
username.clear()
username.send_keys(acc_name)

password.clear()
password.send_keys(passw)
time.sleep(2)

# login button and click it
button = WebDriverWait(driver, 2).until(EC.element_to_be_clickable(
    (By.CSS_SELECTOR, "button[type='submit']"))).click()


time.sleep(2)
# Not Now button
alert = WebDriverWait(driver, 15).until(EC.element_to_be_clickable(
    (By.XPATH, '//button[contains(text(), "Not Now")]'))).click()

keyword = "jedcal"
driver.get('https://www.instagram.com/'+ keyword)

yElem = WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),"+keyword+")]")))


images_links = driver.find_elements(By.TAG_NAME, 'a')
images_links = [a.get_attribute('href') for a in images_links]
# narrow down all links to image links only
images_links = [a for a in images_links if str(
    a).startswith("https://www.instagram.com/p/")]


path = os.getcwd()
path = os.path.join(path, keyword)

# for directory
isExist = os.path.exists(path)
if not isExist:
    os.mkdir(path)

counter = 0

# for downloading images
for image in images_links:
    driver.get(image)
    newElem = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(),"+keyword+")]")))
    images_this = driver.find_elements(
        By.XPATH, 'img[srcset]')
    for imagethis in images_this:
        imagethis = imagethis.get_attribute("src")
        if imagethis.startswith("https://scontent-lga3-1.cdninstagram.com/"):
            save_as = os.path.join(path, keyword + str(counter) + '.jpg')
            wget.download(imagethis, save_as)
            counter += 1


time.sleep(30)
driver.close()


def create_server_connection(host_name, user_name, user_password):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection


def create_database(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        print("Database created successfully")
    except Error as err:
        print(f"Error: '{err}'")
