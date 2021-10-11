
import bs4
import requests
import shutil
import os
import boto3
import time

s3 = boto3.resource(
    service_name='s3',
    region_name='us-east-2',
    aws_access_key_id='AKIA5QEOO5ZIE7DHPJGP',
    aws_secret_access_key='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'
)

brands = ['nike', 'adidas', 'new+balance', 'jordan', 'fila', 'reebok', 
         'asics', 'champion', 'under+armour', 'skechers', 'saucony', 
         'avia', 'colombia', 'fubu', 'shaq', 'puma', 'salomon', 'umbro',
         'hoka+one+one', 'brooks']

GOOGLE_IMAGE = \
    'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1873&bih=990&'

BING_IMAGE = \
    'https://www.bing.com/images/search?'


def extractg(data, quantity):
    name = data
    URL_input = GOOGLE_IMAGE + 'q=' + data + '+shoes'
    print('Fetching from url =', URL_input)
    URLdata = requests.get(URL_input)
    soup = bs4.BeautifulSoup(URLdata.text, "html.parser")
    ImgTags = soup.find_all('img')
    i = 0
    print('Please wait..')
    while i < quantity:

        for link in ImgTags:
            try:
                images = link.get('src')
                ext = images[images.rindex('.'):]
                if ext.startswith('.png'):
                    ext = '.png'
                elif ext.startswith('.jpg'):
                    ext = '.jpg'
                elif ext.startswith('.jfif'):
                    ext = '.jfif'
                elif ext.startswith('.com'):
                    ext = '.jpg'
                elif ext.startswith('.svg'):
                    ext = '.svg'
                data = requests.get(images, stream=True)

                filename = 'google' + name + str(i) + ext

                with open(filename, 'wb') as file:
                    shutil.copyfileobj(data.raw, file)
                    print('image copied')
                 
                s3.Bucket('baalfaro').upload_file(filename, 'google/' + name +'/' + filename)
                print('image in bucket')

                os.remove(filename)
                print('image deleted')

                i += 1
            except:
                pass
    print('\t\t\t Downloaded Successfully..\t\t ')



def extractb(data, quantity):
    name = data 
    URL_input = BING_IMAGE + 'q=' + data + '+shoes'
    print('Fetching from url =', URL_input)
    URLdata = requests.get(URL_input)
    soup = bs4.BeautifulSoup(URLdata.text, "html.parser")
    ImgTags = soup.find_all('img')
    i = 0
    print('Please wait..')
    while i < quantity:

        for link in ImgTags:
            try:
                images = link.get('src')
                ext = images[images.rindex('.'):]
                if ext.startswith('.png'):
                    ext = '.png'
                elif ext.startswith('.jpg'):
                    ext = '.jpg'
                elif ext.startswith('.jfif'):
                    ext = '.jfif'
                elif ext.startswith('.com'):
                    ext = '.jpg'
                elif ext.startswith('.svg'):
                    ext = '.svg'
                elif ext.startswith('.7'):
                    ext = '.jpg'
                elif ext.startswith('.7&mkt=en-US&adlt=moderate'):
                    ext = '.jpg'
                

                data = requests.get(images, stream=True)
                filename = 'bing' + name + str(i) + ext

                with open(filename, 'wb') as file:
                    shutil.copyfileobj(data.raw, file)
                    print('image copied')

                s3.Bucket('baalfaro').upload_file(filename, 'bing/' + name +'/' + filename)
                print( 'image in bucket ')

                os.remove(filename)
                print('image delted')

                i += 1
            except:
                pass
    print('\t\t\t Downloaded Successfully..\t\t ')

for x in brands: 
    time.sleep(5)
    data = x
    quantityb =  100 # how many photos you want bing 
    quantityg =  100 # google 
    extractg(data, quantityg)
    extractb(data, quantityb)