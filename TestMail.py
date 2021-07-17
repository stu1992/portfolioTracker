import logging
import logging.handlers
class TestMail:
    def __init__(self, loggingObj):
    #The mail addresses and password
        self.sender_address = 'makingmymatesrich@gmail.com'
        self.sender_pass = 'EMAILPASSWORD'
        self.logging = loggingObj
        self.message = {}
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
    def send(self):
        self.logging.debug("From: {}\nTo: {}\nSubject: {}\nBody: {}".format(self.sender_address, self.receiver_address, self.subject, self.mail_content))
        #Setup the MIME
        self.message['From'] = self.sender_address
        self.message['To'] = self.receiver_address
        self.message['Subject'] = self.subject  #The subject line

        logging.warn('Mail Sent')
