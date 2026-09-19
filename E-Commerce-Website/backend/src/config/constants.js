'use strict';

module.exports = {
  ROLES: {
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN',
  },

  ORDER_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  },

  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },

  // Valid order status transitions
  ORDER_TRANSITIONS: {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  SORT_OPTIONS: {
    NEWEST: 'newest',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    RATING: 'rating',
    POPULAR: 'popular',
  },

  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹',
    PAISE_PER_INR: 100,
    TAX_RATE: 0.08,
    FREE_SHIPPING_THRESHOLD: 1000,
    STANDARD_SHIPPING_FEE: 99,
  },
};
