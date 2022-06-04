import requests
from yahoofinancials import YahooFinancials
import MongoPortfolio
class AssetAPIFactory:
    cachedPrices = {}
    def __init__(self):
        pass
    def getPriceUSD(self, ticker):
        asset = MongoPortfolio.MongoGetTicker(ticker)
        if ticker in self.cachedPrices:
            return self.cachedPrices[ticker]
        else:
            if asset['service'] == "yahoo":
                self.cachedPrices[ticker] = YahooFinancials([asset['mappedTicker']]).get_current_price()[asset['mappedTicker']]
                return self.cachedPrices[ticker]
            elif asset['service'] == "bitstamp":
                response = requests.get('https://www.bitstamp.net/api/v2/ticker/' + asset['mappedTicker'])
                response_json = response.json()
                self.cachedPrices[ticker] = float(response_json['last'])
                return self.cachedPrices[ticker]
    def USCurrency(self, ticker):
        asset = MongoPortfolio.MongoGetTicker(ticker)
        if asset['usCurrency'] == "true":
            return True
        else:
            return False

    def getExchangeRate(self):
        if not hasattr(self, 'exchangeRate'):
            API = 'http://api.exchangeratesapi.io/latest?access_key=c65663c506bc6d16fe81766cadde9918'
            response = requests.get(API)
            response_json = response.json()
            aud = response_json["rates"]['AUD']
            usd = response_json["rates"]['USD']
            self.exchangeRate = float(aud / usd)
        return self.exchangeRate
    def clear(self):
        self.cachedPrices = {}
