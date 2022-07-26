import MongoPortfolio
import requests
from yahoofinancials import YahooFinancials
from AssetAPIFactory import AssetAPIFactory
assetFactory = AssetAPIFactory()
cachedPrices = {}
print(assetFactory.getExchangeRate())
for ticker in MongoPortfolio.MongoGetTickers():
  print(ticker)
  print(assetFactory.getPriceUSD(ticker))
  print(assetFactory.USCurrency(ticker))
