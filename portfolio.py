#!/usr/bin/python3
import os
import json
from datetime import timedelta, date
import requests
from yahoofinancials import YahooFinancials
import MongoPortfolio
import logging
import logging.handlers
from AssetAPIFactory import AssetAPIFactory
import os
import random
from Email import Mail
import changes
import SystemStatus
import time

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
class state:
  def __init__(self, user):
    self.user = user
    self.message = "none"
  def getUser(self):
    return self.user
  def setMessage(self, message):
    self.message = message
  def getMessage(self):
    return self.message
  def mongoData(self, mongoData):
    self.mongoData = mongoData
  def getMongoData(self):
    return self.mongoData

serverState = []
def updatePortfolio(assetAdapter, dateAdapter, emailAdapter):
    logging.info("\n\nGood mornging!\ndate: {}".format(date_object))
    userList = MongoPortfolio.MongoGetUsers()
    totalValue = 0
    for user in userList:
        preparedState = state(user)
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
            if len(asset.History) > 0:
              userPreviousGrossValue += asset.History[-1]
            exchange = 1.0
            if assetFactory.USCurrency(asset.Name):
                exchange = global_exchange
            localPrice = round(assetFactory.getPriceUSD(asset.Name) * myPortfolio[asset.Name] * exchange, 2)
            userGrossValue += localPrice
            totalValue = totalValue + localPrice
            logging.debug(asset.Name + " " + str(localPrice))
            asset.latest(localPrice)
        logging.debug("previous account value " + str(userPreviousGrossValue))
        logging.debug("new account value " + str(userGrossValue))
        if userPreviousGrossValue !=0 and userGrossValue !=0 and len(dates) > 60: # samples should just be one catch for the above stuff too
          deviation, mean, samples = changes.checkDeviation(user)
          logging.debug("number of samples: " + str(samples))
          if samples > 60:
            logging.debug("standart deviation: " + str(round(deviation,2)) + " mean: " + str(round(mean,2)))
            logging.debug("ceiling is "+ str(round(mean+deviation,2)) + "% floor is " + str(round(mean-deviation,2)) + "%")
            # check plus or minus 5% to tell user
            dailyChange = ((userGrossValue - userPreviousGrossValue) / userPreviousGrossValue) * 100
            logging.debug("daily percentage change: " + str(round(dailyChange,2)))
            if dailyChange >= (round(mean+deviation, 2)):
                logging.info("user up by 95th percentile")
                preparedState.setMessage("up")
                #emailObj.sendHigh(emailTo=user, user=MongoPortfolio.MongoGetUserName(user))
            elif dailyChange <= (round(mean-deviation,2)):
                logging.info("user down by 95th percentile")
                preparedState.setMessage("down")
                #emailObj.sendLow(emailTo=user, user=MongoPortfolio.MongoGetUserName(user))
        serialisableAssets = []
        for asset in assets:
            serialisableAssets.append(asset.export())
        dates.append(str(date_object.strftime("%Y/%m/%d")))
        replacementObj = {'_id': user,
        'portfolio' : myPortfolio,
        'seriesdataset' : serialisableAssets,
        'dates' : dates
        }
        preparedState.mongoData(replacementObj)
        #MongoPortfolio.MongoPersistDocument(replacementObj, user)
        serverState.append(preparedState)
    # poplulate market object

    logging.debug("comparing to the \'Market\'")
    obj = MongoPortfolio.MongoGetDocument('Market')
    preparedState = state("Market")
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']
    # get the day
    rebalance = False
    if date_object.day == 1: # I want to rebalance the portfolio on a monthly bases so I don't get wrecked my the market out performing me.
        logging.info("first of the month.. ")
        marketAssets = MongoPortfolio.MongoGetDocument("Market")['seriesdataset']
        vix = []
        for asset in marketAssets:
            if asset['name'] == "VIX":
                vix = asset['data']
        a = vix[-30:]
        b = vix[-60:-30]
        c = vix[-90:-60]
        d = vix[-120:-90]
        e = vix[-150:-120]
        f = vix[-180:-150]
        avg6 = int((sum(f) / len(f)))
        avg5 = int((sum(e) / len(e)))
        avg4 = int((sum(d) / len(d)))
        avg3 = int((sum(c) / len(c)))
        avg2 = int((sum(b) / len(b)))
        avg1 = int((sum(a) / len(a)))
        logging.info("vix last 6 months: "+str(avg1)+ " " + str(avg2) + " " + str(avg3) + " " + str(avg4) + " " + str(avg5) + " " + str(avg6))
        h6 = avg6 > 15
        h5 = avg5 > 15
        h4 = avg4 > 15
        h3 = avg3 > 15
        h2 = avg2 > 15
        h1 =  avg1 > 15

        step = 15
        logging.info("monthly vix average is " + str(avg1))
        if h1:
            step += 2
            logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
            if avg1 < step:
                rebalance = True
                logging.info("rebalancing")
            if h2 and rebalance == False:
                step += 2
                logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
                if avg1 < step:
                    rebalance = True
                    logging.info("rebalancing")
                if h3 and rebalance == False:
                    step += 2
                    logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
                    if avg1 < step:
                        realance = True
                        logging.info("rebalancing")
                    if h4 and rebalance == False:
                        step += 2
                        logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
                        if avg1 < step:
                            rebalance = True
                            logging.info("rebalancing")
                        if h5 and rebalance == False:
                            step += 2
                            logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
                            if avg1 < step:
                                rebalance = True
                                logging.info("rebalancing")
                            if h6 and rebalance == False:
                                step += 2
                                logging.info("raising by 2 to " + str(step) + " against "+ str(avg1))
                                if avg1 < step:
                                    rebalance = True
                                    logging.info("rebalancing")
                                else:
                                    logging.info("will not rebalance")

    if rebalance == True:
        logging.info("Rebalancing")
        # my 'Market' portfolio is going to just buy all the S&P shares I could afford
        exchange = assetFactory.getExchangeRate()
        localPrice = round(assetFactory.getPriceUSD('VOO') * exchange , 2)
        logging.info("VOO price: " + str(localPrice))
        shares = int(totalValue / localPrice)
        logging.info("\'buying\' " + str(shares) + " VOO shares")
        myPortfolio['VOO'] = shares
        # buy the shares
        for asset in assets:
            if asset.Name == 'VOO':
                localPrice = round(assetFactory.getPriceUSD('VOO') * exchange , 2)
                asset.latest(localPrice * myPortfolio['VOO'])
        logging.info("s&p rebalanced")
        # I'm going to 'create' an asset that perfectly grows by long term market average
        for asset in assets:
            if asset.Name == 'Average':
                asset.latest(totalValue)
        # update my 'total assets under management' price
        for asset in assets:
            if asset.Name == 'Managed Assets':
                logging.info("total managed assets are " + str(totalValue))
                asset.latest(totalValue)
        for asset in assets:
            if asset.Name == 'VIX':
                vix = round(assetFactory.getPriceUSD('VIX'), 2)
                logging.debug("VIX today is " + str(vix))
                asset.latest(vix)

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
                logging.debug("market yesterday was " + str(latest))
                asset.latest(round(latest* 1.000185395, 6)) #the idea here is to get a 7% return in a year
                latest = asset.History[-1]
                logging.debug("market today is " + str(latest))
            elif  asset.Name == 'VIX':
                vix = round(assetFactory.getPriceUSD('VIX'), 2)
                asset.latest(vix)
                logging.debug("VIX today is " + str(vix))
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
    preparedState.mongoData(replacementObj)
    serverState.append(preparedState)
    #MongoPortfolio.MongoPersistDocument(replacementObj, 'Market')


