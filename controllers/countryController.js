require('dotenv').config();
const axios = require('axios');

async function getAllContries(req, res) {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/independent?status=true');
        const allDataContries = response.data;
        const contries = allDataContries.map(contrie => {
            return {
                name: contrie.name.common,
                currencies: Object.keys(contrie.currencies)
            }
        });
        return res.status(200).json({ contries });
    } catch (e) {
        console.log(e);
    }
};

async function convertCurrencies(req, res) {
    const { currency, currencyToConvert, money = 1 } = req.body || {};
    if(!currency) {
        return res.status(401).json({ msg  : "currency is required" });
    };
    if(!currencyToConvert) {
        return res.status(401).json({msg : "currencyToConvert is required"});
    };
    if(!money) {
        return res.status(401).json({ msg : "money is required"});
    };

    try{
        const apikey = process.env.API_KEY;
        const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest?base_currency=${currency}&currencies=${currencyToConvert}`, {
            headers: {
                apikey: apikey
            }
        });
        const currencyValue = response.data.data[currencyToConvert];
        res.status(201).json(
            {
                value : currencyValue * money
            }
        );
    }
    catch(e) {
        console.log(e);
    }
};

module.exports = {
    getAllContries,
    convertCurrencies
};