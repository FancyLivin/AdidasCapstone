from requests_html import HTMLSession
import bs4 
import requests 
import boto3 
import shutil
import os 
import time
from random import seed
from random import randint

s3 = boto3.resource(
    service_name='s3',
    region_name='us-west-1',
    aws_access_key_id='your credentails',
    aws_secret_access_key='your credentials '
)

brands = [ 
         'avia', 
         'hoka+one+one', 'brooks'] # list of brands 

urls = [ 
       'https://www.amazon.com/s?k=avia+running+shoes&ref=nb_sb_noss_2',   
       'https://www.amazon.com/s?k=hoka+one+one+running+shoes&ref=nb_sb_noss_2', 
       'https://www.amazon.com/s?k=brooks+running+shoes&ref=nb_sb_noss'] # links to amazon searches of brands 


seed(1)
j = -1 
asins = []
for brand in brands: 
    j = j + 1 
    time.sleep(randint(1,30))
   
    #url = 'https://www.amazon.com/s?k='+brand+'+running+shoes&cr1AFPV95HP4KA7&sprefix='+brand+'+running+shoes%2Caps%2C364&ref=nb_sb_noss'
    #url = 'https://www.amazon.com/s?k='+brand+'+running+shoes&crid=2GX3OHGLHY7J3&sprefix='+brand+'+running+shoes+%2Caps%2C162&ref=nb_sb_noss_2'
    print(urls[j])

    s = HTMLSession()
    r = s.get(urls[j])
    r.html.render(1)

    products = r.html.find('div[data-asin]')
    for product in products: 
        if product.attrs['data-asin'] != '':
            asins.append(product.attrs['data-asin'])

    print(asins) 

    for asin in asins: 
        time.sleep(randint(1,30))
        Headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,
        'referer':'https://www.google.com/'}

        URL_input = 'https://www.amazon.com/dp/'+ asin + '/ref=sr_1_2?crid=2SQNDJ1RDBJ11&keywords=nike+running+shoes&qid=1636174771&sprefix=nike+running+shoes%2Caps%2C113&sr=8-2'
        #URLdata = requests.get(URL_input, headers = Headers)
        #soup = bs4.BeautifulSoup(URLdata.text, "html.parser")

        r = requests.get(URL_input,headers=Headers)
        #r.html.render(sleep= randint(0,10))

        soup = bs4.BeautifulSoup(r.text, "html.parser")
        
        
        ImgTags = soup.find_all('img')


        title = soup.find("span", attrs= {"id":'productTitle'})
        title_value = title.string
        title_string = title_value.strip().replace(',', '')

        print(title_string) 

        i = 0 
        for link in ImgTags:

            try:
                images = link.get('src')

                if '._AC_US40_' in images: 
                    print(images)
                    i = i + 1 
                    parts = images.split('.')
                    images = parts[0] + '.' + parts[1] + '.' + parts[2] + '.' + parts[4]
                    print(images)
                else: 
                    continue
    
                time.sleep(randint(1,30))

                filename = title_string + str(i) + '.jpg'

                data = requests.get(images, stream=True)

                print(data.status_code)

                if data.status_code != 200: 
                    print('error in printing')
                elif data.status_code == 200: 

                    with open(filename, 'wb') as file:
                        shutil.copyfileobj(data.raw, file)
                        print('image copied')
                 
                    s3.Bucket('adidascapstone').upload_file(filename, brand + '/'+ filename)
                    print('image in bucket')

                    os.remove(filename)
                    print('image deleted') 
            except:
                pass
        
    asins.clear()
    print('\t\t\t Downloaded Successfully..\t\t ')



