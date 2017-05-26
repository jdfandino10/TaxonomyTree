# TaxonomyTree

A tool to allow researchers and students understand the tree of life of species visually. With this application you can create any Taxonomic tree given the species. Also, you can visualize information* about the species on your tree. Create a user to be able to save and load your creations! 

***Information is from [iNaturalist](http://www.inaturalist.org)**

Visit the demo of the [application](https://taxonomytree.herokuapp.com/)

## Development/Run
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/210f1bde68b54b0e948542d786aa6d5a)](https://www.codacy.com/app/dalthviz/TaxonomyTree?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jdfandino10/TaxonomyTree&amp;utm_campaign=Badge_Grade)
[![CircleCI](https://circleci.com/gh/jdfandino10/TaxonomyTree/tree/master.svg?style=svg)](https://circleci.com/gh/jdfandino10/TaxonomyTree/tree/master)

In order to run this application you will need [Meteor](https://www.meteor.com/)

Then clone this repository with:
`git clone https://github.com/jdfandino10/TaxonomyTree.git`

Install the dependencies:

`meteor npm install`

And run the application:

`meteor run`

Also if you want to run the test locally run:

`meteor test --driver-package dispatch:mocha`

Or for a view of the results in the browser:

`meteor test --driver-package practicalmeteor:mocha`

**Note:** The application in your local environment will work with a local database created by meteor.

## Resources

This application uses:

* [d3](https://github.com/d3/d3)
* [OpenLayers](https://github.com/openlayers/openlayers)
* [iNaturalist](https://github.com/inaturalist/inaturalist)
* [OpenTreeOfLife](https://github.com/OpenTreeOfLife/germinator)

