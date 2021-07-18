import requests
from yahoofinancials import YahooFinancials

class AssetAPIFactory:
    cachedPrices = {}
    def __init__(self, logging):
        this.logging = logging

    def getPriceUSD(self, ticker):
        if ticker in self.cachedPrices:
            this.logging.debug("using cache for " + ticker)
            return self.cachedPrices[ticker]

        elif ticker == "AAPL" or ticker == "VUG" or ticker == "GME" or ticker == "VOO":
            yahoo_financials = YahooFinancials(ticker)
            self.cachedPrices[ticker] = YahooFinancials([ticker]).get_current_price()[ticker]
            return self.cachedPrices[ticker]
        elif ticker == "BIQ":
            self.cachedPrices[ticker] = YahooFinancials([ticker+ ".AX"]).get_current_price()[ticker+ ".AX"]
            return self.cachedPrices[ticker]
        elif ticker == "BTC" or  ticker == "ETH":
            TICKER_API_URL = 'https://www.bitstamp.net/api/v2/ticker/' + ticker.lower() + "usd/"
            response = requests.get(TICKER_API_URL)
            response_json = response.json()
            self.cachedPrices[ticker] = float(response_json['last'])
            return self.cachedPrices[ticker]

    def USCurrency(self, ticker):
        if ticker == "BIQ":
            return False
        else:
            return True

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
