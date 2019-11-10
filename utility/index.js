
var commonconstant = require("./commonconstant");
var util = require("util");
var fs = require("fs");
var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);

module.exports={
    sendSuccessResponse: (res, content) => {
        res.statusCode = commonconstant.SUCCESS_RESPONSE;
        res.setHeader("content-type", commonconstant.RESPONSE_TYPE_JSON);
        res.json(content);
    },
    sendBadReqResponse: (res, content) => {
        res.statusCode = commonconstant.BAD_RESPONSE;
        res.setHeader("content-type", commonconstant.RESPONSE_TYPE_JSON);
        res.json(content);
    },
    sendInternalServErrorResponse: (res, content) => {
        res.statusCode = commonconstant.INETERNAL_ERROR_RESPONSE;
        res.setHeader("content-type", commonconstant.RESPONSE_TYPE_JSON);
        res.json(content);
    },
    readJsonFile: async()=>{
        try{
            let data = await readFile(`${process.cwd()}${commonconstant.JSON_FILE_PATH}`);
            let jsonData = JSON.parse(data);
            return jsonData;
        }catch(err){
            console.log(err);
        };
    },
    writeJsonFile: async(data)=>{
        try{
            let res = await writeFile(`${process.cwd()}${commonconstant.JSON_FILE_PATH}`, JSON.stringify(data), 'utf8');
            return res;
        }catch(err){
            console.log(err);
        };
    }
}