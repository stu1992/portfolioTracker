import os
import json
from datetime import timedelta, date
import requests
from yahoofinancials import YahooFinancials
import MongoPortfolio
import logging
import logging.handlers
import TestAssetAPIFactory as testAPI
import AssetAPIFactory as AssetAPIFactory
import TestMail as testingMail
import os
import random
from Email import Mail

testing = True


StartMarket = {
    "_id" : "Market",
    "portfolio" : {
        "Average" : 1.0,
        "VOO" : 33.0,
        "Managed Assets" : 1.0
    },
    "seriesdataset" : [
        {
            "name" : "Average",
            "data" : [
                8755.6
            ]
        },
        {
            "name" : "VOO",
            "data" : [
                257.56
            ]
        },
        {
            "name" : "Managed Assets",
            "data" : [
                9044.69
            ]
        }
    ],
    "dates" : [
        "2016/06/01"
    ]
}

start1 ={
    "_id" : "stumay1992@gmail.com",
    "portfolio" : {
        "BTC" : 0.08313852,
        "ETH" : 0.41915205,
        "AAPL" : 147.877006334,
        "VUG" : 10,
        "GME" : 2,
        "BIQ" : 4025
    },
    "seriesdataset" : [
        {
            "name" : "AAPL",
            "data" : [
                4749.67
            ]
        },
        {
            "name" : "VUG",
            "data" : [
                1428.29
            ]
        },
        {
            "name" : "BTC",
            "data" : [
                57.79
            ]
        },
        {
            "name" : "GME",
            "data" : [
                510.83
            ]
        },
        {
            "name" : "BIQ",
            "data" : [
                2274.12
            ]
        },
        {
            "name" : "ETH",
            "data" : [
                7.7
            ]
        }
    ],
    "dates" : [
        "2016/06/01"
    ]
}

start2 ={
    "_id" : "stu.may1992@gmail.com",
    "portfolio" : {
        "BTC" : 0.01463536,
        "ETH" : 0.0999766
    },
    "seriesdataset" : [
        {
            "name" : "BTC",
            "data" : [
                10.32
            ]
        },
        {
            "name" : "ETH",
            "data" : [
                1.89
            ]
        }
    ],
    "dates" : [
        "2016/06/01"
    ]
}

start3 ={
    "_id" : "stu.may.1992@gmail.com",
    "portfolio" : {
        "AAPL" : 0.122993666
    },
    "seriesdataset" : [
        {
            "name" : "AAPL",
            "data" : [
                4.01
            ]
        }
    ],
    "dates" : [
        "2016/06/01"
    ]
}

startScatter =     {
    "_id" : "all",
    "endValue" : [

    ],
    "date" : [

    ],
    "volume" : [

    ]
}



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

