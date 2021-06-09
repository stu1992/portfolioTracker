import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
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

def MongoMarketScatter():
    client = MongoClient("localhost")
    db = client.portfolioTracker
    return db.volume.find_one({'_id': 'all'})
    client.close()

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
        newDates.append(datetime.strptime(i, '%Y-%m-%d'))
    t = newDates
    a = assets[0].History
    b = assets[1].History
    c = assets[2].History

    scatter_data = MongoMarketScatter()
    scatter_x = scatter_data['date']
    scatter_y = scatter_data['endValue']
    scatter_volume= scatter_data['volume']
    scatter_volume = list(map(lambda x: x/10, scatter_volume))
    fig, ax = plt.subplots()
    fig.set_size_inches(10,6,450)

    fmt_month_year = mdates.MonthLocator()
    fmt_day_year = mdates.DayLocator()
    ax.xaxis.set_major_locator(fmt_month_year)
    ax.xaxis.set_minor_locator(fmt_day_year) #i'll eventually remove this. it'll just get cluttered
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%y-%m'))
    fig.autofmt_xdate()


    ax.plot(t, a, dashes=[1, 3], color= 'red', linewidth=0.5, label='7% per annum')
    ax.plot(t, b, color='blue', linewidth=0.5, label='Everything in S&P 500')
    ax.plot(t, c, color='black', linewidth=1.5, label='Assets under management')
    if public == False:
        ax.scatter(scatter_x, scatter_y, s=scatter_volume, alpha=0.25, c=np.random.random_sample(len(scatter_x)), label='Trade volume')
    plt.title('How we compare to market trends',fontsize = 20)
    plt.legend(title='Rebalanced every month')
    ax.xaxis.grid(True)
    if public == False:
        plt.savefig("/var/www/html/static/media/private_market.d3c151cb.png")
    if public == True:
        ax.yaxis.set_major_locator(plt.NullLocator())
        ax.xaxis.set_major_formatter(plt.NullFormatter())
        ax.xaxis.set_minor_locator(plt.NullLocator())
        ax.xaxis.set_minor_formatter(plt.NullFormatter())
        plt.savefig("/var/www/html/static/media/market.74a21c94.png")
genGraph(True)
genGraph(False)
