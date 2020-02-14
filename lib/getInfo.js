const rq = require('request-promise');
const d = require('date-fns');

const URL = "https://bravenewcoin-v1.p.rapidapi.com/ticker";

// getInfo obtains the observed price and date of observation of the currency
// and the info in current currency
// format: object
//   show: string <ex: 'usd'>
//   coin: string <ex: 'btc'>
// headers: object <ex: {'Content-Type': 'application/json'}>
// It returns a Promise wrapping an object:
// lastObservedPrice: string
// dateOfLastObservation: string
const getInfo = async (format, headers) => {
  try {
  const options = {
    uri: URL,
    qs: {
      ...format,
    },
    headers: {
      ...headers,
    },
    json: true,
  };

    const response = await rq(options);

    // Transform the response
    const transformed = transformResponse(response)

    if (!transformed.ok) {
      throw transformed.error
    }

    // Cleanup the return
    delete(transformed.ok)

    return { ...transformed }
  } catch (e) {
    return {
      error: e,
    }
  }
};

// transformResponse modifies the info to the correct form that is compliant
// with ours
// It returns and object in success:
//   ok: boolean
//   lastObservedPrice: string
//   dateOfLastObservation: string
// It returns and object in error:
//   ok: boolean
//   error: string
const transformResponse = ({ utc_date, last_price }) => {
  try {
    // Obtain the date
    // Validate the string is a date
    if (!d.isValid(new Date(utc_date))) {
      throw "Invalid date of observance: " + utc_date
    }

    // Parse the date to the format that we want
    const dateOfLastObservation = d.format(d.parseISO(utc_date), "dd/MM/yyyy")

    // Obtain the price in the format that we want
    const lastObservedPrice = parseFloat(last_price).toFixed(2)
    // Validate is not NaN
    if (Number.isNaN(lastObservedPrice)) {
      throw "Invalid price: " + lastObservedPrice
    }

    return {
      ok: true,
      lastObservedPrice,
      dateOfLastObservation,
    }
  } catch (e) {
    return {
      ok: false,
      error: e,
    }
  }
};

module.exports = getInfo;
