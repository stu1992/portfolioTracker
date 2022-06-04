import MongoPortfolio

known_tickers = MongoPortfolio.MongoGetTickers()
exampleHistogram = "/static/media/example_hist.png"

def createPortfolio(email, ticker, number):
  return {
    "_id" : email,
    "portfolio" : {
        ticker : number
    },
    "seriesdataset" : [ 
        {
            "name" : ticker,
            "data" : [
            ]
        }
    ],
    "dates" : [ 
    ]
}
def createScatter(email):
  return {
    "_id" : email,
    "order" : [],
    "endValue" : [],
    "date" : [],
    "volume" : []
}

def updateAccount(email):
  stu = MongoPortfolio.MongoGetUser("stumay1992@gmail.com")
  user = MongoPortfolio.MongoGetUser(email)
  user['enabled'] = "true"
  user['histSecret'] = exampleHistogram
  user['dailySecret'] = stu['dailySecret']
  return user

newUsers = MongoPortfolio.MongoGetNewUsers()
for email in newUsers:
  print(email)
  onboard = input("onboard this user [yes|no]")
  if onboard == "yes":
    ticker = input("enter ticker: ")
    number = input("number of shares: ")
    MongoPortfolio.MongoPersistDocument(createPortfolio(email, ticker, number), email)
    MongoPortfolio.MongoPersistScatter(createScatter(email), email)
    MongoPortfolio.MongoPersistUser(updateAccount(email), email)
    print("done")
