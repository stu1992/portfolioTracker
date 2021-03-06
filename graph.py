#!/usr/bin/python3
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
import matplotlib.patheffects as path_effects
from pymongo import MongoClient
import datetime
import random
import string
from numpy import array
from dateutil.relativedelta import relativedelta
import MongoPortfolio
import logging
import logging.handlers
import time
import os
import SystemStatus
from PIL import Image

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


def limitScope(dateList, monthsGoingBack):
    monthsAgo = datetime.datetime.today() - relativedelta(months=monthsGoingBack)
    daysInScope = []
    for i in range(len(dateList)):
        if monthsGoingBack == 0: # all history, do no filtering
            daysInScope.append(i)
            continue
        if dateList[i] >= monthsAgo: # if this date is greater than the months going back
            daysInScope.append(i)
    return daysInScope

def genGraph(public=True, months=1):
    obj = MongoPortfolio.MongoGetDocument('Market')
    assets = []
    for struct in obj['seriesdataset']:
        assets.append(Asset(struct))
    myPortfolio = obj['portfolio']
    dates = obj['dates']
    newDates = []
    for i in dates: # convert to epoc objects for consumption by matplotlib
        newDates.append(datetime.datetime.strptime(i, '%Y/%m/%d'))

    daysInScope = limitScope(newDates, months)
    vix_threshold = 20
    t = array(newDates)[daysInScope]
    vix = array(assets[0].History)[daysInScope]
    a = array(assets[1].History)[daysInScope]
    b = array(assets[2].History)[daysInScope]
    c = array(assets[3].History)[daysInScope]

    userList = MongoPortfolio.MongoGetUsers()
    userList.append('all') # backwards compadibility
    scatter_data = {'date_unsorted': [], 'date' : [], 'volume' : [], 'endValue': [], 'order' :[]}
    for user in userList:
        data = MongoPortfolio.MongoGetScatter(user)
        scatter_data['date_unsorted'].extend(data['date'])
        scatter_data['volume'].extend(data['volume'])
        scatter_data['endValue'].extend(data['endValue'])
        scatter_data['date'].extend(data['date'])
        scatter_data['order'].extend(data['order'])

    scatter_x_tmp = []
    for i in scatter_data['date']: #convert to epoc objects for consumption by matplotlib
        scatter_x_tmp.append(datetime.datetime.strptime(i, '%Y/%m/%d'))

    scatter_daysInScope = limitScope(scatter_x_tmp, months)

    scatter_x = array(scatter_x_tmp)[scatter_daysInScope]
    scatter_y = array(scatter_data['endValue'])[scatter_daysInScope]
    scatter_colour = []
    orders =  array(scatter_data['order'])[scatter_daysInScope]
    for order in orders:
      if order == "buy":
        scatter_colour.append("green")
      else:
        scatter_colour.append("yellow")

    scatter_volume = array(scatter_data['volume'])[scatter_daysInScope]
    max_volume = max(scatter_volume)
    scatter_volume = list(map(lambda x: 1 * (x/max_volume), scatter_volume))



    fig, ax = plt.subplots()
    fig.set_size_inches(11,6)
    fig.set_dpi(300)
    fig.patch.set_facecolor('#25282c')
    #ax.set_facecolor('#eceded')
    ax.set_facecolor('#151719')
    fmt_month_year = mdates.MonthLocator()
    fmt_day_year = mdates.DayLocator()

    ax.spines['left'].set_color('#9ca9b3')
    ax.spines['right'].set_color('#9ca9b3')
    ax.spines['bottom'].set_color('#9ca9b3')
    ax.spines['top'].set_color('#9ca9b3')
    ax.yaxis.label.set_color('#9ca9b3')
    ax.xaxis.label.set_color('#9ca9b3')
    ax.tick_params(axis='y', colors='#9ca9b3')
    ax.tick_params(axis='x', colors='#9ca9b3', rotation=30)

    ax.yaxis.label.set_color("#9ca9b3")
    ax.xaxis.set_major_locator(fmt_month_year)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%y-%m'))
    fig.autofmt_xdate()
    ax.yaxis.tick_right()
    for i in range(len(daysInScope)-1):
        x = vix[i]
        if vix[i] >= 20:
            width = (0.2 * x) - 3
        else:
            width = (0.00013 * x) * (20 * x ) * (0.05 * x)
        ax.plot(t[i:i+2], a[i:i+2], color='red', linewidth=width, alpha=1.0, antialiased=True, solid_capstyle='round')
    ax.plot(t, a, color= 'red', alpha=1.0, linewidth=0.5, antialiased=True, label='7% per annum', solid_capstyle='round')
    ax.plot(t, b, color='#eeeeff', linewidth=1.5, antialiased=True, alpha=0.5, solid_capstyle='round')
    ax.plot(t, b, color='blue', linewidth=0.5, antialiased=True, label='Everything in S&P 500', solid_capstyle='round')
    ax.plot(t, c, color='#aaaaaa', linewidth=3, alpha=0.8, antialiased=True, solid_capstyle='round')
    ax.plot(t, c, color='black', linewidth=1.5, antialiased=True, label='Assets under management', path_effects=[path_effects.SimpleLineShadow((1.5,-1.5)),path_effects.Normal()], solid_capstyle='round')
    if public == False:
        ax.scatter(scatter_x, scatter_y, s=200, antialiased=True, alpha=scatter_volume, edgecolors='none', c=scatter_colour, label='Trade volume')
    plt.title('How we compare to market trends',fontsize = 25, color='#eceded')
    plt.legend(title='Rebalanced with low volitility', framealpha=0.6)
    if months == 0:
        ax.xaxis.grid(True, color='#202020')
    else:
        ax.xaxis.grid(True, color='#404040')

    if public == False:
        if months == 0:
          ax.xaxis.set_major_formatter(plt.NullFormatter())
        secret_url = "/var/www/html/static/media/market" + str(months) + "_" + secret + ".png"
        plt.savefig(secret_url)
        im = Image.open(secret_url)
        width, height = im.size
        im1 = im.crop((280, 80, width-80, height-200))
        im1.save(secret_url)
        MongoPortfolio.MongoUpdateSecret("/static/media/market6_" + secret + ".png")
    if public == True:
        ax.yaxis.set_major_locator(plt.NullLocator())
        ax.xaxis.set_major_formatter(plt.NullFormatter())
        ax.xaxis.set_minor_locator(plt.NullLocator())
        ax.xaxis.set_minor_formatter(plt.NullFormatter())
        plt.savefig("/var/www/html/static/media/market.74a21c94f6be0a4c31ad.png")
        im = Image.open("/var/www/html/static/media/market.74a21c94f6be0a4c31ad.png")
        width, height = im.size
        im1 = im.crop((280, 80, width-200, height-250))
        im1.save("/var/www/html/static/media/market.74a21c94f6be0a4c31ad.png")

handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "/home/ubuntu/log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()
root.setLevel(os.environ.get("LOGLEVEL", "DEBUG"))
logging.getLogger('matplotlib').setLevel(logging.ERROR)
logging.getLogger('PIL').setLevel(logging.ERROR)
root.addHandler(handler)

system_status = SystemStatus.SystemStatus()
retries = 12 * 12
retry = 0
while system_status.get_mutex() == False:
  retry += 1
  logging.error("Portfolio not updated " + str(retry))
  if retry > retries:
    logging.error("ERROR: unable to recover")
    break
  time.sleep(60*5)
start = time.time()

# generate both logged in and guest graph
secret = ''.join(random.choice(string.ascii_letters) for i in range(20))
genGraph(True,6)
genGraph(False,3)
genGraph(False,6)
genGraph(False,12)
genGraph(False,0)
end = time.time()
logging.debug("Elapsed time for graph is " + str(round((end-start),4)) + " seconds")
f = open('/home/ubuntu/graph','a')
f.write(str(round((end-start),4)) + "\n")
f.close()
