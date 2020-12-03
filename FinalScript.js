// Import Cropland Data 
var crop = ee.Image('USGS/GFSAD1000_V1');

// Create visualization parameters for crop layer. Color palette suggested in metadata. 
var cropMaskVis = {
  min:0, 
  max:5, 
  palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow’];
// Add crop layer to map
Map.addLayer(crop, cropMaskVis, 'Cropland’);

// Center the map on the geometry variable, and set the zoom level
Map.centerObject(SiouxFalls, 5); 

// Color Palette for rainfed cropland 
var cropMaskVis2 = {
  min: 2.0,
  max: 5.0,
  palette: ['White', 'DarkGreen', 'SeaGreen', 'DarkSeaGreen'],
};
// Add Rainfed cropland map 
Map.addLayer(crop, cropMaskVis2, 'Rainfed Croplands, dif');

// Create a variable of only rainfed agriculture
var rainfed = crop.gte(3);
print(rainfed);

Map.addLayer(rainfed, {palette: ['White', 'OliveDrab']}, 'Rainfed Boolean’);

// Import Drought Data 
var GRIDMET = ee.ImageCollection('GRIDMET/DROUGHT');

// Filter GRIDMET Image collection by date 
var dS = '2012-09-11';
var dE = '2012-09-11';
var dSUTC = ee.Date(dS, 'GMT');
var dEUTC = ee.Date(dE, 'GMT');
var filtered = GRIDMET.filterDate(dSUTC, dEUTC.advance(1, 'day'));

// Print out all dates included in the image collection.
print(GRIDMET.aggregate_array('system:index'));

// Select SPI 1-year aggregated data from Image Collection 
var SPI = filtered.select('spi1y');'

// Create visualization parameters for  SPI layer
var SPIColors = ['DarkRed', 'White', 'DarkGreen'];
var SPIVis = {
  min: -2.5,
  max: 2.5,
  palette: SPIColors
};
// Add crop layer to map
Map.addLayer(SPI.first(), SPIVis, 'SPI-1year');

// Select dry and drought areas from SPI
var dryareas = SPI.first().lte(-0.5);
var droughtareas = SPI.first().lte(-1.6);

// Add Boolean layers to map
Map.addLayer(dryareas, {palette: 'White, Burlywood'}, 'Dry Areas');
Map.addLayer(droughtareas, {palette: 'White, FireBrick'}, 'Drought Areas')

// Overlay cropland and drought data 
var AgRisk = rainfed.multiply(dryareas);
var HighAgRisk = rainfed.multiply(droughtareas);
Map.addLayer(AgRisk, {palette:['white', 'GoldenRod']}, 'Rainfed Ag in Dry Areas');
Map.addLayer(HighAgRisk,{palette:['white', 'DarkRed']}, 'Rainfed Ag in Drought Areas');