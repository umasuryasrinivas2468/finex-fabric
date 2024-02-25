User
 'use strict';

 const { Contract } = require('fabric-contract-api');

 class FinexContract extends Contract {

     async initLedger(ctx) {
         console.info('============= START : Initialize Ledger ===========');
         const assets = [
             {
                 owner: 'Alice',
                 value: 100,
             },
             {
                 owner: 'Bob',
                 value: 200,
             },
         ];

         for (const asset of assets) {
             asset.docType = 'asset';
             await ctx.stub.putState(asset.owner, Buffer.from(JSON.stringify(asset)));
             console.info(Added <--> ${asset.owner});
         }
         console.info('============= END : Initialize Ledger ===========');
     }

     async queryAsset(ctx, owner) {
         const assetAsBytes = await ctx.stub.getState(owner);
         if (!assetAsBytes || assetAsBytes.length === 0) {
             throw new Error(${owner} does not exist);
         }
         console.log(assetAsBytes.toString());
         return assetAsBytes.toString();
     }

     async createAsset(ctx, owner, value) {
         console.info('============= START : Create Asset ===========');

         const asset = {
             owner,
             value,
             docType: 'asset',
         };

         await ctx.stub.putState(owner, Buffer.from(JSON.stringify(asset)));
         console.info('============= END : Create Asset ===========');
     }

     async queryAllAssets(ctx) {
         const startKey = '';
         const endKey = '';
         const allResults = [];
         for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
             const strValue = Buffer.from(value).toString('utf8');
             let record;
             try {
                 record = JSON.parse(strValue);
             } catch (err) {
                 console.log(err);
                 record = strValue;
             }
             allResults.push({ Key: key, Record: record });
         }
         console.info(allResults);
         return JSON.stringify(allResults);
     }
 }

 module.exports = FinexContract;