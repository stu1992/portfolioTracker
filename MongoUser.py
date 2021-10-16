import MongoPortfolio
from pymongo import MongoClient
def MongoUpdateURL(data):
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.volume.replace_one({'_id': 'all'}, data)
    client.close()


def MongoGetDocument(user = 'stumay1992@gmail.com'):
    key = "'_id': {}".format(user)
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.users.find_one({'email': user})
    client.close()

def MongoPersistUser(data, user = 'stumay1992@gmail.com'):
    key = {'email': user}
    client = MongoClient("localhost")
    db = client.portfolioTracker
    result=db.users.replace_one(key, data)
    confirmEntry = db.users.find_one({'email': user})
    client.close()

def MongoUpdateSecret(secret)
users = MongoPortfolio.MongoGetUsers()
for user in users:
    data = MongoGetDocument(user)
    data['daily secret'] = secret
    MongoPersistUser(data, user)
