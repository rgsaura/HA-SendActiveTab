# HA-CinemaTime

This is a browser extension to automate things on Homeassistant when you have a specific tab being displayed on your browser. I use it for turning Hyperion on when I'm watching Netflix. But what the extension does is turn "on" and "off" a "virtual" switch which you can subscribe to with automations and do whatever else you want to do.

## Modified by @rgsaura

It sends active Tab name, if you are at https://github.com/rgsaura/HA-SendActiveTab/edit/master/README.md it sends "Editing HA-SendActiveTab/README.md at master · rgsaura/HA-SendActiveTab", the text on the actual Tab.

<img src="https://github.com/rgsaura/HA-SendActiveTab/assets/16281075/e9a1f34f-573b-43ff-8d14-593b320e3a06" height="200">
<img src="https://github.com/rgsaura/HA-SendActiveTab/assets/16281075/a44c9763-8e2e-42ed-97c1-6c01c3253ec4" height="200">


## Installing the extension

### Ready to use

- Mozilla: https://addons.mozilla.org/es/firefox/addon/ha-cinematime/
- Chrome: LOL I ain't paying Google to publish a free extension. See instructions to install from source.

### From source

To install the extension "from source", it's easy to do in Chrome. Just clone the project and go to Addons, Manage Extension, Load Unpacked. Then select the directory where you cloned this.

For Firefox it's pretty much impossible unless you run Firefox Developer Edition or Nightly (the extension needs signing and you can't disable this option on regular firefox)

## Setting things up on HA

#### 1. Add the virtual switch

Go to Configuration, Helpers, click Add Helper, select Toggle
use something like name: streaming_website, icon: mdi:movie-roll

#### 2. Get your API key

Go to your profile (hint: your name, the last element in the HA menu, below Configuration)
Create a Long Lived Access Token. The name isn't important. Copy the key

#### 3. Click the extension and set the required fields

(tip: Click SAVE after entering every field since mozilla will close the configuration window and you'll lose the changes. Chrome doesn't seem to do this)

- HA Host: your Homeassistant host, such as http://homeassistant.local:8123/ (or whatever your protocol, host, and port are)
- API Key: the api key you got in step 2.
- Sites: enter a list of sites separated by semicolon. Example: netflix.com;youtube.com;disney.com
- Device: the virtual switch you created in step 1, for the example provided it will be: input_boolean.streaming_website

#### 4. Write an automation on Homeassistant to do things when a whitelisted website is enabled.

If you're using the Hyperion integration, make sure you enable the "led device" entity, which is the entity that turns LEDs on and off.

Example:

```yaml
alias: Turn on hyperion when streaming
description: ""
trigger:
  - platform: state
    entity_id: input_boolean.streaming_website
    from: "off"
    to: "on"
condition: []
action:
  - type: turn_on
    entity_id: switch.hyperion_leds_component_led_device
    domain: switch
mode: single
```

#### 5. Write an automation for turning Hyperion off:

Example:

```yaml
alias: Turn off hyperion when not streaming
description: ""
trigger:
  - platform: state
    entity_id: input_boolean.streaming_website
    from: "on"
    to: "off"
condition: []
action:
  - type: turn_off
    device_id: 8197e1a4af81fcbfc1e88abe08cd3f62
    entity_id: switch.hyperion_leds_component_led_device
    domain: switch
mode: single
```
