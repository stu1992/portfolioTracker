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

This is an automated message to let you know that you accout value has gone up by more than usual in a day, Whoop Whoop!
You can log into the account at https://makingmymatesrich.com and check how things are going.
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.

Kindest of regards,
Stu
        '''.format(user)
        self.mail_content_html = '''<html><head></head><body><p>Hi {}!<br>

This is an automated message to let you know that you accout value has gone up by more than usual in a day, Whoop Whoop!<br>
You can log into the account at https://makingmymatesrich.com and check how things are going.<<br>
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.<br>
<br>
Kindest of regards,<br>
Stu</p></body></html>
        '''.format(user)
        self.send()
    def sendLow(self, emailTo='stumay1992@gmail.com', user='Stu'):
            self.receiver_address = emailTo
            self.subject = "Your portfolio has up update :("
            self.mail_content = '''Hi {}!

This is an automated message to let you know that you accout value has gone down by more than usual in a day, Yikes! :/
You can log into the account at https://makingmymatesrich.com and check how things are going.
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.

Kindest of regards,
Stu
            '''.format(user)
            self.mail_content_html = '''<html><head></head><body><p>Hi {}!<br>
<br>
This is an automated message to let you know that you accout value has gone down by more than usual in a day, Yikes! :/<br>
You can log into the account at https://makingmymatesrich.com and check how things are going.<br>
If you're getting spammed, maybe stop investing in speculative assets like a dumbass or hit me up and I'll change the algorythm.<br>
<br>
Kindest of regards,<br>
Stu</p></body></html>
            '''.format(user)
            self.send()
    def sendOrder(self, emailTo, user, order, volume, ticker, price):
        self.receiver_address = emailTo
        self.subject = "Your order has been executed"
        self.mail_content = '''Hi {}!

This is an automated message to advise you that your order to {} {} units of {} for AUD${} has been executed on https://makingmymatesrich.com

Kindest of regards,
Stu
        '''.format( user, order,  str(volume), str(ticker), str(price))
        self.mail_content_html = '''<html><head></head><body><p>Hi {}!<br>
<br>
This is an automated message to advise you that your order to {} {} units of {} for AUD${} has been executed on <a href="https://makingmymatesrich.com">MakingMyMatesRich.com</a><br>
<br>
Kindest of regards,<br>
Stu</p></body></html>
        '''.format( user, order,  str(volume), str(ticker), str(price))
        self.send()

    def sendEmailConfirmation(self, emailTo, user, secret):
        self.receiver_address = emailTo
        self.subject = "Confirm your email"
        self.mail_content = '''Hi {}!
Welcome to the start of your exciting investment journey!
follow the link to confirm your email and get started
https//makingmymatesrich.com/api/user/confirm/{}
        '''.format( user, secret)
        self.mail_content_html = '''<html><head></head><body><p>Hi {}!<br>
Welcome to the start of your exciting investment journey!<br>
follow the link to confirm your email and get started<br>
<a href="https://makingmymatesrich.com/api/user/confirm/{}">https://makingmymatesrich.com/api/user/confirm/{}</a></p></body></html>'''.format( user, secret, secret)
        self.send()

    def sendNewUser(self, emailTo, user):
        self.receiver_address = emailTo
        self.subject = "New user at making my mates rich!"
        self.mail_content = '''Hi Stu!
Heads up, a new user account, {}, has been created. Whoop whoop!
        '''.format( user)
        self.mail_content_html = '''<html><head></head><body><p>Hi Stu!<br>
Heads up, a new user account, {}, has been created. Whoop whoop!</p></body></html>
        '''.format( user)
        self.send()
    def sendOnboarded(self, portfolio, volume, enabled):
        self.receiver_address = "stumay1992@gmail.com"
        self.subject = "New user ready to go!"
        self.mail_content = '''Hi Stu!
Heads up, A new user has been onboarded with these details {} {}. Whoop whoop!
        '''.format(portfolio, volume)
        self.mail_content_html = '''<html><head></head><body><p>Hi Stu!<br>
Heads up, A new user has been onboarded with these details <br>{}<br>{}<br>. Whoop whoop!<br>
follow the link to enable the account<br>
<a href="https://makingmymatesrich.com/api/user/confirmadmin/{}">https://makingmymatesrich.com/api/user/confirmadmin/{}</a></p></body></html>
        '''.format(portfolio, volume, enabled, enabled)
        self.send()

    def sendNews(self, title):
        self.receiver_address = "stumay1992@gmail.com"
        self.subject = "news updated"
        self.mail_content = '''Hi Stu!

{}
Kindest of regards,
Stu
        '''.format(title)
        self.mail_content_html = '''<html><head></head><body><p>Hi Stu!<br>

{}<br>
Kindest of regards,<br>
Stu</p></body></html>
        '''.format(title)
        self.send()

    def sendOrderFail(self, emailTo='stumay1992@gmail.com'):
        self.receiver_address = emailTo
        self.subject = "Your order has failed"
        self.mail_content = '''Hi Stu!
An order email has failed, check the server
        '''.format(user, order, volume. ticker, price)
        self.mail_content_html = '''<html><head></head><body><p>Hi Stu!<br>
An order email has failed, check the server</p></body></html>
        '''.format(user, order, volume. ticker, price)
        self.send()

    def send(self):
        self.logging.debug("From: {}\nTo: {}\nSubject: {}\nBody: {}".format(self.sender_address, self.receiver_address, self.subject, self.mail_content))
        #Setup the MIME
        message = MIMEMultipart('alternative')
        message['From'] = self.sender_address
        message['To'] = self.receiver_address
        message['Subject'] = self.subject  #The subject line
        #The body and the attachments for the mail
        message.attach(MIMEText(self.mail_content, 'plain'))
        message.attach(MIMEText(self.mail_content_html, 'html'))
        #Create SMTP session for sending the mail
        session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
        session.starttls() #enable security
        session.login(self.sender_address, self.sender_pass) #login with mail_id and password
        text = message.as_string()
        session.sendmail(self.sender_address, self.receiver_address, text)
        session.quit()
        self.logging.warn('Mail Sent')
