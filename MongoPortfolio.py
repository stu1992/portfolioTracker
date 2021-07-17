from pymongo import MongoClient

# testing Assets
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

def MongoGetDocument(user = 'Stu'):
    key = "'_id': {}".format(user)
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.portfolios.find_one({'_id': user})
    client.close()
def MongoGetUsers():
    userList = []
    client = MongoClient("localhost")
    db = client.portfolioTracker
    userDict = list(db.users.find({}, {'email':1, '_id' : 0}))
    for emailKey in userDict:
        userList.append(emailKey['email'])
    return userList

def MongoGetUserName(email):
    userList = []
    client = MongoClient("localhost")
    db = client.portfolioTracker
    userDict = list(db.users.find({'email': email}, {'name':1, '_id' : 0}))
    for name in userDict:
        userList.append(name['name'])
    return userList[0]

def MongoMarketScatter(data):
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.volume.replace_one({'_id': 'all'}, data)
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
