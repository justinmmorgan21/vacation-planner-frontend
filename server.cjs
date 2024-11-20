require('dotenv').config()
const { getJson } = require("serpapi");
const { createServer } = require('node:http');
const axios = require("axios");

const hostname = '127.0.0.1';
const port = 3001;

const serpApiKey = process.env.SERPAPI_API_KEY;
const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

const server = createServer(async (req, res) => {
  
  const allowed_domain = "http://localhost:5173"; // Specify the client's domain here
  const method = req.method.toUpperCase();

  res.setHeader("Access-Control-Allow-Origin", allowed_domain);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests (OPTIONS method)
  if (method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const searchParams = url.searchParams;

  if (path === "/search-flights") {
    console.log("key", serpApiKey);
    // Handle the request for flight search
    const engine = searchParams.get("engine");
    const departure_id = searchParams.get("departure_id");
    const arrival_id = searchParams.get("arrival_id");
    const outbound_date = searchParams.get("outbound_date");
    const return_date = searchParams.get("return_date");
    const departure_token = searchParams.get("departure_token");
    const booking_token = searchParams.get("booking_token");

    try {
      const response = await getJson({
        api_key: serpApiKey,
        engine: engine,
        hl: "en",
        gl: "us",
        departure_id: departure_id,
        arrival_id: arrival_id,
        outbound_date: outbound_date,
        return_date: return_date,
        currency: "USD",
        departure_token: departure_token,
        booking_token: booking_token,
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }

  } else if (path === "/google-places-autocomplete") {
    console.log("key", serpApiKey);
    // Handle the request for Google Places Autocomplete
    const input = searchParams.get("input");
    const radius = searchParams.get("radius") || 500;
    const types = searchParams.get("types");

    if (!input) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing 'input' parameter" }));
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            radius,
            types,
            key: googleMapsKey,
          },
        }
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (path === "/google-places-details") {
    console.log("key", serpApiKey);
    const place_id = searchParams.get("place_id");

    if (!place_id) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing 'place_id' parameter" }));
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id,
            key: googleMapsKey,
          },
        }
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (path === "/google-places-nearby") {
    console.log("key", serpApiKey);
    const location = searchParams.get("location");
    const radius = searchParams.get("radius") || 50000;
    const type = "airport"

    if (!location) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing 'location' parameter" }));
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location, 
            radius,
            type,
            key: googleMapsKey,
          },
        }
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid route" }));
  } 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});