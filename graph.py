#!/usr/bin/python3
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
import matplotlib.patheffects as path_effects
from pymongo import MongoClient
from datetime import datetime
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

def MongoMarketScatter(email):
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.volume.find_one({'_id': email})
    client.close()

def MongoGetUsers():
    userList = []
    client = MongoClient("localhost")
    db = client.portfolioTracker
    userDict = list(db.users.find({}, {'email':1, '_id' : 0}))
    for emailKey in userDict:
        userList.append(emailKey['email'])
    return userList

def MongoGetDocument(user = 'Stu'):
    key = "'_id': {}".format(user)
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.portfolios.find_one({'_id': user})
    client.close()

def genGraph(public=True):
    obj = MongoGetDocument('Market')
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']
    newDates = []
    for i in dates: # convert to epoc objects for consumption by matplotlib
        newDates.append(datetime.strptime(i, '%Y/%m/%d'))
    t = newDates
    a = assets[0].History
    b = assets[1].History
    c = assets[2].History

    userList = MongoGetUsers()
    userList.append('all') # backwards compadibility
    scatter_data = []
    for user in userList:
        scatter_data = MongoMarketScatter(user)
    scatter_x = []
    for i in scatter_data['date']: #convert to epoc objects for consumption by matplotlib
        scatter_x.append(datetime.strptime(i, '%Y/%m/%d'))
    scatter_y = scatter_data['endValue']
    scatter_volume= scatter_data['volume']
    scatter_volume = list(map(lambda x: x/7, scatter_volume))
    fig, ax = plt.subplots()
    fig.set_size_inches(10,6,450)

    fmt_month_year = mdates.MonthLocator()
    fmt_day_year = mdates.DayLocator()
    ax.xaxis.set_major_locator(fmt_month_year)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%y-%m'))
    fig.autofmt_xdate()


    ax.plot(t, a, dashes=[1, 3], color= 'red', linewidth=0.5, antialiased=True, label='7% per annum')
    ax.plot(t, b, color='blue', linewidth=0.5, antialiased=True, label='Everything in S&P 500')
    ax.plot(t, c, color='black', linewidth=1.5, antialiased=True, label='Assets under management', path_effects=[path_effects.SimpleLineShadow((1.5,-1.5)),path_effects.Normal()])
    if public == False:
        ax.scatter(scatter_x, scatter_y, s=scatter_volume, antialiased=True, alpha=0.25, c=np.random.random_sample(len(scatter_x)), label='Trade volume')
    plt.title('How we compare to market trends',fontsize = 20)
    plt.legend(title='Rebalanced with low volitility')
    ax.xaxis.grid(True)
    if public == False:
        plt.savefig("/var/www/html/static/media/private_market.d3c151cb.png")
    if public == True:
        ax.yaxis.set_major_locator(plt.NullLocator())
        ax.xaxis.set_major_formatter(plt.NullFormatter())
        ax.xaxis.set_minor_locator(plt.NullLocator())
        ax.xaxis.set_minor_formatter(plt.NullFormatter())
        plt.savefig("/var/www/html/static/media/market.74a21c94.png")
# generate both logged in and guest graph
genGraph(True)
genGraph(False)
