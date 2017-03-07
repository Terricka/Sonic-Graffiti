from time import sleep
from subprocess import call
import signal, sys, pygame, MPR121
import RPi.GPIO as GPIO

try:
  sensor = MPR121.begin()
except Exception as e:
  print e
  sys.exit(1)

num_electrodes = 12
current_time = 0

# handle ctrl+c gracefully
def signal_handler(signal, frame):
  light_rgb(0, 0, 0)
  sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# set up LED
red_led_pin = 6
green_led_pin = 5
blue_led_pin = 26

def light_rgb(r, g, b):
  # we are inverting the values, because the LED is active LOW
  # LOW - on
  # HIGH - off
  GPIO.output(red_led_pin, not r)
  GPIO.output(green_led_pin, not g)
  GPIO.output(blue_led_pin, not b)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(red_led_pin, GPIO.OUT)
GPIO.setup(green_led_pin, GPIO.OUT)
GPIO.setup(blue_led_pin, GPIO.OUT)

# convert mp3s to wavs with picap-samples-to-wav
light_rgb(0, 0, 1)
call("picap-samples-to-wav tracks", shell = True)
light_rgb(0, 0, 0)

# initialize mixer and pygame
pygame.mixer.pre_init(frequency = 44100, channels = 64, buffer = 1024)
pygame.init()

pause_count = 0
song_count = 0
currentSong = 0

# load paths
# paths = []
# for i in range(num_electrodes):
#   path = "tracks/.wavs/TRACK{0:03d}.wav".format(i)
#   print "loading file: " + path

#   paths.append(path)

sounds = [
  [
    0.0,
    10.0,
    15.0,
    30.0,
    "TwoWin.ogg",
  ],
  [
    0.0,
    10.0,
    15.0,
    30.0,
    "TwoDopeBoyz.ogg"
  ],
  [
    0.0,
    10.0,
    15.0,
    30.0,
    "Workin.ogg"
  ]

]

totalSounds = len(sounds)
#print totalSounds


while True:
  if sensor.touch_status_changed():
    sensor.update_touch_data()
    is_any_touch_registered = False

    for i in range(num_electrodes):
      if sensor.get_touch_data(i):
        # check if touch is registred to set the led status
        is_any_touch_registered = True
      if sensor.is_new_touch(i):
        # play sound associated with that touch
        # print "playing sound: " + str(i)
        # path = paths[i]

        if sensor.get_touch_data(10):
        	song_count += 1
        	if song_count < len(sounds):
        		currentSong = sounds[song_count]
        		print currentSong[4]
        	else:
        		song_count = 0
        		currentSong = sounds[song_count]
        		print currentSong[4]

        if sensor.get_touch_data(11):
        	song_count -= 1
        	if song_count > 0: 
        		currentSong = sounds[song_count]
        		print currentSong[4]   		   		
        	else:
        		song_count = totalSounds-1
        		currentSong = sounds[song_count]
        		print currentSong[4]
        		

        if sensor.get_touch_data(0):
          pygame.mixer.music.load(currentSong[4])
          pygame.mixer.music.stop()
          pygame.mixer.music.play(0,sounds[0][0])
        if sensor.get_touch_data(1):
          pygame.mixer.music.load(currentSong[4])
          pygame.mixer.music.stop()
          pygame.mixer.music.play(0,sounds[0][1])
        if sensor.get_touch_data(2):
          pygame.mixer.music.load(currentSong[4])
          pygame.mixer.music.stop()
          pygame.mixer.music.play(0,sounds[0][2])
        if sensor.get_touch_data(3):
          pygame.mixer.music.load(currentSong[4])
          pygame.mixer.music.stop()
          pygame.mixer.music.play(0,sounds[0][3])

        # last_touched = i
        # print last_touched
        # last_time = sounds[0][i]

        if pygame.mixer.music.get_busy():
          if sensor.get_touch_data(4):
            if pause_count%2 == 0:
              pygame.mixer.music.pause()
            else:
              pygame.mixer.music.unpause()
            pause_count += 1
            print pause_count

        if pygame.mixer.music.get_busy():
          last_touched = i
          if last_touched < 4:
            print last_touched
            last_time = sounds[0][i]
            print last_time



        if sensor.get_touch_data(5):
        	if sensor.get_touch_data(6):
        		current_spot = (last_time*1000) + pygame.mixer.music.get_pos()
        		current_spot = current_spot/1000
        		print current_spot
        		sounds[0][0] = current_spot
        		print sounds[0][0]

        	if sensor.get_touch_data(7):
        		current_spot = (last_time*1000) + pygame.mixer.music.get_pos()
        		current_spot = current_spot/1000
        		print current_spot
        		sounds[0][1] = current_spot
        		print sounds[0][1]
        	if sensor.get_touch_data(8):
        		current_spot = (last_time*1000) + pygame.mixer.music.get_pos()
        		current_spot = current_spot/1000
        		print current_spot
        		sounds[0][2] = current_spot
        		print sounds[0][2]
        	if sensor.get_touch_data(9):
        		current_spot = (last_time*1000) + pygame.mixer.music.get_pos()
        		current_spot = current_spot/1000
        		print current_spot
        		sounds[0][3] = current_spot
        		print sounds[0][3]




        # if sensor.get_touch_data(6):
        #   pygame.mixer.music.load(sound_two)
        #   pygame.mixer.music.stop()
        #   pygame.mixer.music.play()
        # if sensor.get_touch_data(7):
        #   pygame.mixer.music.load(sound_two)
        #   pygame.mixer.music.stop()
        #   pygame.mixer.music.play(0, 30.0)
        # if sensor.get_touch_data(8):
        #   pygame.mixer.music.load(sound_two)
        #   pygame.mixer.music.stop()
        #   pygame.mixer.music.play(0, 58.95)
        

    # light up red led if we have any touch registered currently
    if is_any_touch_registered:
      light_rgb(1, 0, 0)
    else:
      light_rgb(0, 0, 0)

  # sleep a bit
  sleep(0.01)


