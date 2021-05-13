import matplotlib.pyplot as plt
import numpy as np
from pymongo import MongoClient

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

obj = MongoGetDocument('Market')
assets = []
for struct in obj['seriesdataset']:
    assets.append(Asset(struct))
myPortfolio = obj['portfolio']
dates = obj['dates']

t = dates
a = assets[0].History
b = assets[1].History
c = assets[2].History

average = plt.plot(t, a)
voo = plt.plot(t, b)
managed = plt.plot(t, c)
plt.setp(average, 'color', 'r', 'linewidth', 0.5, label='7% per annum')
plt.setp(voo, 'color', 'b', 'linewidth', 0.5, label='Everything in S&P 500')
plt.setp(managed, 'color', 'black', 'linewidth', 2, label='Assets under management')
plt.title('How we compare to market trends')
plt.legend(title='rebalanced every month')
plt.grid(False)
plt.savefig("/home/stu/Documents/portfolioTracker/src/market.png")
