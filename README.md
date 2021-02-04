# Software for IPSJ International AI Programming Contest
#   SamurAI Coding 2020-21

## Documents
### Game Rules
The rules of the game SamurAI Dig Here 2020 can found in the following files.

* English version: [documents/rules.html](documents/rules.html)
* Japanese version: [documents/rules-jp.html](documents/rules-jp.html)
### Game Manager
The manuals for the game manager are in the following files.

* English version: [documents/manager.html](documents/manager.html)
* Japanese version: [documents/manager-jp.html](documents/manager-jp.html)
### Web Page
The manuals for the game log visualizer web page are in the following files.

* English version: [documents/help.html](documents/help.html)
* Japanese version: [documents/help-jp.html](documents/help-jp.html)
### Other Documents
Some hints on playing tactics are under preparation.

## Getting Started
### Prerequisites
* C++ development environment
	* A compiler and standard libraries for c++14 or later is required.
	* There are known problems on the Cygwin environment.
Please consider using WSL (Windows Subsystem for Linux) on windows.
* A web browser
A web browser is required for viewing the documents,
visualizing replays of games,
and also for editing game field configurations.
The web page for the game is known to work
on the following systems and browsers.
	* Ubuntu: Chrome (85.0.4183.121), Firefox (80.0.1), Opera (71.0.3770.171)

### Installing

Issue the following in the top-level directory.

```
$ make all
```

This will make the following software.

* manager/manager
   Game management system
* players/simplePlayer
   A simple sample player AI
* players/randomPlayer
   A player with random plays
* players/timeoutPlayer
   A player that sometimes falls asleep

## Testing

### Test Run
Issue the following in the top-level directory.

```
$ make testrun
```

This will play a game between two simple players and output a log in the file [samples/testout.dighere](samples/testout.dighere).

### Viewing the Result

Open the web page [webpage/dighere.html](webpage/dighere.html) with a
web browser.  Clicking the ![Image](icons/import.png "import button"),
a file selection dialog will pop up.  Select the game log
[samples/testout.dighere](samples/testout.dighere), to load it.  You
can visualize the recorded game by clicking the play button on screen
top.

The manual for using the web page can be visited by clicking the
button with a question mark icon on top right of the page.

## Game Field Settings

A number of files containing game field setting, with the file name extension
of .dighere can be found in [maps](maps) directory.

The directory [preliminary-candidates](maps/preliminary-candidates) contains
field settings candidates for both the preliminary and the final rounds,
except that hidden treasures are not buried yet.

## Authors

* **Takashi Chikayama** - *Initial version*

## License

This software is distributed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

A part of the project (picojson) is licenced by Cybozu Labs, Inc. and Kazuho Oku.
See [manager/picojson.h](manager/picojson.h) for details.

## Acknowledgments

Members of the Programming Contest Committee of Information Processing Society of Japan helped designing the game and testing the system, whose names are listed below.

* Committee Members: 
Daisaku Yokoyama (Chair), Tasuku Hiraishi (Vice Chair), Hironori Washizaki (Executive Advisor), Takashi Chikayama, Shingo Takada, Yuki Kobayashi, Kazunori Sakamoto, Makoto Miwa, Kenta Cho, Yutaka Matsuo, Noriko Fukasawa, Kiyokuni Kawachiya, Taizo Kinoshita
