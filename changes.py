import MongoPortfolio
import numpy as np
import matplotlib.pyplot as plt
import statistics

def checkDeviation(email):
  portfolio = MongoPortfolio.MongoGetDocument(email)
  data = portfolio['seriesdataset']
  values = []
  for i in range(len(portfolio['dates'])):
    price = 0
    for element in data:
      price += element['data'][i]
    values.append(price)

  changes = []
  for i in range(len(values)-1):
    userGrossValue = values[i+1]
    userPreviousGrossValue = values[i]
    if userPreviousGrossValue == 0 or userGrossValue == 0:
        continue
    change = ((userGrossValue - userPreviousGrossValue) / userPreviousGrossValue) * 100
    changes.append(round(change,6))
  nintyfivepercentile = 1.96 * statistics.stdev(changes)
  mean = sum(changes) / len(changes)
  return (nintyfivepercentile,mean,len(portfolio['dates']))
