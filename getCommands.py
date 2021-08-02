#!/usr/bin/python3
import imaplib
import email
from email.header import decode_header
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
for messages in newList:
    # fetch the email body (RFC822) for the given ID
    result, data = mail.fetch(messages, "(RFC822)")
    message_subject =""
    message_body = ""
    message_from = ""
    print(len(data))
    for response in data:
        if isinstance(response, tuple):
            # parse a bytes email into a message object
            msg = email.message_from_bytes(response[1])
            # decode the email subject
            subject, encoding = decode_header(msg["Subject"])[0]
            if isinstance(subject, bytes):
                # if it's a bytes, decode to str
                subject = subject.decode(encoding)
                message_subject = subject
            # decode email sender
            From, encoding = decode_header(msg.get("From"))[0]
            if isinstance(From, bytes):
                From = From.decode(encoding)
                message_from = From

            if msg.is_multipart():
                # iterate over email parts
                for part in msg.walk():
                    # extract content type of email
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    try:
                        # get the email body
                        body = part.get_payload(decode=True).decode()
                    except:
                        pass

            else:
                # extract content type of email
                content_type = msg.get_content_type()
                # get the email body
                body = msg.get_payload(decode=True).decode()
                if content_type == "text/plain":
                    content_body = body
                if content_type == "text/html":
                    message_body=body
        if "stumay1992@gmail.com" in From:
            print("authenticated from stu")
        message_subject = subject
        comment = re.search(">comment:([^<]*)", body)
        link = re.search("href=\"([^\"]*)", body)
        message_comment = comment.group(0)[9:]
        message_link = link.group(0)[6:]
    if message_link and message_comment and message_subject:
        print("writing to db")
        print("title: " + message_subject)
        print("comment: " + message_comment)
        print("link: " + message_link)
        tags = ["all"]
        message_date = date.today().strftime("%Y/%m/%d")
        client = MongoClient("localhost")
        db = client.portfolioTracker
        data = {"date": message_date, "title" : message_subject, "comment": message_comment, "link" : message_link, "tags" : tags}
        db.news.insert_one(data)

print("new latest = " + str(stringData[-1]))
handler = open('latest','w')
handler.write(str(stringData[-1]))