system_status = SystemStatus.SystemStatus()
handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "./log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()
root.setLevel(os.environ.get("LOGLEVEL", "INFO"))
logging.getLogger('requests').setLevel(logging.ERROR)
logging.getLogger('urllib3').setLevel(logging.ERROR)
root.addHandler(handler)

emailObj = None
assetFactory = None
date_object = None


assetFactory = AssetAPIFactory()
emailObj = Mail(logging)
date_object = date.today()

global_exchange = assetFactory.getExchangeRate()
# while mutex != True
# try except wait
retries = 3 * 12
retry = 0
while system_status.get_mutex() == False:
  start = time.time()
  try:
    updatePortfolio(assetFactory, date_object, emailObj) # this should throw exceptions. Once it's passed we assume the data is safe
    for user in serverState:
      if user.getMessage() == "up":
        logging.info(user.getUser() + " up")
        emailObj.sendHigh(emailTo=user.getUser(), user=MongoPortfolio.MongoGetUserName(user.getUser()))
      if user.getMessage() == "down":
        logging.info(user.getUser() + " down")
        emailObj.sendLow(emailTo=user.getUser(), user=MongoPortfolio.MongoGetUserName(user.getUser()))
      MongoPortfolio.MongoPersistDocument(user.getMongoData(), user.getUser())
    system_status.status_success()
    end = time.time()
    logging.info("Elapsed time for portfolioTracker is " + str(round((end-start),4)) + " seconds")
    f = open('/home/ubuntu/portfoliotracker','a')
    f.write(str(round((end-start),4)) + "\n")
    f.close()
    break
  except Exception as e:
    system_status.status_failure()
    logging.error("something crashed-" +str(e))
    retry += 1
    logging.error("Retry " + str(retry))
    if retry > retries:
      logging.error("ERROR: unable to recover")
      break
    time.sleep(60*20)
