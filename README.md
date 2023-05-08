# Sentinel-Core
Hello! This is my first coding project. 

Sentinel is a Flask Web Application aimed at helping users visualize their data on a geographic map. 
Utilising the Leaflet API, the programme takes in data from a database and iterates through it to create and plot its respective entries and markers on the interface. 

Program Features
- Allows users to create and delete their own data entries
- Allows users to upload appropriately formatted excel sheets read as a csv
- Allows for dynamic filtering of data based on entry attributes
- Allows for toggling of filter layers for markers and heatmap layers
- Allows wipe of database from the main interface

--A Brief Rundown Of The Program--

A. The Main Interface and Key Features
Loading up Sentinel on your browser brings you to the main interface of the program. Here there are a few key features to highlight.

1. The Top Bar
1a) Filter Data Button 
1b) Insert Dataset Button
1c) Clear Map Button

2. The Side Bar
2a) Add Entry Button (Plus Button)
2b) Entries 

3. The Map
3a) Layer Control Toggle
3b) Marker
3c) Heatmap 

B. Manual Input and Deletion of Entries
Users can input their own entries manually by first clicking on the Add Entry button (Plus button) in the Side Bar. This will bring up a form over the sidebar where a user can input data into. The form is split into two sections - Key Facts and Additional Facts. Key Facts must be filled in while Additional Facts are optional.

Location and Address in the form mean different things. The Location is the Latitude and Longitude of where the datapoint is located geographically. This can be filled in easily by navigating to the map on the side and right clicking the location for which you would like a marker/heatmap to appear; the location will automatically be filled out for you on the form. The address however is the name of the street, avenue, block number etc of the location you have chosen. 

Fill in the rest of the information as follows and click create. The page should reset and a new entry will appear in the Side Bar under the list of entries. 

If you have decided to not fill in a new entry, you can easily exit out of the form by pressing the X button on the top of the form which will remove it from view.

Clicking on an entry will open up a window with an expanded view of the entry's details. Here you can find the Delete Entry button at the bottom of this window which will delete the entry from the dataset if needed. 

C. Filtering Datasets
Users can filter their datasets in many ways. For now, Sentinel is configured to filter through date ranges, time ranges and situation types as specified on the data entries. To filter, press the Filter Data button on the Top Bar. This will bring up a form in the center of the screen where users can specify the ranges of data they would like to select for filtering. (This is a positive select in that entries whose variables fulfill the filter range put into the form will be filtered in and not out) You can select multiple situation types by ctrl+clicking the chosen situations. The Filter Data button will begin the filtering process and reset the page with the new filtered data.

To restore the page to the full data set, simply send an empty filter data form. 

The Map also has a filtering feature in the form of a toggle. By clicking on the toggle on the top right of the Map, it expands it to show to variables -  Marker and Heatmap. You can make all heatmaps or all markers appear or disappear independently by checking and unchecking each variable in the toggle. 

D. Mass Input of Dataset and Mass Deletion (Via Upload)
With a properly formatted excel sheet, you can put in mass datasets into the program without putting them in manually. The variables needed for this to work properly requires the same variables for the manually input form described above. (Unfortunately this means finding the individual lat, lngs of all your datapoints beforehand.)
The Insert Dataset button in the Top Bar will bring up a form where a user can submit a file into the program to be processed as a dataset. Please choose the appropriate dataset for this to work. The Submit File button will refresh the page with the new filtered dataset. 

To delete the dataset entirely, press the Clear Map button on the Top Bar. This will permanently wipe the dataset from the program, giving you a fresh slate. 
