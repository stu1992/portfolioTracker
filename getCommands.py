#!/usr/bin/python3
import imaplib
import email
from email.header import decode_header
import re
from datetime import date
import datetime
from pymongo import MongoClient
import os
import logging
import logging.handlers
latestFile = "/home/ubuntu/portfolioTracker/latest"

handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "./log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()
root.setLevel(os.environ.get("LOGLEVEL", "DEBUG"))
root.addHandler(handler)

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('makingmymatesrich@gmail.com', 'EMAILPASSWORD')
mail.list()
# Out: list of "folders" aka labels in gmail.
mail.select("inbox") # connect to inbox.
result, data = mail.search(None, "ALL")
latest = int(open(latestFile,'r').read().rstrip())

#logging.debug("latest = " + str(latest))
ids = data[0] # data is a list.
stringData = []

id_list = ids.split() # ids is a space separated string
for num in id_list:
    stringData.append(int(num))

#logging.debug(stringData)
spliceAt = int(stringData.index(latest))

newList = id_list[spliceAt+1:]
#logging.info("fetching latest emails")
for messages in newList:
    # fetch the email body (RFC822) for the given ID
    result, data = mail.fetch(messages, "(RFC822)")
    message_subject =""
    message_body = ""
    message_from = ""
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
            logging.debug("authenticated from stu") # this should break if not
            message_subject = subject
        if "order" in message_subject:
            logging.debug("order message")
            email = re.search(">email:([^<]*)", body)
            ticker = re.search(">ticker:([^<]*)", body)
            ordertype = re.search("order:([^<]*)", body)
            volume = re.search("volume:([^<]*)", body)
            price = re.search("price:([^<]*)", body)
            try:
                message_email = email.group(0)[7:]
                message_ticker = ticker.group(0)[8:]
                message_ordertype = ordertype.group(0)[6:]
                message_volume = volume.group(0)[7:]
                message_price = price.group(0)[6:]
            except:
                continue
            logging.debug("email:" + message_email)
            logging.debug("ticker:" + message_ticker)
            logging.debug("ordertype:" + message_ordertype)
            logging.debug("volume:" + message_volume)
            logging.debug("price:" + message_price)
            f = open("/home/ubuntu/portfolioTracker/order", "w")
            f.write(message_email + '\n')
            f.write(message_ticker + '\n')
            f.write(message_ordertype + '\n')
            f.write(message_volume + '\n')
            f.write(message_price + '\n')
            f.write("yes\n")
            os.system("/usr/bin/python3 /home/ubuntu/portfolioTracker/DAO.py < /home/ubuntu/portfolioTracker/order")
            os.system("rm /home/ubuntu/portfolioTracker/order")
        else:
            comment = re.search(">comment:([^<]*)", body)
            link = re.search("href=\"([^\"]*)", body)
            tags = re.search(">tags:([^<]*)", body)
            message_link = None
            message_comment = None
            message_tags = None
            try:
                message_comment = comment.group(0)[9:]
                message_link = link.group(0)[6:]
                message_tags = tags.group(0)[6:].split(",")
                message_tags.append("all")

            except:
                continue
            if message_comment == None:
                logging.debug("didn't parse comment")
                message_comment = "didn't parse"
            if message_link == None:
                logging.debug("didn't parse link")
                message_link = "didn't parse"
            if message_tags == None:
                logging.debug("didn't parse tags")
                message_tags = ["all"]
            logging.info("writing to db")
            logging.info("title: " + message_subject)
            logging.info("comment: " + message_comment)
            logging.info("link: " + message_link)
            logging.info("tags: " + str(message_tags))
            message_date = datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
            client = MongoClient("localhost")
            db = client.portfolioTracker
            data = {"date": message_date, "title" : message_subject, "comment": message_comment, "link" : message_link, "tags" : message_tags}
            db.news.insert_one(data)

#logging.debug("new latest = " + str(stringData[-1]))
handler = open(latestFile,'w')
handler.write(str(stringData[-1]))
