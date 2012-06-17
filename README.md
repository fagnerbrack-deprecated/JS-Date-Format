JS Date Format
==============================
*Requires [utils]()*

JSDateFormat helps you to format/parse your Date

Usage
-----
<pre>
var dateFormat = new JSDateFormat("The day is %d%d, the month is %M%M and the year is %y%y%y%y");
dateFormat.format( new Date(2012, 0, 1) ); //The day is 01, the month is 01 and the year is 2012
dateFormat.format( new Date(2012, 0, 1).getTime() ); //The day is 01, the month is 01 and the year is 2012
</pre>

Format
-----
* %d%d - Day of month (01, 02...20,21)
* %M%M - Month of Year (03, 04...11, 12)
* %y%y%y%y - Year (001990, 02008, 2009, 009, 09, 9)
* %h%h - Hour AM/PM (00, 01...11, 12)
* %H%H - Hour of day (00, 01...17, 18)
* %m%m - Minutes in hour (05, 06...50, 51...59, 60)
* %s%s - Seconds in minute (05, 06...50, 51...59, 60)
* %a%a - (AM, PM)
* %WEEK - Day of week according to the DAYS_OF_WEEK variable

Changelog
--------
1.0 - Initial release
1.0.1 - Code style change and some minor modifications.