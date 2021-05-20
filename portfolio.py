import os
import json
import datetime
import requests
from yahoofinancials import YahooFinancials
from pymongo import MongoClient

class assetAPIFactory:
    cachedPrices = {}
    def getPriceUSD(self, ticker):
        if ticker in self.cachedPrices:
            print("using cache for " + ticker)
            return self.cachedPrices[ticker]

        elif ticker == "AAPL" or ticker == "VUG" or ticker == "GME" or ticker == "VOO":
            yahoo_financials = YahooFinancials(ticker)
            self.cachedPrices[ticker] = YahooFinancials([ticker]).get_current_price()[ticker]
            return self.cachedPrices[ticker]
        elif ticker == "BIQ":
            self.cachedPrices[ticker] = YahooFinancials([ticker+ ".AX"]).get_current_price()[ticker+ ".AX"]
            return self.cachedPrices[ticker]
        elif ticker == "BTC" or  ticker == "ETH":
            TICKER_API_URL = 'https://www.bitstamp.net/api/v2/ticker/' + ticker.lower() + "usd/"
            response = requests.get(TICKER_API_URL)
            response_json = response.json()
            self.cachedPrices[ticker] = float(response_json['last'])
            return self.cachedPrices[ticker]

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
    return db.portfolios.find_one({'_id': user})
    client.close()

def MongoPersistDocument(data, user = 'Stu'):
    key = {'_id': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.portfolios.find_one({}) == None:
        db.portfolios.insert_one(data)
    else:
        result=db.portfolios.replace_one(key, data)
    confirmEntry = db.portfolios.find_one({'_id': user})
    client.close()

assetFactory = assetAPIFactory()
totalValue = 0
userList = ['Stumay1992@gmail.com', 'Kiana@gmail.com']
for user in userList:
    print("updating for "+ user)
    obj = MongoGetDocument(user)
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']

    for asset in assets:
        exchange = 1.0
        if assetFactory.USCurrency(asset.Name):
            exchange = assetFactory.getExchangeRate()
        localPrice = round(assetFactory.getPriceUSD(asset.Name) * myPortfolio[asset.Name] * exchange, 2)
        totalValue = totalValue + localPrice
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
# poplulate market object

print("comparing to the \'Market\'")
obj = MongoGetDocument('Market')
assets = []
for struct in obj['seriesdataset']:
    assets.append(Asset(struct))
myPortfolio = obj['portfolio']
dates = obj['dates']
# get the day
date_object = datetime.date.today()
if date_object.day == 1: # I want to rebalance the portfolio on a monthly bases so I don't gete wrecked my the market out performing me.
    print("first of the month.. Rebalance")
    # my 'Market' portfolio is going to just buy all the S&P shares I could afford
    exchange = assetFactory.getExchangeRate()
    localPrice = round(assetFactory.getPriceUSD('VOO') * exchange , 2)
    print("VOO price: " + str(localPrice))
    shares = round((totalValue / localPrice), 0)
    print("\'buying\' " + str(shares) + " VOO shares")
    myPortfolio['VOO'] = shares
    # buy the shares
    for asset in assets:
        if asset.Name == 'VOO':
            localPrice = round(assetFactory.getPriceUSD('VOO') * myPortfolio['VOO'] * exchange , 2)
            asset.latest(localPrice * myPortfolio['VOO'])
    print("s&p rebalanced")
    # I'm going to 'create' an asset that perfectly grows by long term market average
    for asset in assets:
        if asset.Name == 'Average':
            asset.latest(totalValue)
    # update my 'total assets under management' price
    for asset in assets:
        if asset.Name == 'Managed Assets':
            print("total managed assets are " + str(totalValue))
            asset.latest(totalValue)
else:
    for asset in assets:
        if asset.Name == 'VOO':
            exchange = assetFactory.getExchangeRate()
            localPrice = round(assetFactory.getPriceUSD('VOO') * myPortfolio['VOO'] * exchange , 2)
            asset.latest(localPrice)
        elif asset.Name == 'Managed Assets':
            asset.latest(totalValue)
        elif asset.Name == 'Average':
            latest = asset.History[-1]
            print("yesterday was " + str(latest))
            asset.latest(round(latest* 1.002931507, 6)) #the idea here is to get a 7% return in a year
            latest = asset.History[-1]
            print("today is " + str(latest))
# persist data
serialisableAssets = []
for asset in assets:
    serialisableAssets.append(asset.export())
date_object = datetime.date.today()
dates.append(str(date_object))
replacementObj = {'_id': 'Market',
'portfolio' : myPortfolio,
'seriesdataset' : serialisableAssets,
'dates' : dates
}
MongoPersistDocument(replacementObj, 'Market')
