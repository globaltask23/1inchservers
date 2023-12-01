const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
const PORT = 5000
require('dotenv').config()
const Moralis = require('moralis').default
app.use(cors())

app.get('/', async(req, res)=>{
    const url = "https://api.1inch.dev/swap/v5.2/1/approve/allowance";

    const config = {
        headers: {
    "Authorization": process.env.ONE_INCH_KEY
  },
        params: {
    "tokenAddress": req.query.tokenAddress,
    "walletAddress": req.query.walletAddress
  }
    };
        
  
    try {
      const response = await axios.get(url, config);
      const data ={
        allowance :response.data.allowance
      }
      return res.status(200).json(data)
    } catch (error) {
      console.error(error);
    }
})

app.get('/tokenprice', async(req, res)=>{
    const response1 = await Moralis.EvmApi.token.getTokenPrice({
        address: req.query.tokenAddress1
    })

    const response2 = await Moralis.EvmApi.token.getTokenPrice({
        address: req.query.tokenAddress2
    })
   const usdPrices={
    token1: response1.raw.usdPrice,
    token2: response2.raw.usdPrice,
    ratio: response1.raw.usdPrice/response2.raw.usdPrice
   }
   return res.status(200).json(usdPrices)
})
app.get('/approve', async(req, res)=>{
    const url = "https://api.1inch.dev/swap/v5.2/1/approve/transaction";
    
    const config = {
        headers: {
    "Authorization": process.env.ONE_INCH_KEY
  },
        params: {
    "tokenAddress": req.query.tokenAddress
  }
    };
        
    try {
      const response = await axios.get(url, config);
      return res.json(response.data);
    } catch (error) {
      console.error(error);
    }
  
})

Moralis.start({
    apiKey: process.env.MORALIS_KEY
}).then(()=>{
    app.listen(PORT, () => {
        console.log(`Proxy server is running at http://localhost:${PORT}`);
      });
})