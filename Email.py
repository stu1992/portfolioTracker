import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class Mail:
    def __init__(self, loggingObj):
    #The mail addresses and password
        self.sender_address = 'makingmymatesrich@gmail.com'
        self.sender_pass = 'EMAILPASSWORD'
        self.logging = loggingObj
    def sendHigh(self, emailTo='stumay1992@gmail.com', user='Stu'):
        self.receiver_address = emailTo
        self.subject = "Your portfolio has up update :)"
        self.mail_content = '''Hi {}!

This is an automated message to let you know that you accout value has gone up by more than 5% in a day, Whoop Whoop!
You can log into the account at http://makingmymatesrich.com and check how things are going.
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.

This email account isn't being actively monitored but you know how to find me.
Kindest of regards,
Stu
        '''.format(user)
        self.send()
    def sendLow(self, emailTo='stumay1992@gmail.com', user='Stu'):
            self.receiver_address = emailTo
            self.subject = "Your portfolio has up update :("
            self.mail_content = '''Hi {}!

This is an automated message to let you know that you accout value has gone down by more than 5% in a day, Yikes! :/
You can log into the account at http://makingmymatesrich.com and check how things are going.
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.

This email account isn't being actively monitored but you know how to find me.
Kindest of regards,
Stu
            '''.format(user)
            self.send()
    def sendOrder(self, emailTo, user, order, volume, ticker, price):
        self.receiver_address = emailTo
        self.subject = "Your order has been executed"
        self.mail_content = '''Hi {}!

This is an automated message to advise you that your order to {} {} units of {} for AUD${} has been executed on http://makingmymatesrich.com

This email account isn't being actively monitored but you know how to find me.
Kindest of regards,
Stu
        '''.format( user, order,  str(volume), str(ticker), str(price))
        self.send()

    def sendOrderFail(self, emailTo='stumay1992@gmail.com'):
        self.receiver_address = emailTo
        self.subject = "Your order has failed"
        self.mail_content = '''Hi Stu!
An order email has failed, check the server
        '''.format(user, order, volume. ticker, price)
        self.send()

    def send(self):
        self.logging.debug("From: {}\nTo: {}\nSubject: {}\nBody: {}".format(self.sender_address, self.receiver_address, self.subject, self.mail_content))
        #Setup the MIME
        message = MIMEMultipart()
        message['From'] = self.sender_address
        message['To'] = self.receiver_address
        message['Subject'] = self.subject  #The subject line
        #The body and the attachments for the mail
        message.attach(MIMEText(self.mail_content, 'plain'))
        #Create SMTP session for sending the mail
        session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
        session.starttls() #enable security
        session.login(self.sender_address, self.sender_pass) #login with mail_id and password
        text = message.as_string()
        session.sendmail(self.sender_address, self.receiver_address, text)
        session.quit()
        self.logging.warn('Mail Sent')
