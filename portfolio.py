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
class Asset:
    def __init__(self, jsonObj):
        self.Name = jsonObj['name']
        self.History = jsonObj['data']

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
    client.close()

def MongoPersistDocument(data, user = 'Stu'):
    key = {'_id': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.portfolio.find_one({}) == None:
        db.portfolio.insert_one(data)
    else:
        result=db.portfolio.replace_one(key, data)
    confirmEntry = db.portfolio.find_one({'_id': user})
    client.close()

userList = ['Stu', 'Kiana']
for user in userList:
    print("updating for "+ user)
    obj = MongoGetDocument(user)
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']

    assetFactory = assetAPIFactory()
    for asset in assets:
        exchange = 1.0
        if assetFactory.USCurrency(asset.Name):
            exchange = assetFactory.getExchangeRate()
        localPrice = round(assetFactory.getPriceUSD(asset.Name) * myPortfolio[asset.Name] * exchange, 2)
        print(asset.Name + " " + str(localPrice))
        asset.latest(localPrice)
    serialisableAssets = []
    for asset in assets:
        serialisableAssets.append(asset.export())
    date_object = datetime.date.today()
    dates.append(str(date_object))
    replacementObj = {'_id': user,
    'portfolio' : myPortfolio,
    'seriesdataset' : serialisableAssets,
    'dates' : dates
    }
    MongoPersistDocument(replacementObj, user)
