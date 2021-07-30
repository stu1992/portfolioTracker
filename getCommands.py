#!/usr/bin/python3
import imaplib
import re
from datetime import date
from pymongo import MongoClient
mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('makingmymatesrich@gmail.com', 'EMAILPASSWORD')
mail.list()
# Out: list of "folders" aka labels in gmail.
mail.select("inbox") # connect to inbox.
result, data = mail.search(None, "ALL")
latest = int(open('latest','r').read().rstrip())

print("latest = " + str(latest))
ids = data[0] # data is a list.
stringData = []

id_list = ids.split() # ids is a space separated string
for num in id_list:
    stringData.append(int(num))

print(stringData)
spliceAt = int(stringData.index(latest))

newList = id_list[spliceAt+1:]
print("fetching latest emails:\n" + str(newList))
for email in newList:
    # fetch the email body (RFC822) for the given ID
    result, data = mail.fetch(email, "(RFC822)")
    raw_email = data[0][1] # here's the body, which is raw text of the whole email
    text = str(raw_email)
    if "preventingspam" in text: # basic sanity check because anyone could spam
        print("authenticated")
        #print(text)
        title = re.search("title:=E2=80=9D([\s|\w]*)=E2=80=9D", text)
        if title:
            print(title.group(0)[15:-9])
        comment = re.search("comment:=E2=80=9D([\s|\w]*)=E2=80=9D", text)
        if comment:
            print(comment.group(0)[17:-9])
        link = re.search("link:=E2=80=9D([\w|:\/\.?-]*)=E2=80=9D", text)
        if link:
            print(link.group(0)[14:-9])
        if link and comment and title:
            title = title.group(0)[15:-9]
            comment = comment.group(0)[17:-9]
            link = link.group(0)[14:-9]
            print("writing to db")
            tags = ["all"]
            date = date.today().strftime("%Y/%m/%d")
            client = MongoClient("localhost")
            db = client.portfolioTracker
            data = {"date": date, "title" : title, "comment": comment, "link" : link, "Tags" : tags}
            db.news.insert_one(data)

    # including headers and alternate payloads
print("new latest = " + str(stringData[-1]))
handler = open('latest','w')
handler.write(str(stringData[-1]))