def updatePortfolio(assetAdapter, dateAdapter, emailAdapter):
    logging.debug("\n\n Good mornging!\ndate: {}".format(date_object))
    userList = MongoPortfolio.MongoGetUsers()
    totalValue = 0
    for user in userList:
        userPreviousGrossValue = 0
        userGrossValue = 0 # this is a test feature to see if the users assets went up a certain amount
        logging.info("updating for "+ user)
        obj = MongoPortfolio.MongoGetDocument(user)
        assets = []
        for struct in obj['seriesdataset']:
            assets.append(Asset(struct))
        myPortfolio = obj['portfolio']
        dates = obj['dates']

        for asset in assets:
            userPreviousGrossValue += asset.History[-1]
            exchange = 1.0
            if assetFactory.USCurrency(asset.Name):
                exchange = global_exchange
            localPrice = round(assetFactory.getPriceUSD(asset.Name) * myPortfolio[asset.Name] * exchange, 2)
            userGrossValue += localPrice
            totalValue = totalValue + localPrice
            logging.info(asset.Name + " " + str(localPrice))
            asset.latest(localPrice)
        logging.info("previous account value " + str(userPreviousGrossValue))
        logging.info("new account value " + str(userGrossValue))
        # check plus or minus 5% to tell user
        plus5 = userPreviousGrossValue * 1.05
        minus5 = userPreviousGrossValue * 0.95
        if userGrossValue >= plus5:
            logging.info("user up by >5%")
            emailObj.sendHigh(emailTo='stumay1992@gmail.com', user=MongoPortfolio.MongoGetUserName(user))
        elif userGrossValue <= minus5:
            logging.info("user down by >5%")
            emailObj.sendLow(emailTo='stumay1992@gmail.com', user=MongoPortfolio.MongoGetUserName(user))
        serialisableAssets = []
        for asset in assets:
            serialisableAssets.append(asset.export())
        dates.append(str(date_object.strftime("%Y/%m/%d")))
        replacementObj = {'_id': user,
        'portfolio' : myPortfolio,
        'seriesdataset' : serialisableAssets,
        'dates' : dates
        }
        MongoPortfolio.MongoPersistDocument(replacementObj, user)
    # poplulate market object

    logging.debug("comparing to the \'Market\'")
    obj = MongoPortfolio.MongoGetDocument('Market')
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']
    # get the day

    rebalance = False
    if date_object.day == 1: # I want to rebalance the portfolio on a monthly bases so I don't gete wrecked my the market out performing me.
        monthOfPrices = YahooFinancials(['^VIX']).get_historical_price_data(str((date_object - timedelta(days = 30)).strftime("%Y-%m-%d")), str(date_object.strftime("%Y-%m-%d")), 'daily')['^VIX']['prices']
        sum = 0
        for price in monthOfPrices:
            sum += price['close']
        logging.info("average:" + str(sum/30))
        if sum/30 < 12: # 12 is low, 20 is high
            logging.info("rebalance")
            rebalance = True
    if rebalance == True:
        logging.info("first of the month.. Rebalance")
        # my 'Market' portfolio is going to just buy all the S&P shares I could afford
        exchange = assetFactory.getExchangeRate()
        localPrice = round(assetFactory.getPriceUSD('VOO') * exchange , 2)
        logging.debug("VOO price: " + str(localPrice))
        shares = int(totalValue / localPrice)
        logging.debug("\'buying\' " + str(shares) + " VOO shares")
        myPortfolio['VOO'] = shares
        # buy the shares
        for asset in assets:
            if asset.Name == 'VOO':
                localPrice = round(assetFactory.getPriceUSD('VOO') * exchange , 2)
                asset.latest(localPrice * myPortfolio['VOO'])
        logging.debug("s&p rebalanced")
        # I'm going to 'create' an asset that perfectly grows by long term market average
        for asset in assets:
            if asset.Name == 'Average':
                asset.latest(totalValue)
        # update my 'total assets under management' price
        for asset in assets:
            if asset.Name == 'Managed Assets':
                logging.debug("total managed assets are " + str(totalValue))
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
                logging.debug("yesterday was " + str(latest))
                asset.latest(round(latest* 1.000185395, 6)) #the idea here is to get a 7% return in a year
                latest = asset.History[-1]
                logging.debug("today is " + str(latest))
    # persist data
    serialisableAssets = []
    for asset in assets:
        serialisableAssets.append(asset.export())
    dates.append(str(date_object.strftime("%Y/%m/%d")))
    replacementObj = {'_id': 'Market',
    'portfolio' : myPortfolio,
    'seriesdataset' : serialisableAssets,
    'dates' : dates
    }
    assetFactory.clear()
    MongoPortfolio.MongoPersistDocument(replacementObj, 'Market')

def daterange():
    for n in range(int ((date(2021, 6, 1) - date(2016, 6, 1)).days)):
        yield date(2016, 6, 1) + timedelta(n)

dateGen = daterange()

handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "./log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()
root.setLevel(os.environ.get("LOGLEVEL", "DEBUG"))
root.addHandler(handler)

emailObj = None
assetFactory = None
date_object = None



if(testing):
    MongoPortfolio.MongoPersistDocument(start1, "stumay1992@gmail.com")
    MongoPortfolio.MongoPersistDocument(StartMarket, "Market")
    MongoPortfolio.MongoPersistDocument(start2,  "stu.may1992@gmail.com")
    MongoPortfolio.MongoPersistDocument(start3, "stu.may.1992@gmail.com")
    MongoPortfolio.MongoMarketScatter(startScatter)

    assetFactory = testAPI.assetAPIFactory()
    emailObj = testingMail.TestMail(logging)
    date_object = next(dateGen)
else:
    assetFactory = assetAPIFactory()
    emailObj = testingMail.TestMail(logging)
    date_object = date.today()

if(testing):
    for a in range(300):
        assetFactory.getExchangeRate()
        assetFactory.getPriceUSD('AAPL')
        assetFactory.getPriceUSD('VUG')
        assetFactory.getPriceUSD('VOO')
        assetFactory.getPriceUSD('BTC')
        assetFactory.getPriceUSD('ETH')
        assetFactory.getPriceUSD('GME')
        next(dateGen)

if(testing):
    for i in range(900):
        if random.randint(1,25) == 25:
            file = "buy" + str(random.randint(1,7))
            os.system("python3 DAO.py < " + file)
        global_exchange = assetFactory.getExchangeRate()
        date_object = next(dateGen)
        updatePortfolio(assetFactory, date_object, emailObj)
if( not testing):
    global_exchange = assetFactory.getExchangeRate()
    updatePortfolio(assetFactory, date_object, emailObj)
