import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
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
newDates = []
for i in range(len(dates)):
    newDates.append(str(i))
t = dates
a = assets[0].History
b = assets[1].History
c = assets[2].History
fig, ax = plt.subplots()

fmt_month_year = mdates.MonthLocator()
fmt_day_year = mdates.DayLocator()
ax.xaxis.set_major_locator(fmt_month_year)
ax.xaxis.set_minor_locator(fmt_day_year)
#ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
fig.autofmt_xdate()

ax.plot(t, a,color= 'red', linewidth=0.5, label='7% per annum')
ax.plot(t, b, color='blue', linewidth=0.5, label='Everything in S&P 500')
ax.plot(t, c, color='black', linewidth=1.5, label='Assets under management')
plt.title('How we compare to market trends')
plt.legend(title='Rebalanced every month')
ax.xaxis.grid(True)
plt.savefig("/home/stu/Documents/portfolioTracker/src/market.png")
