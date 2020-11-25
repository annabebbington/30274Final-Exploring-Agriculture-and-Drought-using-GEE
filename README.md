# Identifying US Cropland that is Vulnerable to Drought

This Google Earth Engine tutorial uses two raster datasets to identify agricultural areas in the continental US that are vulnerable to drought. This analysis uses cropland data to identify cropland that is rainfed (vs. irrigated), and a drought index to identify areas that are experiencing dry or drought conditions. 

### The Data

The [GFSAD dataset](https://developers.google.com/earth-engine/datasets/catalog/USGS_GFSAD1000_V1)  from the Global Food-Security Suppport Analysis Data Project maps where global cropland is rainfed or irrigated. 
> The GFSAD is a NASA-funded project to provide high-resolution global cropland data and their water use that contributes towards global food security in the twenty-first century. The GFSAD products are derived through multi-sensor remote sensing data (e.g., Landsat, MODIS, AVHRR), secondary data, and field-plot data and aims at documenting cropland dynamics.

The GFSAD data contains 6 categories: 

> 0 - non-croplands
> 
> 1 - Croplands: irrigation major
> 
> 2 - Croplands: irrigation minor 
> 
> 3 - Croplands: rainfed
> 
> 4 - Croplands: rainfed, minor fragments
> 
> 5 - Croplands: rainfed, very minor fragments
> 


The [GRIDMET DROUGHT: CONUS Drought Incides](https://developers.google.com/earth-engine/datasets/catalog/GRIDMET_DROUGHT) provides multiple drought indices at 4km resolution. This tutorial uses the standardised precipitation index (SPI), which follows the follwing breakdown: 

> 2.0 or more (extremely wet)
>
> 1.6 to 1.99 (very wet)
>
> 1.3 to 1.59 (moderately wet),
> 
> 0.8 to 1.29 (slightly wet)
> 
> 0.5 to 0.79 (incipient wet spell)
> 
> -0.49 to 0.49(near normal),
> 
> -0.79 to -0.5 (incipient dry spell)
> 
> -1.29 to -0.8 (mild drought)
> 
> -1.59 to -1.3 (moderate drought)
> 
> -1.99 to -1.6 (severe drought)
> 
> -2.0 or less (extreme drought).



## Mapping Cropland Data 

Begin by importing the Cropland data as a GEE image. 

```
// Import Cropland Data 
var crop = ee.Image('USGS/GFSAD1000_V1');
```
Next, we create the visualization parameters for the cropland data. The color palette used below is taken from the metadata, but feel free to change the colors. The `min` and `max` values are based on the values associated with the 6 landcover categories.  
```
// Create visualization parameters for crop layer. Color palette suggested in metadata. 
var cropMaskVis = {
  min:0, 
  max:5, 
  palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow'],
```
Add the layer to the map, and make sure to give the layer a descriptive name to keep track of different layers as we add more throughout this tutorial. 
```
// Add crop layer to map
Map.addLayer(crop, cropMaskVis, 'Cropland')
```
The output map is a global map showing non-croplands and croplands that are either irrigated or rainfed, and should look something like this: 

![cropland](CropLand.png)

To focus the extent of the map for this tutorial, we are going to zoom in on the Midwest, specifically Sioux Falls, South Dakota. 
You can do this in one of two ways. First is to use the `Add a marker` feature in the GEE map window. Add the marker to Sioux Falls, or wherever you would like to focus the map, and the geometry will automatically import as a new variable `geometry`. Rename the variable with a geographic or descriptive name. We are then going to center the map on the geometry variable using `Map.centerObject(geometry variable, zoom)`. 
```
// Center the map on the geometry variable, and set the zoom level
Map.centerObject(SiouxFalls, 5); 
```
You can also use `Map.setCenter(long,lat, zoom)` to center the map on latitude and longitude, and again set the zoom level.
```
// Center the map using lat and long
Map.setCenter(-96.7313, 43.5460, 5); 
```
![croplandzoom](CropLand_zoom.png)

#### Identifying Areas with Only Rainfed Cropland 
The cropland map is quite busy and a little hard to interpret. For the purpose of this tutorial we are interested in just the rainfed cropland, since it is more vulnerable to periods of drought. First we are going to visualize the different categories of rainfed agriculture by creating new visualization parameters. Since we are only interested in values 3, 4, and 5, we will set the minimum value at 2. This will group together all categories with values 2 and below. The palette needs four colors, one for each of the remaining rainfed categories, and one for the non-rainfed categories. Add the new map layer, and make sure to include a descriptive layer name.
```
// Color Palette for rainfed cropland 
var cropMaskVis2 = {
  min: 2.0,
  max: 5.0,
  palette: ['white', '006400', '2E8B57', '8FBC8F'],
};
// Add Rainfed cropland map 
Map.addLayer(crop, cropMaskVis2, 'Rainfed Croplands, dif');
```
![Rainfed_dif](Rainfed_dif.png)


## Drought Data 

## Indentifying At-Risk Agricultural Areas 

#### Creating Boolean Maps


