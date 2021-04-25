import os
import json
import datetime
import requests
from yahoofinancials import YahooFinancials
from pymongo import MongoClient

class assetAPIFactory:
    def getPriceUSD(self, ticker):
        if ticker == "AAPL" or ticker == "VUG" or ticker == "GME":
            yahoo_financials = YahooFinancials(ticker)
            return YahooFinancials([ticker]).get_current_price()[ticker]
        elif ticker == "BIQ":
            return YahooFinancials([ticker+ ".AX"]).get_current_price()[ticker+ ".AX"]
        elif ticker == "BTC" or  ticker == "ETH":
            TICKER_API_URL = 'https://www.bitstamp.net/api/v2/ticker/' + ticker.lower() + "usd/"
            response = requests.get(TICKER_API_URL)
            response_json = response.json()
            return float(response_json['last'])

    def USCurrency(self, ticker):
        if ticker == "BIQ":
            return False
        else:
            return True

    def getExchangeRate(self):
        if not hasattr(self, 'exchangeRate'):
            API = 'http://api.exchangeratesapi.io/latest?access_key=c65663c506bc6d16fe81766cadde9918'
            response = requests.get(API)
            response_json = response.json()
            aud = response_json["rates"]['AUD']
            usd = response_json["rates"]['USD']
            self.exchangeRate = float(aud / usd)

        return self.exchangeRate
class asset:
    def __init__(self, jsonObj):
        self.Name = jsonObj['name']
        self.History = jsonObj['data']
        print(self.Name)
        print(self.History)

    def latest(self, value):
        self.History.append(value)
    def export(self):
        dict = {}
        dict['name'] = self.Name
        dict['data'] = self.History
        return dict

def MongoGetDocument(user = 'Stu'):
    key = "'_id': {}".format(user)
    client = MongoClient("localhost")
    db = client.portfolioTracker
    print(db.portfolio.find_one({'_id': user}))
    return db.portfolio.find_one({'_id': user})

def MongoPersistDocument(data, user = 'Stu'):
    key = {'_id': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.portfolio.find_one({}) == None:
        db.portfolio.insert_one(data)
    else:
        result=db.portfolio.replace_one(key, data)
    confirmEntry = db.portfolio.find_one({})
    print("from db\n\n\n")
    print(confirmEntry)

def FileGetDocument():
    file = 'db.json'
    f = open(file)
    obj = json.load(f)
    f.close()
    return obj

def FilePersistDocument(document):
    with open(file, 'w') as f:
        json.dump(document, f)
    f.close()
#obj = FileGetDocument()
obj = MongoGetDocument('Stu')
assets = []
for struct in obj['seriesdataset']:
    assets.append(asset(struct))
myPortfolio = obj['portfolio']
print(myPortfolio.keys())
dates = obj['dates']
print(dates)

assetFactory = assetAPIFactory()
for asset in assets:
    exchange = 1.0
    if assetFactory.USCurrency(asset.Name):
        exchange = assetFactory.getExchangeRate()
    print(exchange)
    localPrice = round(assetFactory.getPriceUSD(asset.Name) * myPortfolio[asset.Name] * exchange, 2)
    print(asset.Name + " " + str(localPrice))
    asset.latest(localPrice)
serialisableAssets = []
for asset in assets:
    serialisableAssets.append(asset.export())
date_object = datetime.date.today()
dates.append(str(date_object))
replacementObj = {'_id': 'Stu',
'portfolio' : myPortfolio,
'seriesdataset' : serialisableAssets,
'dates' : dates
}
print(replacementObj)
MongoPersistDocument(replacementObj)
#FilePersistDocument(replacementObj)
