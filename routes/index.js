var express = require('express');
var router = express.Router();
var utility = require("../utility");
var fs = require("fs");

// get All data
router.get('/', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

// add card
router.post('/addcard', async function(req, res, next) {
  try{
    console.log(req.body);
    let data = await utility.readJsonFile();
    let postData = req.body;
    postData.id = (data.cards.length > 0 ? data.cards[data.cards.length - 1].id + 1 : 1);
    data.cards.push(postData);
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

// add card
router.post('/addcolumn', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    let postData = req.body;
    postData.id = (data.columns.length > 0 ? data.columns[data.columns.length - 1].id + 1 : 1);
    data.columns.push(postData);
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

router.put('/editcard/:id', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    data.cards.map(cardData => {
      if(cardData.id == req.params.id){
        cardData.title = req.body.title;
        cardData.description = req.body.description;
        cardData.columnId = req.body.columnId;
      }
    });
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

router.put('/editcolumn/:id', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    data.columns.map(columnData => {
      if(columnData.id == req.params.id){
        columnData.title = req.body.title;
      }
    });
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

router.delete('/deletecolumn/:id', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    data.cards = data.cards.filter((cardData)=>{
      return (cardData.columnId == req.params.id)? false : true;
    })
    let idx = data.columns.findIndex(col => col.id == req.params.id);
    data.columns.splice(idx,1);
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

router.delete('/deletecard/:id', async function(req, res, next) {
  try{
    let data = await utility.readJsonFile();
    let idx = data.cards.findIndex(col => col.id == req.params.id);
    data.cards.splice(idx,1);
    let resData = await utility.writeJsonFile(data);
    utility.sendSuccessResponse(res, {"data": data});
  } catch (err){
    console.log(err);
  }
});

module.exports = router;
