import os
import time
import os.path
import datetime
class SystemStatus:
  def __init__(self):
    self.raspberry_pi = True
  def status_success(self):
    os.system("echo `date '+%-D'` > /home/ubuntu/portfolioTracker/mutex")
    io_buffer()
    os.system("echo 1 | sudo tee /sys/class/leds/led1/brightness")
  def status_failure(self):
    os.system("rm /home/ubuntu/portfolioTracker/mutex")
    io_buffer()
    os.system("echo 0 | sudo tee /sys/class/leds/led1/brightness")
  def get_mutex(self):
    if os.path.exists("/home/ubuntu/portfolioTracker/mutex"):
      f = open("/home/ubuntu/portfolioTracker/mutex","r")
      mutex = f.read()
      if datetime.datetime.now().strftime("%m/%d/%y") == mutex.rstrip():
        return True
      else:
        return False
    else:
      return False
def io_buffer():
    time.sleep(1)
