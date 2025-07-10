const axios = require("axios");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");


exports.createPathaoOrderController = catchAsync(async (req, res, next) => {
  const tokenResponse = await axios.post(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/issue-token`,
    {
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_EMAIL,
      password: process.env.PATHAO_PASS,
      grant_type: process.env.PATHAO_GRANT,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!tokenResponse.data.access_token) {
    return next(new AppError("Failed to retrieve access token", 400));
  }

  const accessToken = tokenResponse.data.access_token;

  const {
    merchant_order_id,
    recipient_name,
    recipient_phone,
    recipient_city,
    recipient_zone,
    delivery_type,
    item_type,
    item_quantity,
    item_weight,
    amount_to_collect,
    recipient_address,
  } = req.body;

  // Log the request body for debugging
  console.log("Request Body:", req.body);

  const payload = {
    store_id: parseInt(process.env.STORE_ID),
    merchant_order_id: merchant_order_id || "",
    recipient_name,
    recipient_phone,
    recipient_city: parseInt(recipient_city),
    recipient_zone: parseInt(recipient_zone),
    delivery_type,
    item_type,
    item_quantity: parseInt(item_quantity),
    item_weight: parseFloat(item_weight),
    amount_to_collect: parseInt(amount_to_collect),
    recipient_address,
  };

  const orderResponse = await axios.post(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/orders`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // Log the order response for debugging
  // console.log("Order Response:", orderResponse.data);

  if (orderResponse.data.type !== "success") {
    return next(new AppError("Failed to create Pathao order", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      order: orderResponse.data.data,
    },
  });
});

exports.pathaoZoneController = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const city_id = parseInt(id);

  const response = await axios.post(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/issue-token`,
    {
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_EMAIL,
      password: process.env.PATHAO_PASS,
      grant_type: process.env.PATHAO_GRANT,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data.access_token) {
    return next(new AppError("Access token not received yet", 400));
  }

  const reqZone = await axios.get(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/cities/${city_id}/zone-list`,
    {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      ...reqZone.data.data,
    },
  });
});

exports.pathaoAreaController = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const zone_id = parseInt(id);

  const response = await axios.post(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/issue-token`,
    {
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_EMAIL,
      password: process.env.PATHAO_PASS,
      grant_type: process.env.PATHAO_GRANT,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data.access_token) {
    return next(new AppError("Access token not received yet", 400));
  }

  const reqArea = await axios.get(
    `${process.env.PATHAO_BASE_URL}/aladdin/api/v1/zones/${zone_id}/area-list`,
    {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      ...reqArea.data.data,
    },
  });
});
