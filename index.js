const getInfo = require('./lib/getInfo');

(async function(){
  try {
    const headers = {
      "x-rapidapi-key": "",
      "x-rapidapi-host": "",
    };

    const info = {
      coin: 'btc',
      show: 'usd'
    }

    console.log(await getInfo(info, headers));
  } catch (e) {
    console.error(e);
  }
})();
