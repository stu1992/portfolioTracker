#!/usr/bin/env python
import pika, sys, os, json
from datetime import date
import datetime
from pymongo import MongoClient
import logging
import logging.handlers
from Email import Mail
import MongoPortfolio

handler = logging.handlers.WatchedFileHandler(
    os.environ.get("LOGFILE", "./log"))
formatter = logging.Formatter(logging.BASIC_FORMAT)
handler.setFormatter(formatter)
root = logging.getLogger()

root.setLevel(os.environ.get("LOGLEVEL", "DEBUG"))
logging.getLogger('pika').setLevel(logging.ERROR)
root.addHandler(handler)
emailObj = Mail(logging)

credentials = pika.PlainCredentials('messenger', 'messengerPassword')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672, virtual_host='/', credentials=credentials ))
channel = connection.channel()

orders = MongoPortfolio.MongoGetOrders()
for order in orders:
  channel.basic_publish(exchange='',routing_key='order',  properties=pika.BasicProperties(content_type='text/plain', delivery_mode=2), body=json.dumps(order))
  logging.debug("publishing order from mongo api on behalf of " + str(order['email']))
MongoPortfolio.MongoDeleteOrders()
