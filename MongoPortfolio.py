from pymongo import MongoClient


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
    userDict = list(db.users.find({'enabled' : "true"}, {'email':1, '_id' : 0}))
    for emailKey in userDict:
        userList.append(emailKey['email'])
    return userList

def MongoGetOrders():
    orderList = []
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return list(db.orders.find({},{'_id' : 0, '__v':0}))

def MongoDeleteOrders():
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.orders.remove()

def MongoGetUser(email):
    client=MongoClient("localhost")
    db=client.portfolioTracker
    return db.users.find_one({'email':email})
    client.close()

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


def MongoGetScatter(email):
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.volume.find_one({'_id': email})
    client.close()

def MongoPersistScatter(data, user):
    key = {'_id': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    if db.volume.find_one({}) == None:
        db.volume.insert_one(data)
    else:
        result=db.volume.replace_one(key, data)
    confirmEntry = db.volume.find_one(key)
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

def MongoPersistUser(data, user = 'stumay1992@gmail.com'):
    key = {'email': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    result=db.users.replace_one(key, data)
    confirmEntry = db.users.find_one({'email': user})
    client.close()

def MongoUpdateHist(user, secret):
  data = MongoGetUser(user)
  data['histSecret'] = secret
  MongoPersistUser(data, user)

def MongoUpdateSecret(secret):
    users = MongoGetUsers()
    for user in users:
        data = MongoGetUser(user)
        data['dailySecret'] = secret
        MongoPersistUser(data, user)
