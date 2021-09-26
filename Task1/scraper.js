const axios = require("axios");
const htmlparser = require("htmlparser2")

// common variables
var tags = [];
var tagsDictionary = {};
var listOfTagsWithCount = [];
var listOfDuplicates = []

// html parser to extract tags and build a dictionary of tags with their count
var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
        if(tags.indexOf(name) === -1) {
            tags.push(name);
            tagsDictionary[name] = 1;
        } else {
            tagsDictionary[name]++;
        }
    },
    onend: function() {
        for(var i = 0; i < tags.length; i++) {
            listOfTagsWithCount.push({name: tags[i], count: tagsDictionary[tags[i]]});
        }
    }
}, {decodeEntities: true});

// To fetch HTML data from Url and parse the HTML data obtained
async function fetchPage() {
  try {
    let response = await axios.get('https://godsunchained.com/');
    let htmlData = await response.data
    parser.write(htmlData)  // initiate parser  
    parser.end() // end parser
    
   // console.log('tags are:', tags)
   // console.log('count:', tagsDictionary)
   // console.log('tags with Count of repeat:', listOfTagsWithCount)

   // to filter out duplicates and print it 
    for (index = 0; index < listOfTagsWithCount.length; index++) {
        if (listOfTagsWithCount[index]['count'] > 1){
            listOfDuplicates.push(listOfTagsWithCount[index]['name'])
        }
    }
    var sortedListOfDuplicates = listOfDuplicates.sort()
    console.log('-------------The duplicate tags in sorted order----------------------------')
    console.log(sortedListOfDuplicates)
    console.log('---------------------------------------------------------------------')

    console.log('-------------The unique tags in sorted order----------------------------')
    console.log(tags.sort())
    console.log('---------------------------------------------------------------------')
   
    }catch(e) {
    console.log(e);
  }
}

fetchPage();

