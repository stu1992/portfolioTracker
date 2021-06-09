from pymongo import MongoClient

#constants
known_tickers = ["AAPL", "VUG", "GME", "VOO", "BIQ", "BTC", "ETH"]
#functions
def MongoMarketScatter():
    client = MongoClient("localhost")
    db = client.portfolioTracker
    #print(db.volume.find_one({'_id': 'all'}))
    return db.volume.find_one({'_id': 'all'})
    client.close()

def MongoGetDocument(user = 'stumay1992@gmail.com'):
    key = "'_id': {}".format(user)
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.portfolios.find_one({'_id': user})
    client.close()

def MongoPersistDocument(data, user = 'stumay1992@gmail.com'):
    key = {'_id': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.portfolios.find_one({}) == None:
        db.portfolios.insert_one(data)
    else:
        result=db.portfolios.replace_one(key, data)
    confirmEntry = db.portfolios.find_one({'_id': user})
    client.close()

def MongoPersistScatter(data):
    key = {'_id': 'all'}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.volume.find_one({}) == None:
        db.volume.insert_one(data)
    else:
        result=db.volume.replace_one(key, data)
    confirmEntry = db.volume.find_one(key)
    client.close()



email = input("Enter user email: ")
print("You entered: " + email)


#getting user info
user = MongoGetDocument(email)
stocks = user['portfolio'].keys()
for item in stocks:
    print(item + ", owning " + str(user['portfolio'][item]) + " shares")
ownedShares = 0
assetChoice = input("Enter ticker:")
if assetChoice not in stocks:
    if assetChoice in known_tickers:
        print("purchasing a new asset")
        user['portfolio'][assetChoice] = 0
        paddingLength = len(user['dates'])
        padding = []
        for i in range(paddingLength):
            padding.append(0)
        user['seriesdataset'].append({'name' : assetChoice, 'data' : padding})
        print(user['seriesdataset'])
    else:
        print("exit program. ensure getters/setters are defined in portfolio.py")
        exit()
else:
    ownedShares = user['portfolio'][assetChoice]
    print("available shares: "+ str(ownedShares))
action = input("(buy|sell):")
if action != "buy" and action != "sell":
    print("exit program. Action not correct.")
    exit()
volume = round(float(input("how many:")),8)
if str(volume)[-2:] == '.0': # if the volume is a integer, we won't persist trailing zeros.
    print("converting floag to int")
    volume = int(volume)
newOwned = 0
if action == "sell" and volume > ownedShares:
    print("exit program. ensure shares are available.")
    exit()
if action == "sell":
    newOwned = ownedShares - volume
elif action == "buy":
    newOwned = ownedShares + volume
price = round(float(input("estimated total AUD price of " + action + " order:")),2)


user['portfolio'][assetChoice]=newOwned
print(user['portfolio'])

graphPoint = MongoGetDocument("Market")
managedList = 0
for list in graphPoint['seriesdataset']:
    if list['name'] == "Managed Assets":
        managedList= list['data']
dataLength = len(managedList)
allAssets = round(managedList[dataLength-1], 2)
date = graphPoint['dates'][dataLength-1]

scatterData = MongoMarketScatter()
scatterData["endValue"].append(allAssets)
scatterData["date"].append(date)
scatterData["volume"].append(price)
print(scatterData)
happy = input("persist to db?(yes|no):")
if(happy == "yes"):
    MongoPersistDocument(user, email)
    MongoPersistScatter(scatterData)
else:
    exit()
