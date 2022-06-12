# Scraping Little Free Libraries 📚

## Background
We want to send a copy of a book to all Little Free Libraries in Indiana. We can generate that list by using their undocumented, public API.

## Working with the API

* Search for a list of libraries:
<br />https://appapi.littlefreelibrary.org/library/pin.json?page_size=50&distance=50&near=indiana
* Fetch an individual library
  * https://appapi.littlefreelibrary.org/libraries/65843.json
  * https://appapi.littlefreelibrary.org/libraries/38071.json

* To check if Indiana, use `State_Province_Region__c` as the state 


## Output format

Mapping from API resources to spreadsheet columns below:
|Column Name |Property|
--- | --- |
|Name of library|			`List_As_Name__c`|
|Person’s name|			`Primary_Steward_s_Name__c`|
|Person’s email|				`Primary_Steward_s_Email__c`|
|Street address|  `Street__c`|
|City|					`City__c`|
|Zipcode|				`Postal_Zip_Code__c`|
|State|					`State_Province_Region__c`|

