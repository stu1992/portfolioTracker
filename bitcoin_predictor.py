import pandas
bc_df = pandas.read_csv("BTC_USD_2020-04-30_2021-04-29-CoinDesk.csv")
print(bc_df["Date"])
bc_df.rename(columns={"Closing Price (USD)": "price"})
print(bc_df)
