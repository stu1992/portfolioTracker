import MongoPortfolio
import numpy as np
import matplotlib.pyplot as plt
import statistics
import random, string
import matplotlib.ticker as mtick
import logging
import logging.handlers
import os

import time

start = time.time()

handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "/home/ubuntu/log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()
root.setLevel(os.environ.get("LOGLEVEL", "DEBUG"))
logging.getLogger('matplotlib').setLevel(logging.ERROR)
root.addHandler(handler)

for user in MongoPortfolio.MongoGetUsers():
  secret = ''.join(random.choice(string.ascii_letters) for i in range(36))
  fig, ax = plt.subplots()
  fig.set_size_inches(12,4.7)
  fig.set_dpi(140)
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
  for email in MongoPortfolio.MongoGetUsers():
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
        plt.text(0,30,'Coming Soon',size=35,
        bbox={'facecolor':'white','alpha':0.8,'edgecolor':'none','pad':1},
        ha='center', va='center') 
      continue
    changes = []
    for i in range(len(values)-1):
      userGrossValue = values[i+1]
      userPreviousGrossValue = values[i]
      if userPreviousGrossValue == 0 or userGrossValue == 0:
        continue
      change = ((userGrossValue - userPreviousGrossValue) / userPreviousGrossValue) * 100
      changes.append(round(change,6))
    if email == user:
      logging.debug(email + "turning green")
      plt.hist(changes, 100, range=(-5,5), facecolor='green', alpha=0.9, label='You' )
      plt.axvline(sum(changes) / len(changes), color='#cccccc', linestyle='dashed', linewidth=1.5)
    else:
      plt.hist(changes, 100, range=(-5,5), facecolor='red', alpha=0.2)
      plt.axvline(sum(changes) / len(changes), color='#cccccc', linestyle='dashed', linewidth=0.2, alpha=0.8)
  plt.axvline(0, color='gray', linestyle='solid', linewidth=1)
  secret_url = "/var/www/html/static/media/hist_" + secret + ".png"
  MongoPortfolio.MongoUpdateHist(user, "/static/media/hist_" + secret + ".png")
  logging.debug(secret_url)
  plt.savefig(secret_url)
  plt.clf()

end = time.time()
logging.debug("Elapsed time for histogram is " + str(round((end-start),4)) + " seconds")
f = open('/home/ubuntu/histogram','a')
f.write(str(round((end-start),4)) + "\n")
f.close()
