import MongoPortfolio
import numpy as np
import matplotlib.pyplot as plt
import statistics
import random, string
import matplotlib.ticker as mtick
import logging
import logging.handlers
import os
from datetime import timedelta, datetime
import time
import SystemStatus
from PIL import Image

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

for user in MongoPortfolio.MongoGetUsers():
  secret = ''.join(random.choice(string.ascii_letters) for i in range(36))
  fig, ax = plt.subplots()
  fig.set_size_inches(13,5)
  fig.set_dpi(300)
  fmt = '%+.1f%%' # Format you want the ticks, e.g. '40%'
  xticks = mtick.FormatStrFormatter(fmt)
  ax.xaxis.set_major_formatter(xticks)
  plt.title('How you compare to your mates daily',fontsize = 25, color='#eceded')
  ax.yaxis.set_major_locator(plt.NullLocator())
  ax.xaxis.label.set_color("#9ca9b3")
  ax.set_facecolor('#eceded')
  ax.set_facecolor('#151719')
  ax.yaxis.label.set_color('#9ca9b3')
  ax.xaxis.label.set_color('#9ca9b3')
  fig.patch.set_facecolor('#25282c')
  ax.yaxis.label.set_color('#9ca9b3')
  ax.xaxis.label.set_color('#9ca9b3')
  ax.tick_params(axis='y', colors='#9ca9b3')
  ax.tick_params(axis='x', colors='#9ca9b3', rotation=30)
  ax.spines['left'].set_color('#9ca9b3')
  ax.spines['right'].set_color('#9ca9b3')
  ax.spines['bottom'].set_color('#9ca9b3')
  ax.spines['top'].set_color('#9ca9b3')

  ax.yaxis.label.set_color("#9ca9b3")
  users = MongoPortfolio.MongoGetUsers()
  for email in users:
    portfolio = MongoPortfolio.MongoGetDocument(email)

    data = portfolio['seriesdataset']
    values = []
    for i in range(len(portfolio['dates'])):
      price = 0
      for element in data:
        price += element['data'][i]
      values.append(price)
    if len(values) < 60:
      if user == email:
        logging.debug(email + " not sampled (" + str(len(values)) + ")")
        plt.text(0,30,'Coming Soon',size=35,
        bbox={'facecolor':'white','alpha':0.8,'edgecolor':'none','pad':1},
        ha='center', va='center') 
      continue
    changes = []
    purchases = MongoPortfolio.MongoGetScatter(email)
    for i in range(len(values)-1):
      userGrossValue = values[i+1]
      userPreviousGrossValue = values[i]
      if userPreviousGrossValue == 0 or userGrossValue == 0:
        continue
      # check if this is a day with a purchase and remove that purchase from percentage calculation
      #date = datetime.strptime(purchases['date'][i], "%Y/%m/%d")
      if portfolio['dates'][i] in purchases['date']:
          # iterate through dates in purchases and find index
          index = purchases['date'].index(portfolio['dates'][i])
          # find buy or sell and get volume
          order = purchases['order'][index]
          volume = purchases['volume'][index]
          # add or subtract
          if order == 'buy':
              userGrossValue -= volume
          else:
              userGrossValue += volume
      change = ((userGrossValue - userPreviousGrossValue) / userPreviousGrossValue) * 100
      changes.append(round(change,6))
    if email == user:
      logging.debug(email + " histogram rendering")
      plt.hist(changes, 60, range=(-3,3), facecolor='green', alpha=0.9, label='You' )
      plt.axvline(sum(changes) / len(changes), color='#cccccc', linestyle='dashed', linewidth=1.5)
    else:
      plt.hist(changes, 60, range=(-3,3), facecolor='red', alpha=1/len(users))
      plt.axvline(sum(changes) / len(changes), color='#cccccc', linestyle='dashed', linewidth=0.6, alpha=0.8)
  portfolio = MongoPortfolio.MongoGetDocument('Market')
  dataset = portfolio['seriesdataset']
  dates = portfolio['dates']
  values = []
  for asset in dataset:
    if asset['name'] == 'VOO':
       values = asset['data'] 
  # add market line
  changes = []
  for i in range(len(values)-1):
    userGrossValue = values[i+1]
    userPreviousGrossValue = values[i]
    change = ((userGrossValue - userPreviousGrossValue) / userPreviousGrossValue) * 100
    if (datetime.strptime(dates[i], "%Y/%m/%d")+ timedelta(days=1)).day != 1:
      changes.append(round(change,6))
  plt.axvline(sum(changes) / len(changes), color='#6666ff', linestyle='solid', linewidth=1.0, alpha=0.8)
  plt.axvline(0, color='gray', linestyle='solid', linewidth=1)
  secret_url = "/var/www/html/static/media/hist_" + secret + ".png"
  MongoPortfolio.MongoUpdateHist(user, "/static/media/hist_" + secret + ".png")
  logging.debug(secret_url)
  plt.savefig(secret_url)
  im = Image.open(secret_url)
  width, height = im.size
  im1 = im.crop((400, 50, width-300, height))
  im1.save(secret_url)
  plt.clf()

end = time.time()
logging.debug("Elapsed time for histogram is " + str(round((end-start),4)) + " seconds")
f = open('/home/ubuntu/histogram','a')
f.write(str(round((end-start),4)) + "\n")
f.close()
