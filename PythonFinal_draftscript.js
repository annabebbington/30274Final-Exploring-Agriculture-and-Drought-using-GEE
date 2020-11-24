{\rtf1\ansi\ansicpg1252\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red236\green236\blue236;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0\c87059;\cssrgb\c94118\c94118\c94118;}
\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Import datasets \
var crop = ee.Image.(\'91USGS/GFSAD1000_V1\'92)\
var GRIDMET = ee.ImageColelction(\'91GRIDMET/DROUGHT\'92)\
\
// Point Geometry to center map around \
var SiouxFalls = ee.Geometry.Point(
\f1\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 -96.74399586222391,43.53429384775252)
\f0\fs24 \cf0 \cb1 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 \
\
// Filter GRIDMET Image collection by date \
var dS = '2012-09-11';\
var dE = '2012-09-11';\
var dSUTC = ee.Date(dS, 'GMT');\
var dEUTC = ee.Date(dE, 'GMT');\
var filtered = GRIDMET.filterDate(dSUTC, dEUTC.advance(1, 'day'));\
\
// Select SPI 1-year aggregated data from Image Collection \
var SPI = filtered.select('spi1y');\
\
// Map SPI Data \
// Create color parameters\
var SPIColors = '8B0000, FFFFFF, 006400';\
var SPIVis = \{\
  min: -2.5,\
  max: 2.5,\
  palette: SPIColors\
\};\
// Add SPI map layer and center map on Midwest (Sioux Falls)\
Map.addLayer(SPI.first(), SPIVis, 'SPI-1year');\
Map.centerObject(SiouxFalls, 5); \
\
// Select only dry areas from SPI\
var dryareas = SPI.first().lte(-0.5);\
print(dryareas);\
var droughtareas = SPI.first().lte(-1.6);\
\
Map.addLayer(dryareas, \{palette: 'white, black'\}, 'Dry Areas');\
Map.addLayer(droughtareas, \{palette: 'FFFFFF, 8B0000'\}, 'Drought Areas')\
\
// Add Crop data \
var cropMask = crop.select('landcover');\
var cropMaskVis = \{\
  min:0, \
  max:5, \
  palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow'],\
\};\
\
// Add crop layer to map using default palette\
Map.addLayer(cropMask, cropMaskVis, 'Crop Mask')\
\
// Color Palette for rainfed cropland \
var cropMaskVis2 = \{\
  min: 2.0,\
  max: 5.0,\
  palette: ['white', '006400', '2E8B57', '8FBC8F'],\
\};\
\
// Add Rainfed cropland map \
Map.addLayer(cropMask, cropMaskVis2, 'Rainfed Croplands, dif');\
\
// Create a variable of only rainfed agriculture\
var rainfed = cropMask.gte(3)\
print(rainfed)\
\
Map.addLayer(rainfed, \{palette: ['FFFFFF', '6B8E23']\}, 'Rainfed Boolean')\
\
var AgRisk = rainfed.multiply(dryareas);\
var HighAgRisk = rainfed.multiply(droughtareas);\
Map.addLayer(AgRisk, \{palette:['white', 'blue']\}, 'Rainfed Ag in Dry Areas');\
Map.addLayer(HighAgRisk,\{palette:['white', 'pink']\}, 'Rainfed Ag in Drought Areas');}