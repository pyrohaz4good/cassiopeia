#!/usr/bin/python
from bs4 import BeautifulSoup
from bs4.element import NavigableString
import urllib2
import json

URL = 'http://www.united.com/web/en-US/content/travel/destination/routes/served.aspx'

def main():
    """ Extracts the list of possible United destinations from their site.
        Outputs as a javascript file that initializes a variable called
        'destinations' that has a list of {id,text} suitable for use with
        Select2 """
    f = urllib2.urlopen(URL)
    page = f.read()
    bs = BeautifulSoup(page)
    results = []
    start = bs.find(text="Served By").parent.parent
    for sibling in start.next_siblings:
        code = ''
        airport = ''
        if type(sibling) == NavigableString:
            continue
        for i,entry in enumerate(sibling.find_all("td")):
            if i == 0:
                airport = entry.string
            elif i == 1:
                code = entry.string
        results.append({'id':code, 'text':airport})
    print "/* Auto-generated by destinations.py */"
    print "var destinations = " + json.dumps(results, sort_keys=True, indent=4) + ";"

if __name__ == '__main__':
    main()
