"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {

    var isNode = typeof window === 'undefined';

    //-----------------------------------------------------------------------------

    var capitalize = function capitalize(string) {
        return string.length ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    };

    var keysort = function keysort(object) {
        var result = {};
        Object.keys(object).sort().forEach(function (key) {
            return result[key] = object[key];
        });
        return result;
    };

    var extend = function extend() {
        var _arguments = arguments;

        var result = {};
        for (var i = 0; i < arguments.length; i++) {
            if (_typeof(arguments[i]) === 'object') Object.keys(arguments[i]).forEach(function (key) {
                return result[key] = _arguments[i][key];
            });
        }return result;
    };

    var omit = function omit(object) {
        var result = extend(object);
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string') delete result[arguments[i]];else if (Array.isArray(arguments[i])) for (var k = 0; k < arguments[i].length; k++) {
                delete result[arguments[i][k]];
            }
        }return result;
    };

    var indexBy = function indexBy(array, key) {
        var result = {};
        for (var i = 0; i < array.length; i++) {
            result[array[i][key]] = array[i];
        }return result;
    };

    var flat = function flat(array) {
        return array.reduce(function (acc, cur) {
            return acc.concat(cur);
        }, []);
    };

    var urlencode = function urlencode(object) {
        return Object.keys(object).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
        }).join('&');
    };

    //-----------------------------------------------------------------------------

    if (isNode) {

        var crypto = require('crypto');
        var fetch = require('node-fetch');

        var stringToBinary = function stringToBinary(string) {
            return Buffer.from(string, 'binary');
        };

        var stringToBase64 = function stringToBase64(string) {
            return new Buffer(string).toString('base64');
        };

        var utf16ToBase64 = function utf16ToBase64(string) {
            return stringToBase64(string);
        };

        var base64ToBinary = function base64ToBinary(string) {
            return Buffer.from(string, 'base64');
        };

        var base64ToString = function base64ToString(string) {
            return Buffer.from(string, 'base64').toString();
        };

        var hash = function hash(request) {
            var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'md5';
            var digest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';

            return crypto.createHash(hash).update(request).digest(digest);
        };

        var hmac = function hmac(request, secret) {
            var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sha256';
            var digest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

            return crypto.createHmac(hash, secret).update(request).digest(digest);
        };
    } else {

        var fetch = function fetch(url, options) {
            var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            return new Promise(function (resolve, reject) {

                if (verbose) console.log(url, options);

                var xhr = new XMLHttpRequest();
                var method = options.method || 'GET';

                xhr.open(method, url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) resolve(xhr.responseText);else throw new Error(method, url, xhr.status, xhr.responseText);
                    }
                };

                if (typeof options.headers != 'undefined') for (var header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }xhr.send(options.body);
            });
        };

        var stringToBinary = function stringToBinary(string) {
            return CryptoJS.enc.Latin1.parse(string);
        };

        var stringToBase64 = function stringToBase64(string) {
            return CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64);
        };

        var utf16ToBase64 = function utf16ToBase64(string) {
            return CryptoJS.enc.Utf16.parse(string).toString(CryptoJS.enc.Base64);
        };

        var base64ToBinary = function base64ToBinary(string) {
            return CryptoJS.enc.Base64.parse(string);
        };

        var base64ToString = function base64ToString(string) {
            return CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8);
        };

        var hash = function hash(request) {
            var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'md5';
            var digest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';

            var encoding = digest === 'binary' ? 'Latin1' : capitalize(digest);
            return CryptoJS[hash.toUpperCase()](request).toString(CryptoJS.enc[encoding]);
        };

        var hmac = function hmac(request, secret) {
            var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sha256';
            var digest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

            var encoding = digest === 'binary' ? 'Latin1' : capitalize(digest);
            return CryptoJS['Hmac' + hash.toUpperCase()](request, secret).toString(CryptoJS.enc[capitalize(encoding)]);
        };
    }

    var urlencodeBase64 = function urlencodeBase64(base64string) {
        return base64string.replace(/[=]+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    var jwt = function jwt(request, secret) {
        var alg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HS256';
        var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'sha256';

        var encodedHeader = urlencodeBase64(stringToBase64(JSON.stringify({ 'alg': alg, 'typ': 'JWT' })));
        var encodedData = urlencodeBase64(stringToBase64(JSON.stringify(request)));
        var token = [encodedHeader, encodedData].join('.');
        var signature = urlencodeBase64(utf16ToBase64(hmac(token, secret, hash, 'utf16')));
        return [token, signature].join('.');
    };

    //-----------------------------------------------------------------------------

    var Market = function Market(config) {
        var _this5 = this;

        this.hash = hash;
        this.hmac = hmac;
        this.jwt = jwt;
        this.stringToBinary = stringToBinary;
        this.stringToBase64 = stringToBase64;
        this.base64ToBinary = base64ToBinary;
        this.urlencode = urlencode;
        this.omit = omit;
        this.extend = extend;
        this.flatten = flat;
        this.indexBy = indexBy;
        this.keysort = keysort;
        this.capitalize = capitalize;

        this.init = function () {
            var _this = this;

            if (isNode) this.nodeVersion = process.version.match(/\d+\.\d+.\d+/)[0];

            if (this.api) Object.keys(this.api).forEach(function (type) {
                Object.keys(_this.api[type]).forEach(function (method) {
                    var urls = _this.api[type][method];

                    var _loop = function _loop() {
                        var url = urls[i].trim();
                        var splitPath = url.split(/[^a-zA-Z0-9]/);

                        var uppercaseMethod = method.toUpperCase();
                        var lowercaseMethod = method.toLowerCase();
                        var camelcaseMethod = capitalize(lowercaseMethod);
                        var camelcaseSuffix = splitPath.map(capitalize).join('');
                        var underscoreSuffix = splitPath.map(function (x) {
                            return x.trim().toLowerCase();
                        }).filter(function (x) {
                            return x.length > 0;
                        }).join('_');

                        if (camelcaseSuffix.indexOf(camelcaseMethod) === 0) camelcaseSuffix = camelcaseSuffix.slice(camelcaseMethod.length);

                        if (underscoreSuffix.indexOf(lowercaseMethod) === 0) underscoreSuffix = underscoreSuffix.slice(lowercaseMethod.length);

                        var camelcase = type + camelcaseMethod + capitalize(camelcaseSuffix);
                        var underscore = type + '_' + lowercaseMethod + '_' + underscoreSuffix;

                        var f = function f(params) {
                            return _this.request(url, type, uppercaseMethod, params);
                        };

                        _this[camelcase] = f;
                        _this[underscore] = f;
                    };

                    for (var i = 0; i < urls.length; i++) {
                        _loop();
                    }
                });
            });
        };

        // this.fetch = function (url, options) {

        //     if (isNode)
        //         options.headers = extend ({
        //             'User-Agent': 'ccxt/0.1.0 (+https://github.com/kroitor/ccxt) Node.js/' + this.nodeVersion + ' (JavaScript)'
        //         }, options.headers)

        //     if (this.verbose)
        //         console.log (this.id, url, options)

        //     return (fetch ((this.cors ? this.cors : '') + url, options)
        //         .then (response => (typeof response === 'string') ? response : response.text ())
        //         .then (response => {
        //             try {
        //                 return JSON.parse (response)
        //             } catch (e) {
        //                 var cloudflareProtection = response.match (/cloudflare/i) ? 'DDoS protection by Cloudflare' : ''
        //                 if (this.verbose)
        //                     console.log (this.id, response, cloudflareProtection, e)
        //                 throw e
        //             }
        //         }))
        // }

        this.fetch = function (url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';

            var _this2 = this;

            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            if (isNode) headers = extend({
                'User-Agent': 'ccxt/0.1.0 (+https://github.com/kroitor/ccxt) Node.js/' + this.nodeVersion + ' (JavaScript)'
            }, headers);

            var options = { 'method': method, 'headers': headers, 'body': body };

            if (this.verbose) console.log(this.id, url, options);

            return fetch((this.cors ? this.cors : '') + url, options).then(function (response) {
                return typeof response === 'string' ? response : response.text();
            }).then(function (response) {
                try {
                    return JSON.parse(response);
                } catch (e) {
                    var cloudflareProtection = response.match(/cloudflare/i) ? 'DDoS protection by Cloudflare' : '';
                    if (_this2.verbose) console.log(_this2.id, response, cloudflareProtection, e);
                    throw e;
                }
            });
        };

        this.load_products = this.loadProducts = function () {
            var _this3 = this;

            var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!reload && this.products) return new Promise(function (resolve, reject) {
                return resolve(_this3.products);
            });
            return this.fetchProducts().then(function (products) {
                return _this3.products = indexBy(products, 'symbol');
            });
        };

        this.fetch_products = this.fetchProducts = function () {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                return resolve(_this4.products);
            });
        };

        this.commonCurrencyCode = function (currency) {
            return currency === 'XBT' ? 'BTC' : currency;
        };

        this.product = function (product) {
            return typeof product === 'string' && typeof this.products != 'undefined' && typeof this.products[product] != 'undefined' ? this.products[product] : product;
        };

        this.product_id = this.productId = function (product) {
            return this.product(product).id || product;
        };

        this.symbol = function (product) {
            return this.product(product).symbol || product;
        };

        this.extract_params = this.extractParams = function (string) {
            var re = /{([a-zA-Z0-9_]+?)}/g;
            var matches = [];
            var match = void 0;
            while (match = re.exec(string)) {
                matches.push(match[1]);
            }return matches;
        };

        this.implode_params = this.implodeParams = function (string, params) {
            for (var property in params) {
                string = string.replace('{' + property + '}', params[property]);
            }return string;
        };

        this.buy = function (product, amount) {
            var price = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.order(product, 'buy', amount, price, params);
        };

        this.sell = function (product, amount) {
            var price = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.order(product, 'sell', amount, price, params);
        };

        this.trade = this.order = function (product, side, amount) {
            var price = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            var type = typeof price == 'undefined' ? 'market' : 'limit';
            return this.createOrder(product, type, side, amount, price, params);
        };

        this.create_buy_order = this.createBuyOrder = function (product, type, amount) {
            var price = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            return this.createOrder(product, type, 'buy', amount, price, params);
        };

        this.create_sell_order = this.createSellOrder = function (product, type, amount) {
            var price = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            return this.createOrder(product, type, 'sell', amount, price, params);
        };

        this.create_limit_buy_order = this.createLimitBuyOrder = function (product, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createLimitOrder(product, 'buy', amount, price, params);
        };

        this.create_limit_sell_order = this.createLimitSellOrder = function (product, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createLimitOrder(product, 'sell', amount, price, params);
        };

        this.create_market_buy_order = this.createMarketBuyOrder = function (product, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createMarketOrder(product, 'buy', amount, params);
        };

        this.create_market_sell_order = this.createMarketSellOrder = function (product, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createMarketOrder(product, 'sell', amount, params);
        };

        this.create_limit_order = this.createLimitOrder = function (product, side, amount, price) {
            var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            return this.createOrder(product, 'limit', side, amount, price, params);
        };

        this.create_market_order = this.createMarketOrder = function (product, side, amount) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createOrder(product, 'market', side, amount, undefined, params);
        };

        this.iso8601 = function (timestamp) {
            return new Date(timestamp).toISOString();
        };
        this.parse8601 = Date.parse;
        this.seconds = function () {
            return Math.floor(_this5.milliseconds() / 1000);
        };
        this.microseconds = function () {
            return Math.floor(_this5.milliseconds() * 1000);
        };
        this.milliseconds = Date.now;
        this.nonce = this.seconds;
        this.id = undefined;
        this.rateLimit = 2000;
        this.timeout = undefined;
        this.yyyymmddhhmmss = function (timestamp) {
            var date = new Date(timestamp);
            var yyyy = date.getUTCFullYear();
            var MM = date.getUTCMonth();
            var dd = date.getUTCDay();
            var hh = date.getUTCHours();
            var mm = date.getUTCMinutes();
            var ss = date.getUTCSeconds();
            MM = MM < 10 ? '0' + MM : MM;
            dd = dd < 10 ? '0' + dd : dd;
            hh = hh < 10 ? '0' + hh : hh;
            mm = mm < 10 ? '0' + mm : mm;
            ss = ss < 10 ? '0' + ss : ss;
            return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
        };

        for (var property in config) {
            this[property] = config[property];
        }this.fetch_balance = this.fetchBalance;
        this.fetch_order_book = this.fetchOrderBook;
        this.fetch_ticker = this.fetchTicker;
        this.fetch_trades = this.fetchTrades;

        this.verbose = this.log || this.debug || this.verbosity == 1 || this.verbose;

        this.init();
    };

    //=============================================================================

    var _1broker = {

        'id': '_1broker',
        'name': '1Broker',
        'countries': 'US',
        'rateLimit': 2000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766021-420bd9fc-5ecb-11e7-8ed6-56d0081efed2.jpg',
            'api': 'https://1broker.com/api',
            'www': 'https://1broker.com',
            'doc': 'https://1broker.com/?c=en/content/api-documentation'
        },
        'api': {
            'private': {
                'get': ['market/bars', 'market/categories', 'market/details', 'market/list', 'market/quotes', 'market/ticks', 'order/cancel', 'order/create', 'order/open', 'position/close', 'position/close_cancel', 'position/edit', 'position/history', 'position/open', 'position/shared/get', 'social/profile_statistics', 'social/profile_trades', 'user/bitcoin_deposit_address', 'user/details', 'user/overview', 'user/quota_status', 'user/transaction_log']
            }
        },

        fetchCategories: function fetchCategories() {
            var categories,
                _this6 = this;

            return Promise.resolve().then(function () {
                return _this6.privateGetMarketCategories();
            }).then(function (_resp) {
                categories = _resp;

                return categories['response'];
            });
        },
        fetchProducts: function fetchProducts() {
            function _recursive() {
                var _this8 = this;

                if (c < categories.length) {
                    return Promise.resolve().then(function () {
                        category = categories[c];
                        return _this8.privateGetMarketList({
                            'category': category.toLowerCase()
                        });
                    }).then(function (_resp) {
                        products = _resp;

                        for (p = 0; p < products['response'].length; p++) {
                            product = products['response'][p];

                            if (category == 'FOREX' || category == 'CRYPTO') {
                                id = product['symbol'];
                                symbol = product['name'];
                                _symbol$split = symbol.split('/');
                                _symbol$split2 = _slicedToArray(_symbol$split, 2);
                                base = _symbol$split2[0];
                                quote = _symbol$split2[1];

                                result.push({
                                    'id': id,
                                    'symbol': symbol,
                                    'base': base,
                                    'quote': quote,
                                    'info': product
                                });
                            } else {
                                _id = product['symbol'];
                                _symbol = product['symbol'];
                                name = product['name'];
                                type = product['type'].toLowerCase();

                                result.push({
                                    'id': _id,
                                    'symbol': _symbol,
                                    'name': name,
                                    'type': type,
                                    'info': product
                                });
                            }
                        }
                        c++;
                        return _recursive();
                    });
                }
            }

            var categories,
                result,
                c,
                category,
                products,
                p,
                product,
                id,
                symbol,
                _symbol$split,
                _symbol$split2,
                base,
                quote,
                _id,
                _symbol,
                name,
                type,
                _this7 = this;

            return Promise.resolve().then(function () {
                return _this7.fetchCategories();
            }).then(function (_resp) {
                categories = _resp;
                result = [];
                c = 0;
                return _recursive();
            }).then(function () {
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetUserOverview();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.privateGetMarketQuotes({
                'symbols': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            return this.privateGetMarketBars({
                'symbol': this.productId(product),
                'resolution': 60,
                'limit': 1
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'symbol': this.productId(product),
                'margin': amount,
                'direction': side == 'sell' ? 'short' : 'long',
                'leverage': 1,
                'type': side
            };
            if (type == 'limit') order['price'] = price;else order['type'] += '_market';
            return this.privateGetOrderCreate(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path + '.php';
            var query = this.extend({ 'token': this.apiKey || this.token }, params);
            url += '?' + this.urlencode(query);
            return this.fetch(url, method);
        }
    };

    //-----------------------------------------------------------------------------

    var cryptocapital = {

        'comment': 'Crypto Capital API',
        'api': {
            'public': {
                'get': ['stats', 'historical-prices', 'order-book', 'transactions']
            },
            'private': {
                'post': ['balances-and-info', 'open-orders', 'user-transactions', 'btc-deposit-address/get', 'btc-deposit-address/new', 'deposits/get', 'withdrawals/get', 'orders/new', 'orders/edit', 'orders/cancel', 'orders/status', 'withdrawals/new']
            }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostBalancesAndInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBook({
                'currency': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this11 = this;

            return Promise.resolve().then(function () {
                return _this11.publicGetStats({
                    'currency': _this11.productId(product)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['stats'];
                timestamp = _this11.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this11.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': parseFloat(ticker['daily_change']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['total_btc_traded'])
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTransactions({
                'currency': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'side': side,
                'type': type,
                'currency': this.productId(product),
                'amount': amount
            };
            if (type == 'limit') order['limit_price'] = price;
            return this.privatePostOrdersNew(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var query = this.extend({
                    'api_key': this.apiKey,
                    'nonce': this.nonce()
                }, params);
                query['signature'] = this.hmac(JSON.stringify(query), this.secret);
                body = JSON.stringify(query);
                headers = { 'Content-Type': 'application/json' };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var _1btcxe = extend(cryptocapital, {

        'id': '_1btcxe',
        'name': '1BTCXE',
        'countries': 'PA', // Panama
        'comment': 'Crypto Capital API',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766049-2b294408-5ecc-11e7-85cc-adaff013dc1a.jpg',
            'api': 'https://1btcxe.com/api',
            'www': 'https://1btcxe.com',
            'doc': 'https://1btcxe.com/api-docs.php'
        },
        'products': {
            'BTC/USD': { 'id': 'USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CNY': { 'id': 'CNY', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'BTC/RUB': { 'id': 'RUB', 'symbol': 'BTC/RUB', 'base': 'BTC', 'quote': 'RUB' },
            'BTC/CHF': { 'id': 'CHF', 'symbol': 'BTC/CHF', 'base': 'BTC', 'quote': 'CHF' },
            'BTC/JPY': { 'id': 'JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/CAD': { 'id': 'CAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/AED': { 'id': 'AED', 'symbol': 'BTC/AED', 'base': 'BTC', 'quote': 'AED' },
            'BTC/BGN': { 'id': 'BGN', 'symbol': 'BTC/BGN', 'base': 'BTC', 'quote': 'BGN' },
            'BTC/CZK': { 'id': 'CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' },
            'BTC/DKK': { 'id': 'DKK', 'symbol': 'BTC/DKK', 'base': 'BTC', 'quote': 'DKK' },
            'BTC/HKD': { 'id': 'HKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/HRK': { 'id': 'HRK', 'symbol': 'BTC/HRK', 'base': 'BTC', 'quote': 'HRK' },
            'BTC/HUF': { 'id': 'HUF', 'symbol': 'BTC/HUF', 'base': 'BTC', 'quote': 'HUF' },
            'BTC/ILS': { 'id': 'ILS', 'symbol': 'BTC/ILS', 'base': 'BTC', 'quote': 'ILS' },
            'BTC/INR': { 'id': 'INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' },
            'BTC/MUR': { 'id': 'MUR', 'symbol': 'BTC/MUR', 'base': 'BTC', 'quote': 'MUR' },
            'BTC/MXN': { 'id': 'MXN', 'symbol': 'BTC/MXN', 'base': 'BTC', 'quote': 'MXN' },
            'BTC/NOK': { 'id': 'NOK', 'symbol': 'BTC/NOK', 'base': 'BTC', 'quote': 'NOK' },
            'BTC/NZD': { 'id': 'NZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'BTC/PLN': { 'id': 'PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/RON': { 'id': 'RON', 'symbol': 'BTC/RON', 'base': 'BTC', 'quote': 'RON' },
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' },
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/THB': { 'id': 'THB', 'symbol': 'BTC/THB', 'base': 'BTC', 'quote': 'THB' },
            'BTC/TRY': { 'id': 'TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' },
            'BTC/ZAR': { 'id': 'ZAR', 'symbol': 'BTC/ZAR', 'base': 'BTC', 'quote': 'ZAR' }
        }
    });

    //-----------------------------------------------------------------------------

    var anxpro = {

        'id': 'anxpro',
        'name': 'ANXPro',
        'countries': ['JP', 'SG', 'HK', 'NZ'],
        'version': '2',
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27765983-fd8595da-5ec9-11e7-82e3-adb3ab8c2612.jpg',
            'api': 'https://anxpro.com/api',
            'www': 'https://anxpro.com',
            'doc': 'https://anxpro.com/pages/api'
        },
        'api': {
            'public': {
                'get': ['{currency_pair}/money/ticker', '{currency_pair}/money/depth/full', '{currency_pair}/money/trade/fetch']
            },
            'private': {
                'post': ['{currency_pair}/money/order/add', '{currency_pair}/money/order/cancel', '{currency_pair}/money/order/quote', '{currency_pair}/money/order/result', '{currency_pair}/money/orders', 'money/{currency}/address', 'money/{currency}/send_simple', 'money/info', 'money/trade/list', 'money/wallet/history']
            }
        },
        'products': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/HKD': { 'id': 'BTCHKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CAD': { 'id': 'BTCCAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'BTCAUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/SGD': { 'id': 'BTCSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/JPY': { 'id': 'BTCJPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'BTCGBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/NZD': { 'id': 'BTCNZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DOGE/BTC': { 'id': 'DOGEBTC', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'STR/BTC': { 'id': 'STRBTC', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'XRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostMoneyInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetCurrencyPairMoneyDepthFull({
                'currency_pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this12 = this;

            return Promise.resolve().then(function () {
                return _this12.publicGetCurrencyPairMoneyTicker({
                    'currency_pair': _this12.productId(product)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = parseInt(ticker['dataUpdateTime'] / 1000);

                return {
                    'timestamp': timestamp,
                    'datetime': _this12.iso8601(timestamp),
                    'high': parseFloat(ticker['high']['value']),
                    'low': parseFloat(ticker['low']['value']),
                    'bid': parseFloat(ticker['buy']['value']),
                    'ask': parseFloat(ticker['sell'])['value'],
                    'vwap': parseFloat(ticker['vwap']['value']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']['value']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']['value']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']['value'])
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetCurrencyPairMoneyTradeFetch({
                'currency_pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'currency_pair': this.productId(product),
                'amount_int': amount,
                'type': side
            };
            if (type == 'limit') order['price_int'] = price;
            return this.privatePostCurrencyPairOrderAdd(this.extend(order, params));
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + '/' + this.version + '/' + request;
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, query));
                var secret = this.base64ToBinary(this.secret);
                var auth = request + "\0" + body;
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Rest-Key': this.apiKey,
                    'Rest-Sign': this.hmac(auth, secret, 'sha512', 'base64')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bit2c = {

        'id': 'bit2c',
        'name': 'Bit2C',
        'countries': 'IL', // Israel
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766119-3593220e-5ece-11e7-8b3a-5a041f6bcc3f.jpg',
            'api': 'https://www.bit2c.co.il',
            'www': 'https://www.bit2c.co.il',
            'doc': ['https://www.bit2c.co.il/home/api', 'https://github.com/OferE/bit2c']
        },
        'api': {
            'public': {
                'get': ['Exchanges/{pair}/Ticker', 'Exchanges/{pair}/orderbook', 'Exchanges/{pair}/trades']
            },
            'private': {
                'post': ['Account/Balance', 'Account/Balance/v2', 'Merchant/CreateCheckout', 'Order/AccountHistory', 'Order/AddCoinFundsRequest', 'Order/AddFund', 'Order/AddOrder', 'Order/AddOrderMarketPriceBuy', 'Order/AddOrderMarketPriceSell', 'Order/CancelOrder', 'Order/MyOrders', 'Payment/GetMyId', 'Payment/Send']
            }
        },
        'products': {
            'BTC/NIS': { 'id': 'BtcNis', 'symbol': 'BTC/NIS', 'base': 'BTC', 'quote': 'NIS' },
            'LTC/BTC': { 'id': 'LtcBtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LTC/NIS': { 'id': 'LtcNis', 'symbol': 'LTC/NIS', 'base': 'LTC', 'quote': 'NIS' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostAccountBalanceV2();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetExchangesPairOrderbook({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this13 = this;

            return Promise.resolve().then(function () {
                return _this13.publicGetExchangesPairTicker({
                    'pair': _this13.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this13.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this13.iso8601(timestamp),
                    'high': parseFloat(ticker['h']),
                    'low': parseFloat(ticker['l']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['ll']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['av']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['a'])
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetExchangesPairTrades({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePostOrderAddOrder';
            var order = {
                'Amount': amount,
                'Pair': this.productId(product)
            };
            if (type == 'market') {
                method += 'MarketPrice' + this.capitalize(side);
            } else {
                order['Price'] = price;
                order['Total'] = amount * price;
                order['IsBid'] = side == 'buy';
            }
            return this[method](this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            if (type == 'public') {
                url += '.json';
            } else {
                var nonce = this.nonce();
                var query = this.extend({ 'nonce': nonce }, params);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'key': this.apiKey,
                    'sign': this.hmac(body, this.secret, 'sha512', 'base64')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitbay = {

        'id': 'bitbay',
        'name': 'BitBay',
        'countries': ['PL', 'EU'], // Poland
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766132-978a7bd8-5ece-11e7-9540-bc96d1e9bbb8.jpg',
            'www': 'https://bitbay.net',
            'api': {
                'public': 'https://bitbay.net/API/Public',
                'private': 'https://bitbay.net/API/Trading/tradingApi.php'
            },
            'doc': ['https://bitbay.net/public-api', 'https://bitbay.net/account/tab-api', 'https://github.com/BitBayNet/API']
        },
        'api': {
            'public': {
                'get': ['{id}/all', '{id}/market', '{id}/orderbook', '{id}/ticker', '{id}/trades']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orderbook', 'orders', 'transfer', 'withdraw', 'history', 'transactions']
            }
        },
        'products': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'LTC/USD': { 'id': 'LTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/USD': { 'id': 'ETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETH/EUR': { 'id': 'ETHEUR', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR' },
            'ETH/PLN': { 'id': 'ETHPLN', 'symbol': 'ETH/PLN', 'base': 'ETH', 'quote': 'PLN' },
            'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'LSK/USD': { 'id': 'LSKUSD', 'symbol': 'LSK/USD', 'base': 'LSK', 'quote': 'USD' },
            'LSK/EUR': { 'id': 'LSKEUR', 'symbol': 'LSK/EUR', 'base': 'LSK', 'quote': 'EUR' },
            'LSK/PLN': { 'id': 'LSKPLN', 'symbol': 'LSK/PLN', 'base': 'LSK', 'quote': 'PLN' },
            'LSK/BTC': { 'id': 'LSKBTC', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetIdOrderbook({
                'id': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this14 = this;

            return Promise.resolve().then(function () {
                return _this14.publicGetIdTicker({
                    'id': _this14.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this14.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this14.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetIdTrades({
                'id': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var p = this.product(product);
            return this.privatePostTrade(this.extend({
                'type': side,
                'currency': p['base'],
                'amount': amount,
                'payment_currency': p['quote'],
                'rate': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            if (type == 'public') {
                url += '/' + this.implodeParams(path, params) + '.json';
            } else {
                body = this.urlencode(this.extend({
                    'method': path,
                    'moment': this.nonce()
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitcoincoid = {

        'id': 'bitcoincoid',
        'name': 'Bitcoin.co.id',
        'countries': 'ID', // Indonesia
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766138-043c7786-5ecf-11e7-882b-809c14f38b53.jpg',
            'api': {
                'public': 'https://vip.bitcoin.co.id/api',
                'private': 'https://vip.bitcoin.co.id/tapi'
            },
            'www': 'https://www.bitcoin.co.id',
            'doc': ['https://vip.bitcoin.co.id/trade_api', 'https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf']
        },
        'api': {
            'public': {
                'get': ['{pair}/ticker', '{pair}/trades', '{pair}/depth']
            },
            'private': {
                'post': ['getInfo', 'transHistory', 'trade', 'tradeHistory', 'openOrders', 'cancelOrder']
            }
        },
        'products': {
            'BTC/IDR': { 'id': 'btc_idr', 'symbol': 'BTC/IDR', 'base': 'BTC', 'quote': 'IDR', 'baseId': 'btc', 'quoteId': 'idr' },
            'BTS/BTC': { 'id': 'bts_btc', 'symbol': 'BTS/BTC', 'base': 'BTS', 'quote': 'BTC', 'baseId': 'bts', 'quoteId': 'btc' },
            'DASH/BTC': { 'id': 'drk_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'drk', 'quoteId': 'btc' },
            'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'baseId': 'doge', 'quoteId': 'btc' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'eth', 'quoteId': 'btc' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc' },
            'NXT/BTC': { 'id': 'nxt_btc', 'symbol': 'NXT/BTC', 'base': 'NXT', 'quote': 'BTC', 'baseId': 'nxt', 'quoteId': 'btc' },
            'STR/BTC': { 'id': 'str_btc', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC', 'baseId': 'str', 'quoteId': 'btc' },
            'NEM/BTC': { 'id': 'nem_btc', 'symbol': 'NEM/BTC', 'base': 'NEM', 'quote': 'BTC', 'baseId': 'nem', 'quoteId': 'btc' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'baseId': 'xrp', 'quoteId': 'btc' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostGetInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetPairDepth({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var pair,
                response,
                ticker,
                timestamp,
                baseVolume,
                quoteVolume,
                _this15 = this;

            return Promise.resolve().then(function () {
                pair = _this15.product(product);
                return _this15.publicGetPairTicker({
                    'pair': pair['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseFloat(ticker['server_time']) * 1000;
                baseVolume = 'vol_' + pair['baseId'].toLowerCase();
                quoteVolume = 'vol_' + pair['quoteId'].toLowerCase();

                return {
                    'timestamp': timestamp,
                    'datetime': _this15.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': parseFloat(ticker[baseVolume]),
                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetPairTrades({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var p = this.product(product);
            var order = {
                'pair': p['id'],
                'type': side,
                'price': price
            };
            var base = p['base'].toLowerCase();
            order[base] = amount;
            return this.privatePostTrade(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            if (type == 'public') {
                url += '/' + this.implodeParams(path, params);
            } else {
                body = this.urlencode(this.extend({
                    'method': path,
                    'nonce': this.nonce()
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Key': this.apiKey,
                    'Sign': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitfinex = {

        'id': 'bitfinex',
        'name': 'Bitfinex',
        'countries': 'US',
        'version': 'v1',
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
            'api': 'https://api.bitfinex.com',
            'www': 'https://www.bitfinex.com',
            'doc': ['https://bitfinex.readme.io/v1/docs', 'https://bitfinex.readme.io/v2/docs', 'https://github.com/bitfinexcom/bitfinex-api-node']
        },
        'api': {
            'public': {
                'get': ['book/{symbol}', 'candles/{symbol}', 'lendbook/{currency}', 'lends/{currency}', 'pubticker/{symbol}', 'stats/{symbol}', 'symbols', 'symbols_details', 'today', 'trades/{symbol}']
            },
            'private': {
                'post': ['account_infos', 'balances', 'basket_manage', 'credits', 'deposit/new', 'funding/close', 'history', 'history/movements', 'key_info', 'margin_infos', 'mytrades', 'offer/cancel', 'offer/new', 'offer/status', 'offers', 'order/cancel', 'order/cancel/all', 'order/cancel/multi', 'order/cancel/replace', 'order/new', 'order/new/multi', 'order/status', 'orders', 'position/claim', 'positions', 'summary', 'taken_funds', 'total_taken_funds', 'transfer', 'unused_taken_funds', 'withdraw']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this16 = this;

            return Promise.resolve().then(function () {
                return _this16.publicGetSymbolsDetails();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products.length; p++) {
                    product = products[p];
                    id = product['pair'].toUpperCase();
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalances();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetBookSymbol({
                'symbol': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this17 = this;

            return Promise.resolve().then(function () {
                return _this17.publicGetPubtickerSymbol({
                    'symbol': _this17.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseFloat(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this17.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['mid']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTradesSymbol({
                'symbol': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostOrderNew(this.extend({
                'symbol': this.productId(product),
                'amount': amount.toString(),
                'price': price.toString(),
                'side': side,
                'type': 'exchange ' + type,
                'ocoorder': false,
                'buy_price_oco': 0,
                'sell_price_oco': 0
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            var url = this.urls['api'] + request;
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                query = this.extend({
                    'nonce': nonce.toString(),
                    'request': request
                }, query);
                var payload = this.stringToBase64(JSON.stringify(query));
                headers = {
                    'X-BFX-APIKEY': this.apiKey,
                    'X-BFX-PAYLOAD': payload,
                    'X-BFX-SIGNATURE': this.hmac(payload, this.secret, 'sha384')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitlish = {

        'id': 'bitlish',
        'name': 'bitlish',
        'countries': ['UK', 'EU', 'RU'],
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766275-dcfc6c30-5ed3-11e7-839d-00a846385d0b.jpg',
            'api': 'https://bitlish.com/api',
            'www': 'https://bitlish.com',
            'doc': 'https://bitlish.com/api'
        },
        'api': {
            'public': {
                'get': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history']
            },
            'private': {
                'post': ['accounts_operations', 'balance', 'cancel_trade', 'cancel_trades_by_ids', 'cancel_all_trades', 'create_bcode', 'create_template_wallet', 'create_trade', 'deposit', 'list_accounts_operations_from_ts', 'list_active_trades', 'list_bcodes', 'list_my_matches_from_ts', 'list_my_trades', 'list_my_trads_from_ts', 'list_payment_methods', 'list_payments', 'redeem_code', 'resign', 'signin', 'signout', 'trade_details', 'trade_options', 'withdraw', 'withdraw_by_id']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                keys,
                p,
                product,
                id,
                symbol,
                _symbol$split3,
                _symbol$split4,
                base,
                quote,
                _this18 = this;

            return Promise.resolve().then(function () {
                return _this18.publicGetPairs();
            }).then(function (_resp) {
                products = _resp;
                result = [];
                keys = Object.keys(products);

                for (p = 0; p < keys.length; p++) {
                    product = products[keys[p]];
                    id = product['id'];
                    symbol = product['name'];
                    _symbol$split3 = symbol.split('/');
                    _symbol$split4 = _slicedToArray(_symbol$split3, 2);
                    base = _symbol$split4[0];
                    quote = _symbol$split4[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this19 = this;

            return Promise.resolve().then(function () {
                p = _this19.product(product);
                return _this19.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = _this19.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this19.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': parseFloat(ticker['first']),
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined,
                    'info': ticker
                };
            });
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetTradesDepth({
                'pair_id': this.productId(product)
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTradesHistory({
                'pair_id': this.productId(product)
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        signIn: function signIn() {
            return this.privatePostSignin({
                'login': this.login,
                'passwd': this.password
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'pair_id': this.productId(product),
                'dir': side == 'buy' ? 'bid' : 'ask',
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostCreateTrade(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                body = JSON.stringify(this.extend({ 'token': this.apiKey }, params));
                headers = { 'Content-Type': 'application/json' };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmarket = {

        'id': 'bitmarket',
        'name': 'BitMarket',
        'countries': ['PL', 'EU'],
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27767256-a8555200-5ef9-11e7-96fd-469a65e2b0bd.jpg',
            'api': {
                'public': 'https://www.bitmarket.net',
                'private': 'https://www.bitmarket.pl/api2/' // last slash is critical
            },
            'www': ['https://www.bitmarket.pl', 'https://www.bitmarket.net'],
            'doc': ['https://www.bitmarket.net/docs.php?file=api_public.html', 'https://www.bitmarket.net/docs.php?file=api_private.html', 'https://github.com/bitmarket-net/api']
        },
        'api': {
            'public': {
                'get': ['json/{market}/ticker', 'json/{market}/orderbook', 'json/{market}/trades', 'json/ctransfer', 'graphs/{market}/90m', 'graphs/{market}/6h', 'graphs/{market}/1d', 'graphs/{market}/7d', 'graphs/{market}/1m', 'graphs/{market}/3m', 'graphs/{market}/6m', 'graphs/{market}/1y']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orders', 'trades', 'history', 'withdrawals', 'tradingdesk', 'tradingdeskStatus', 'tradingdeskConfirm', 'cryptotradingdesk', 'cryptotradingdeskStatus', 'cryptotradingdeskConfirm', 'withdraw', 'withdrawFiat', 'withdrawPLNPP', 'withdrawFiatFast', 'deposit', 'transfer', 'transfers', 'marginList', 'marginOpen', 'marginClose', 'marginCancel', 'marginModify', 'marginBalanceAdd', 'marginBalanceRemove', 'swapList', 'swapOpen', 'swapClose']
            }
        },
        'products': {
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LMX/BTC': { 'id': 'LiteMineXBTC', 'symbol': 'LMX/BTC', 'base': 'LMX', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetJsonMarketOrderbook({
                'market': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this20 = this;

            return Promise.resolve().then(function () {
                return _this20.publicGetJsonMarketTicker({
                    'market': _this20.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this20.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this20.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetJsonMarketTrades({
                'market': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostTrade(this.extend({
                'market': this.productId(product),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            if (type == 'public') {
                url += '/' + this.implodeParams(path + '.json', params);
            } else {
                var nonce = this.nonce();
                var query = this.extend({
                    'tonce': nonce,
                    'method': path
                }, params);
                body = this.urlencode(query);
                headers = {
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmex = {

        'id': 'bitmex',
        'name': 'BitMEX',
        'countries': 'SC', // Seychelles
        'version': 'v1',
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766319-f653c6e6-5ed4-11e7-933d-f0bc3699ae8f.jpg',
            'api': 'https://www.bitmex.com',
            'www': 'https://www.bitmex.com',
            'doc': ['https://www.bitmex.com/app/apiOverview', 'https://github.com/BitMEX/api-connectors/tree/master/official-http']
        },
        'api': {
            'public': {
                'get': ['announcement', 'announcement/urgent', 'funding', 'instrument', 'instrument/active', 'instrument/activeAndIndices', 'instrument/activeIntervals', 'instrument/compositeIndex', 'instrument/indices', 'insurance', 'leaderboard', 'liquidation', 'orderBook', 'orderBook/L2', 'quote', 'quote/bucketed', 'schema', 'schema/websocketHelp', 'settlement', 'stats', 'stats/history', 'trade', 'trade/bucketed']
            },
            'private': {
                'get': ['apiKey', 'chat', 'chat/channels', 'chat/connected', 'execution', 'execution/tradeHistory', 'notification', 'order', 'position', 'user', 'user/affiliateStatus', 'user/checkReferralCode', 'user/commission', 'user/depositAddress', 'user/margin', 'user/minWithdrawalFee', 'user/wallet', 'user/walletHistory', 'user/walletSummary'],
                'post': ['apiKey', 'apiKey/disable', 'apiKey/enable', 'chat', 'order', 'order/bulk', 'order/cancelAllAfter', 'order/closePosition', 'position/isolate', 'position/leverage', 'position/riskLimit', 'position/transferMargin', 'user/cancelWithdrawal', 'user/confirmEmail', 'user/confirmEnableTFA', 'user/confirmWithdrawal', 'user/disableTFA', 'user/logout', 'user/logoutAll', 'user/preferences', 'user/requestEnableTFA', 'user/requestWithdrawal'],
                'put': ['order', 'order/bulk', 'user'],
                'delete': ['apiKey', 'order', 'order/all']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                isFuturesContract,
                symbol,
                _this21 = this;

            return Promise.resolve().then(function () {
                return _this21.publicGetInstrumentActive();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products.length; p++) {
                    product = products[p];
                    id = product['symbol'];
                    base = product['underlying'];
                    quote = product['quoteCurrency'];
                    isFuturesContract = id != base + quote;

                    base = _this21.commonCurrencyCode(base);
                    quote = _this21.commonCurrencyCode(quote);
                    symbol = isFuturesContract ? id : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetUserMargin({ 'currency': 'all' });
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBookL2({
                'symbol': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var request,
                quotes,
                quotesLength,
                quote,
                tickers,
                ticker,
                timestamp,
                _this22 = this;

            return Promise.resolve().then(function () {
                request = {
                    'symbol': _this22.productId(product),
                    'binSize': '1d',
                    'partial': true,
                    'count': 1,
                    'reverse': true
                };
                return _this22.publicGetQuoteBucketed(request);
            }).then(function (_resp) {
                quotes = _resp;
                quotesLength = quotes.length;
                quote = quotes[quotesLength - 1];
                return _this22.publicGetTradeBucketed(request);
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[0];
                timestamp = _this22.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this22.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(quote['bidPrice']),
                    'ask': parseFloat(quote['askPrice']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['homeNotional']),
                    'quoteVolume': parseFloat(ticker['foreignNotional']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrade({
                'symbol': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'symbol': this.productId(product),
                'side': this.capitalize(side),
                'orderQty': amount,
                'ordType': this.capitalize(type)
            };
            if (type == 'limit') order['rate'] = price;
            return this.privatePostOrder(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var query = '/api/' + this.version + '/' + path;
            if (Object.keys(params).length) query += '?' + this.urlencode(params);
            var url = this.urls['api'] + query;
            if (type == 'private') {
                var nonce = this.nonce().toString();
                if (method == 'POST') if (Object.keys(params).length) body = JSON.stringify(params);
                var request = [method, query, nonce, body || ''].join('');
                headers = {
                    'Content-Type': 'application/json',
                    'api-nonce': nonce,
                    'api-key': this.apiKey,
                    'api-signature': this.hmac(request, this.secret)
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitso = {

        'id': 'bitso',
        'name': 'Bitso',
        'countries': 'MX', // Mexico
        'rateLimit': 2000, // 30 requests per minute
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766335-715ce7aa-5ed5-11e7-88a8-173a27bb30fe.jpg',
            'api': 'https://api.bitso.com',
            'www': 'https://bitso.com',
            'doc': 'https://bitso.com/api_info'
        },
        'api': {
            'public': {
                'get': ['available_books', 'ticker', 'order_book', 'trades']
            },
            'private': {
                'get': ['account_status', 'balance', 'fees', 'fundings', 'fundings/{fid}', 'funding_destination', 'kyc_documents', 'ledger', 'ledger/trades', 'ledger/fees', 'ledger/fundings', 'ledger/withdrawals', 'mx_bank_codes', 'open_orders', 'order_trades/{oid}', 'orders/{oid}', 'user_trades', 'user_trades/{tid}', 'withdrawals/', 'withdrawals/{wid}'],
                'post': ['bitcoin_withdrawal', 'debit_card_withdrawal', 'ether_withdrawal', 'orders', 'phone_number', 'phone_verification', 'phone_withdrawal', 'spei_withdrawal'],
                'delete': ['orders/{oid}', 'orders/all']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                symbol,
                _symbol$split5,
                _symbol$split6,
                base,
                quote,
                _this23 = this;

            return Promise.resolve().then(function () {
                return _this23.publicGetAvailableBooks();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['payload'].length; p++) {
                    product = products['payload'][p];
                    id = product['book'];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split5 = symbol.split('/');
                    _symbol$split6 = _slicedToArray(_symbol$split5, 2);
                    base = _symbol$split6[0];
                    quote = _symbol$split6[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBook({
                'book': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this24 = this;

            return Promise.resolve().then(function () {
                return _this24.publicGetTicker({
                    'book': _this24.productId(product)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['payload'];
                timestamp = _this24.parse8601(ticker['created_at']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this24.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'book': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'book': this.productId(product),
                'side': side,
                'type': type,
                'major': amount
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostOrders(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var query = '/' + this.version + '/' + this.implodeParams(path, params);
            var url = this.urls['api'] + query;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                if (Object.keys(params).length) body = JSON.stringify(params);
                var nonce = this.nonce().toString();
                var request = [nonce, method, query, body || ''].join('');
                var signature = this.hmac(request, this.secret);
                var auth = this.apiKey + ':' + nonce + ':' + signature;
                headers = { 'Authorization': "Bitso " + auth };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitstamp = {

        'id': 'bitstamp',
        'name': 'Bitstamp',
        'countries': 'UK',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
            'api': 'https://www.bitstamp.net/api',
            'www': 'https://www.bitstamp.net',
            'doc': 'https://www.bitstamp.net/api'
        },
        'api': {
            'public': {
                'get': ['order_book/{id}/', 'ticker_hour/{id}/', 'ticker/{id}/', 'transactions/{id}/']
            },
            'private': {
                'post': ['balance/', 'balance/{id}/', 'buy/{id}/', 'buy/market/{id}/', 'cancel_order/', 'liquidation_address/info/', 'liquidation_address/new/', 'open_orders/all/', 'open_orders/{id}/', 'sell/{id}/', 'sell/market/{id}/', 'transfer-from-main/', 'transfer-to-main/', 'user_transactions/', 'user_transactions/{id}/', 'withdrawal/cancel/', 'withdrawal/open/', 'withdrawal/status/', 'xrp_address/', 'xrp_withdrawal/']
            }
        },
        'products': {
            'BTC/USD': { 'id': 'btcusd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btceur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'EUR/USD': { 'id': 'eurusd', 'symbol': 'EUR/USD', 'base': 'EUR', 'quote': 'USD' },
            'XRP/USD': { 'id': 'xrpusd', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD' },
            'XRP/EUR': { 'id': 'xrpeur', 'symbol': 'XRP/EUR', 'base': 'XRP', 'quote': 'EUR' },
            'XRP/BTC': { 'id': 'xrpbtc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' }
        },

        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBookId({
                'id': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this25 = this;

            return Promise.resolve().then(function () {
                return _this25.publicGetTickerId({
                    'id': _this25.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this25.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTransactionsId({
                'id': this.productId(product)
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePost' + this.capitalize(side);
            var order = {
                'id': this.productId(product),
                'amount': amount
            };
            if (type == 'market') method += 'Market';else order['price'] = price;
            method += 'Id';
            return this[method](this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce().toString();
                var auth = nonce + this.uid + this.apiKey;
                var signature = this.hmac(auth, this.secret);
                query = this.extend({
                    'key': this.apiKey,
                    'signature': signature.toUpperCase(),
                    'nonce': nonce
                }, query);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bittrex = {

        'id': 'bittrex',
        'name': 'Bittrex',
        'countries': 'US',
        'version': 'v1.1',
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
            'api': 'https://bittrex.com/api',
            'www': 'https://bittrex.com',
            'doc': ['https://bittrex.com/Home/Api', 'https://www.npmjs.org/package/node.bittrex.api']
        },
        'api': {
            'public': {
                'get': ['currencies', 'markethistory', 'markets', 'marketsummaries', 'marketsummary', 'orderbook', 'ticker']
            },
            'account': {
                'get': ['balance', 'balances', 'depositaddress', 'deposithistory', 'order', 'orderhistory', 'withdrawalhistory', 'withdraw']
            },
            'market': {
                'get': ['buylimit', 'buymarket', 'cancel', 'openorders', 'selllimit', 'sellmarket']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this26 = this;

            return Promise.resolve().then(function () {
                return _this26.publicGetMarkets();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['result'].length; p++) {
                    product = products['result'][p];
                    id = product['MarketName'];
                    base = product['BaseCurrency'];
                    quote = product['MarketCurrency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.accountGetBalances();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook({
                'market': this.productId(product),
                'type': 'both',
                'depth': 50
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this27 = this;

            return Promise.resolve().then(function () {
                return _this27.publicGetMarketsummary({
                    'market': _this27.productId(product)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][0];
                timestamp = _this27.parse8601(ticker['TimeStamp']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this27.iso8601(timestamp),
                    'high': parseFloat(ticker['High']),
                    'low': parseFloat(ticker['Low']),
                    'bid': parseFloat(ticker['Bid']),
                    'ask': parseFloat(ticker['Ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['Last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['Volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetMarkethistory({
                'market': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'marketGet' + this.capitalize(side) + type;
            var order = {
                'market': this.productId(product),
                'quantity': amount
            };
            if (type == 'limit') order['rate'] = price;
            return this[method](this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/';
            if (type == 'public') {
                url += type + '/' + method.toLowerCase() + path;
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce();
                url += type + '/';
                if (type == 'account' && path != 'withdraw' || path == 'openorders') url += method.toLowerCase();
                url += path + '?' + this.urlencode(this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, params));
                headers = { 'apisign': this.hmac(url, this.secret, 'sha512') };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcchina = {

        'id': 'btcchina',
        'name': 'BTCChina',
        'countries': 'CN',
        'rateLimit': 3000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766368-465b3286-5ed6-11e7-9a11-0f6467e1d82b.jpg',
            'api': {
                'public': 'https://data.btcchina.com/data',
                'private': 'https://api.btcchina.com/api_trade_v1.php'
            },
            'www': 'https://www.btcchina.com',
            'doc': 'https://www.btcchina.com/apidocs'
        },
        'api': {
            'public': {
                'get': ['historydata', 'orderbook', 'ticker', 'trades']
            },
            'private': {
                'post': ['BuyIcebergOrder', 'BuyOrder', 'BuyOrder2', 'BuyStopOrder', 'CancelIcebergOrder', 'CancelOrder', 'CancelStopOrder', 'GetAccountInfo', 'getArchivedOrder', 'getArchivedOrders', 'GetDeposits', 'GetIcebergOrder', 'GetIcebergOrders', 'GetMarketDepth', 'GetMarketDepth2', 'GetOrder', 'GetOrders', 'GetStopOrder', 'GetStopOrders', 'GetTransactions', 'GetWithdrawal', 'GetWithdrawals', 'RequestWithdrawal', 'SellIcebergOrder', 'SellOrder', 'SellOrder2', 'SellStopOrder']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                keys,
                p,
                key,
                product,
                parts,
                id,
                base,
                quote,
                symbol,
                _this28 = this;

            return Promise.resolve().then(function () {
                return _this28.publicGetTicker({
                    'market': 'all'
                });
            }).then(function (_resp) {
                products = _resp;
                result = [];
                keys = Object.keys(products);

                for (p = 0; p < keys.length; p++) {
                    key = keys[p];
                    product = products[key];
                    parts = key.split('_');
                    id = parts[1];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostGetAccountInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook({
                'market': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this29 = this;

            return Promise.resolve().then(function () {
                p = _this29.product(product);
                return _this29.publicGetTicker({
                    'market': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers['ticker'];
                timestamp = ticker['date'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this29.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['prev_close']),
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'market': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var p = this.product(product);
            var method = 'privatePost' + this.capitalize(side) + 'Order2';
            var order = {};
            var id = p['id'].toUpperCase();
            if (type == 'market') {
                order['params'] = [undefined, amount, id];
            } else {
                order['params'] = [price, amount, id];
            }
            return this[method](this.extend(order, params));
        },
        nonce: function nonce() {
            return this.microseconds();
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type] + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var p = [];
                if ('params' in params) p = params['params'];
                var nonce = this.nonce();
                var request = {
                    'method': path,
                    'id': nonce,
                    'params': p
                };
                p = p.join(',');
                body = JSON.stringify(request);
                var query = 'tonce=' + nonce + '&accesskey=' + this.apiKey + '&requestmethod=' + method.toLowerCase() + '&id=' + nonce + '&method=' + path + '&params=' + p;
                var signature = this.hmac(query, this.secret, 'sha1');
                var auth = this.apiKey + ':' + signature;
                headers = {
                    'Content-Length': body.length,
                    'Authorization': 'Basic ' + this.stringToBase64(query),
                    'Json-Rpc-Tonce': nonce
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcx = {

        'id': 'btcx',
        'name': 'BTCX',
        'countries': ['IS', 'US', 'EU'],
        'rateLimit': 3000, // support in english is very poor, unable to tell rate limits
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766385-9fdcc98c-5ed6-11e7-8f14-66d5e5cd47e6.jpg',
            'api': 'https://btc-x.is/api',
            'www': 'https://btc-x.is',
            'doc': 'https://btc-x.is/custom/api-document.html'
        },
        'api': {
            'public': {
                'get': ['depth/{id}/{limit}', 'ticker/{id}', 'trade/{id}/{limit}']
            },
            'private': {
                'post': ['balance', 'cancel', 'history', 'order', 'redeem', 'trade', 'withdraw']
            }
        },
        'products': {
            'BTC/USD': { 'id': 'btc/usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btc/eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            var p = this.product(product);
            return this.publicGetDepthIdLimit({
                'id': this.productId(product),
                'limit': 1000
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this30 = this;

            return Promise.resolve().then(function () {
                return _this30.publicGetTickerId({
                    'id': _this30.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['time'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this30.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTradeIdLimit({
                'id': this.productId(product),
                'limit': 100
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostTrade(this.extend({
                'type': side.toUpperCase(),
                'market': this.productId(product),
                'amount': amount,
                'price': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/';
            if (type == 'public') {
                url += this.implodeParams(path, params);
            } else {
                var nonce = this.nonce();
                url += type;
                body = this.urlencode(this.extend({
                    'Method': path.toUpperCase(),
                    'Nonce': nonce
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Key': this.apiKey,
                    'Signature': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bxinth = {

        'id': 'bxinth',
        'name': 'BX.in.th',
        'countries': 'TH', // Thailand
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766412-567b1eb4-5ed7-11e7-94a8-ff6a3884f6c5.jpg',
            'api': 'https://bx.in.th/api',
            'www': 'https://bx.in.th',
            'doc': 'https://bx.in.th/info/api'
        },
        'api': {
            'public': {
                'get': ['', // ticker
                'options', 'optionbook', 'orderbook', 'pairing', 'trade', 'tradehistory']
            },
            'private': {
                'post': ['balance', 'biller', 'billgroup', 'billpay', 'cancel', 'deposit', 'getorders', 'history', 'option-issue', 'option-bid', 'option-sell', 'option-myissue', 'option-mybid', 'option-myoptions', 'option-exercise', 'option-cancel', 'option-history', 'order', 'withdrawal', 'withdrawal-history']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this31 = this;

            return Promise.resolve().then(function () {
                return _this31.publicGetPairing();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    product = products[keys[p]];
                    id = product['pairing_id'];
                    base = product['primary_currency'];
                    quote = product['secondary_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook({
                'pairing': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this32 = this;

            return Promise.resolve().then(function () {
                p = _this32.product(product);
                return _this32.publicGet({ 'pairing': p['id'] });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = _this32.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this32.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['orderbook']['bids']['highbid']),
                    'ask': parseFloat(ticker['orderbook']['asks']['highbid']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': parseFloat(ticker['change']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume_24hours']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrade({
                'pairing': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostOrder(this.extend({
                'pairing': this.productId(product),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + path + '/';
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
            if (type == 'private') {
                var nonce = this.nonce();
                var signature = this.hash(this.apiKey + nonce + this.secret, 'sha256');
                body = this.urlencode(this.extend({
                    'key': this.apiKey,
                    'nonce': nonce,
                    'signature': signature
                    // twofa: this.twofa,
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var ccex = {

        'id': 'ccex',
        'name': 'C-CEX',
        'countries': ['DE', 'EU'],
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766433-16881f90-5ed8-11e7-92f8-3d92cc747a6c.jpg',
            'api': {
                'tickers': 'https://c-cex.com/t',
                'public': 'https://c-cex.com/t/api_pub.html',
                'private': 'https://c-cex.com/t/api.html'
            },
            'www': 'https://c-cex.com',
            'doc': 'https://c-cex.com/?id=api'
        },
        'api': {
            'tickers': {
                'get': ['coinnames', '{market}', 'pairs', 'prices', 'volume_{coin}']
            },
            'public': {
                'get': ['balancedistribution', 'markethistory', 'markets', 'marketsummaries', 'orderbook']
            },
            'private': {
                'get': ['buylimit', 'cancel', 'getbalance', 'getbalances', 'getopenorders', 'getorder', 'getorderhistory', 'mytrades', 'selllimit']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this33 = this;

            return Promise.resolve().then(function () {
                return _this33.publicGetMarkets();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['result'].length; p++) {
                    product = products['result'][p];
                    id = product['MarketName'];
                    base = product['MarketCurrency'];
                    quote = product['BaseCurrency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetBalances();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook({
                'market': this.productId(product),
                'type': 'both',
                'depth': 100
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this34 = this;

            return Promise.resolve().then(function () {
                return _this34.tickersGetMarket({
                    'market': _this34.productId(product).toLowerCase()
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this34.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastprice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['buysupport']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetMarkethistory({
                'market': this.productId(product),
                'type': 'both',
                'depth': 100
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privateGet' + this.capitalize(side) + type;
            return this[method](this.extend({
                'market': this.productId(product),
                'quantity': amount,
                'rate': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            if (type == 'private') {
                var nonce = this.nonce().toString();
                var query = this.keysort(this.extend({
                    'a': path,
                    'apikey': this.apiKey,
                    'nonce': nonce
                }, params));
                url += '?' + this.urlencode(query);
                headers = { 'apisign': this.hmac(url, this.secret, 'sha512') };
            } else if (type == 'public') {
                url += '?' + this.urlencode(this.extend({
                    'a': 'get' + path
                }, params));
            } else {
                url += '/' + this.implodeParams(path, params) + '.json';
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var cex = {

        'id': 'cex',
        'name': 'CEX.IO',
        'countries': ['UK', 'EU', 'CY', 'RU'],
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766442-8ddc33b0-5ed8-11e7-8b98-f786aef0f3c9.jpg',
            'api': 'https://cex.io/api',
            'www': 'https://cex.io',
            'doc': 'https://cex.io/cex-api'
        },
        'api': {
            'public': {
                'get': ['currency_limits', 'last_price/{pair}', 'last_prices/{currencies}', 'ohlcv/hd/{yyyymmdd}/{pair}', 'order_book/{pair}', 'ticker/{pair}', 'tickers/{currencies}', 'trade_history/{pair}'],
                'post': ['convert/{pair}', 'price_stats/{pair}']
            },
            'private': {
                'post': ['active_orders_status/', 'archived_orders/{pair}', 'balance/', 'cancel_order/', 'cancel_orders/{pair}', 'cancel_replace_order/{pair}', 'close_position/{pair}', 'get_address/', 'get_myfee/', 'get_order/', 'get_order_tx/', 'open_orders/{pair}', 'open_orders/', 'open_position/{pair}', 'open_positions/{pair}', 'place_order/{pair}', 'place_order/{pair}']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                symbol,
                _symbol$split7,
                _symbol$split8,
                base,
                quote,
                _this35 = this;

            return Promise.resolve().then(function () {
                return _this35.publicGetCurrencyLimits();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['data']['pairs'].length; p++) {
                    product = products['data']['pairs'][p];
                    id = product['symbol1'] + '/' + product['symbol2'];
                    symbol = id;
                    _symbol$split7 = symbol.split('/');
                    _symbol$split8 = _slicedToArray(_symbol$split7, 2);
                    base = _symbol$split8[0];
                    quote = _symbol$split8[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBookPair({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this36 = this;

            return Promise.resolve().then(function () {
                return _this36.publicGetTickerPair({
                    'pair': _this36.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this36.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': parseFloat(ticker['change']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTradeHistoryPair({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'pair': this.productId(product),
                'type': side,
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;else order['order_type'] = type;
            return this.privatePostPlaceOrderPair(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce().toString();
                body = this.urlencode(this.extend({
                    'key': this.apiKey,
                    'signature': this.hmac(nonce + this.uid + this.apiKey, this.secret).toUpperCase(),
                    'nonce': nonce
                }, query));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coincheck = {

        'id': 'coincheck',
        'name': 'coincheck',
        'countries': ['JP', 'ID'],
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766464-3b5c3c74-5ed9-11e7-840e-31b32968e1da.jpg',
            'api': 'https://coincheck.com/api',
            'www': 'https://coincheck.com',
            'doc': 'https://coincheck.com/documents/exchange/api'
        },
        'api': {
            'public': {
                'get': ['exchange/orders/rate', 'order_books', 'rate/{pair}', 'ticker', 'trades']
            },
            'private': {
                'get': ['accounts', 'accounts/balance', 'accounts/leverage_balance', 'bank_accounts', 'deposit_money', 'exchange/orders/opens', 'exchange/orders/transactions', 'exchange/orders/transactions_pagination', 'exchange/leverage/positions', 'lending/borrows/matches', 'send_money', 'withdraws'],
                'post': ['bank_accounts', 'deposit_money/{id}/fast', 'exchange/orders', 'exchange/transfers/to_leverage', 'exchange/transfers/from_leverage', 'lending/borrows', 'lending/borrows/{id}/repay', 'send_money', 'withdraws'],
                'delete': ['bank_accounts/{id}', 'exchange/orders/{id}', 'withdraws/{id}']
            }
        },
        'products': {
            'BTC/JPY': { 'id': 'btc_jpy', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' }, // the only real pair
            'ETH/JPY': { 'id': 'eth_jpy', 'symbol': 'ETH/JPY', 'base': 'ETH', 'quote': 'JPY' },
            'ETC/JPY': { 'id': 'etc_jpy', 'symbol': 'ETC/JPY', 'base': 'ETC', 'quote': 'JPY' },
            'DAO/JPY': { 'id': 'dao_jpy', 'symbol': 'DAO/JPY', 'base': 'DAO', 'quote': 'JPY' },
            'LSK/JPY': { 'id': 'lsk_jpy', 'symbol': 'LSK/JPY', 'base': 'LSK', 'quote': 'JPY' },
            'FCT/JPY': { 'id': 'fct_jpy', 'symbol': 'FCT/JPY', 'base': 'FCT', 'quote': 'JPY' },
            'XMR/JPY': { 'id': 'xmr_jpy', 'symbol': 'XMR/JPY', 'base': 'XMR', 'quote': 'JPY' },
            'REP/JPY': { 'id': 'rep_jpy', 'symbol': 'REP/JPY', 'base': 'REP', 'quote': 'JPY' },
            'XRP/JPY': { 'id': 'xrp_jpy', 'symbol': 'XRP/JPY', 'base': 'XRP', 'quote': 'JPY' },
            'ZEC/JPY': { 'id': 'zec_jpy', 'symbol': 'ZEC/JPY', 'base': 'ZEC', 'quote': 'JPY' },
            'XEM/JPY': { 'id': 'xem_jpy', 'symbol': 'XEM/JPY', 'base': 'XEM', 'quote': 'JPY' },
            'LTC/JPY': { 'id': 'ltc_jpy', 'symbol': 'LTC/JPY', 'base': 'LTC', 'quote': 'JPY' },
            'DASH/JPY': { 'id': 'dash_jpy', 'symbol': 'DASH/JPY', 'base': 'DASH', 'quote': 'JPY' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETC/BTC': { 'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
            'FCT/BTC': { 'id': 'fct_btc', 'symbol': 'FCT/BTC', 'base': 'FCT', 'quote': 'BTC' },
            'XMR/BTC': { 'id': 'xmr_btc', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC' },
            'REP/BTC': { 'id': 'rep_btc', 'symbol': 'REP/BTC', 'base': 'REP', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'ZEC/BTC': { 'id': 'zec_btc', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC' },
            'XEM/BTC': { 'id': 'xem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            return this.privateGetAccountsBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBooks();
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this37 = this;

            return Promise.resolve().then(function () {
                return _this37.publicGetTicker();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this37.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var prefix = '';
            var order = {
                'pair': this.productId(product)
            };
            if (type == 'market') {
                var order_type = type + '_' + side;
                order['order_type'] = order_type;
                var _prefix = side == buy ? order_type + '_' : '';
                order[_prefix + 'amount'] = amount;
            } else {
                order['order_type'] = side;
                order['rate'] = price;
                order['amount'] = amount;
            }
            return this.privatePostExchangeOrders(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce().toString();
                if (Object.keys(query).length) body = this.urlencode(this.keysort(query));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'ACCESS-KEY': this.apiKey,
                    'ACCESS-NONCE': nonce,
                    'ACCESS-SIGNATURE': this.hmac(nonce + url + (body || ''), this.secret)
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coinsecure = {

        'id': 'coinsecure',
        'name': 'Coinsecure',
        'countries': 'IN', // India
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766472-9cbd200a-5ed9-11e7-9551-2267ad7bac08.jpg',
            'api': 'https://api.coinsecure.in',
            'www': 'https://coinsecure.in',
            'doc': ['https://api.coinsecure.in', 'https://github.com/coinsecure/plugins']
        },
        'api': {
            'public': {
                'get': ['bitcoin/search/confirmation/{txid}', 'exchange/ask/low', 'exchange/ask/orders', 'exchange/bid/high', 'exchange/bid/orders', 'exchange/lastTrade', 'exchange/max24Hr', 'exchange/min24Hr', 'exchange/ticker', 'exchange/trades']
            },
            'private': {
                'get': ['mfa/authy/call', 'mfa/authy/sms', 'netki/search/{netkiName}', 'user/bank/otp/{number}', 'user/kyc/otp/{number}', 'user/profile/phone/otp/{number}', 'user/wallet/coin/address/{id}', 'user/wallet/coin/deposit/confirmed/all', 'user/wallet/coin/deposit/confirmed/{id}', 'user/wallet/coin/deposit/unconfirmed/all', 'user/wallet/coin/deposit/unconfirmed/{id}', 'user/wallet/coin/wallets', 'user/exchange/bank/fiat/accounts', 'user/exchange/bank/fiat/balance/available', 'user/exchange/bank/fiat/balance/pending', 'user/exchange/bank/fiat/balance/total', 'user/exchange/bank/fiat/deposit/cancelled', 'user/exchange/bank/fiat/deposit/unverified', 'user/exchange/bank/fiat/deposit/verified', 'user/exchange/bank/fiat/withdraw/cancelled', 'user/exchange/bank/fiat/withdraw/completed', 'user/exchange/bank/fiat/withdraw/unverified', 'user/exchange/bank/fiat/withdraw/verified', 'user/exchange/ask/cancelled', 'user/exchange/ask/completed', 'user/exchange/ask/pending', 'user/exchange/bid/cancelled', 'user/exchange/bid/completed', 'user/exchange/bid/pending', 'user/exchange/bank/coin/addresses', 'user/exchange/bank/coin/balance/available', 'user/exchange/bank/coin/balance/pending', 'user/exchange/bank/coin/balance/total', 'user/exchange/bank/coin/deposit/cancelled', 'user/exchange/bank/coin/deposit/unverified', 'user/exchange/bank/coin/deposit/verified', 'user/exchange/bank/coin/withdraw/cancelled', 'user/exchange/bank/coin/withdraw/completed', 'user/exchange/bank/coin/withdraw/unverified', 'user/exchange/bank/coin/withdraw/verified', 'user/exchange/bank/summary', 'user/exchange/coin/fee', 'user/exchange/fiat/fee', 'user/exchange/kycs', 'user/exchange/referral/coin/paid', 'user/exchange/referral/coin/successful', 'user/exchange/referral/fiat/paid', 'user/exchange/referrals', 'user/exchange/trade/summary', 'user/login/token/{token}', 'user/summary', 'user/wallet/summary', 'wallet/coin/withdraw/cancelled', 'wallet/coin/withdraw/completed', 'wallet/coin/withdraw/unverified', 'wallet/coin/withdraw/verified'],
                'post': ['login', 'login/initiate', 'login/password/forgot', 'mfa/authy/initiate', 'mfa/ga/initiate', 'signup', 'user/netki/update', 'user/profile/image/update', 'user/exchange/bank/coin/withdraw/initiate', 'user/exchange/bank/coin/withdraw/newVerifycode', 'user/exchange/bank/fiat/withdraw/initiate', 'user/exchange/bank/fiat/withdraw/newVerifycode', 'user/password/change', 'user/password/reset', 'user/wallet/coin/withdraw/initiate', 'wallet/coin/withdraw/newVerifycode'],
                'put': ['signup/verify/{token}', 'user/exchange/kyc', 'user/exchange/bank/fiat/deposit/new', 'user/exchange/ask/new', 'user/exchange/bid/new', 'user/exchange/instant/buy', 'user/exchange/instant/sell', 'user/exchange/bank/coin/withdraw/verify', 'user/exchange/bank/fiat/account/new', 'user/exchange/bank/fiat/withdraw/verify', 'user/mfa/authy/initiate/enable', 'user/mfa/ga/initiate/enable', 'user/netki/create', 'user/profile/phone/new', 'user/wallet/coin/address/new', 'user/wallet/coin/new', 'user/wallet/coin/withdraw/sendToExchange', 'user/wallet/coin/withdraw/verify'],
                'delete': ['user/gcm/{code}', 'user/logout', 'user/exchange/bank/coin/withdraw/unverified/cancel/{withdrawID}', 'user/exchange/bank/fiat/deposit/cancel/{depositID}', 'user/exchange/ask/cancel/{orderID}', 'user/exchange/bid/cancel/{orderID}', 'user/exchange/bank/fiat/withdraw/unverified/cancel/{withdrawID}', 'user/mfa/authy/disable/{code}', 'user/mfa/ga/disable/{code}', 'user/profile/phone/delete', 'user/profile/image/delete/{netkiName}', 'user/wallet/coin/withdraw/unverified/cancel/{withdrawID}']
            }
        },
        'products': {
            'BTC/INR': { 'id': 'BTC/INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' }
        },

        fetchBalance: function fetchBalance() {
            return this.privateGetUserExchangeBankSummary();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetExchangeAskOrders();
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this38 = this;

            return Promise.resolve().then(function () {
                return _this38.publicGetExchangeTicker();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['message'];
                timestamp = ticker['timestamp'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this38.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['coinvolume']),
                    'quoteVolume': parseFloat(ticker['fiatvolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetExchangeTrades();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePutUserExchange';
            var order = {};
            if (type == 'market') {
                method += 'Instant' + this.capitalize(side);
                if (side == 'buy') order['maxFiat'] = amount;else order['maxVol'] = amount;
            } else {
                var direction = side == 'buy' ? 'Bid' : 'Ask';
                method += direction + 'New';
                order['rate'] = price;
                order['vol'] = amount;
            }
            return this[method](self.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'private') {
                headers = { 'Authorization': this.apiKey };
                if (Object.keys(query).length) {
                    body = JSON.stringify(query);
                    headers['Content-Type'] = 'application/json';
                }
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var exmo = {

        'id': 'exmo',
        'name': 'EXMO',
        'countries': ['ES', 'RU'], // Spain, Russia
        'rateLimit': 1000, // once every 350 ms ≈ 180 requests per minute ≈ 3 requests per second
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766491-1b0ea956-5eda-11e7-9225-40d67b481b8d.jpg',
            'api': 'https://api.exmo.com',
            'www': 'https://exmo.me',
            'doc': ['https://exmo.me/ru/api_doc', 'https://github.com/exmo-dev/exmo_api_lib/tree/master/nodejs']
        },
        'api': {
            'public': {
                'get': ['currency', 'order_book', 'pair_settings', 'ticker', 'trades']
            },
            'private': {
                'post': ['user_info', 'order_create', 'order_cancel', 'user_open_orders', 'user_trades', 'user_cancelled_orders', 'order_trades', 'required_amount', 'deposit_address', 'withdraw_crypt', 'withdraw_get_txid', 'excode_create', 'excode_load', 'wallet_history']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                id,
                product,
                symbol,
                _symbol$split9,
                _symbol$split10,
                base,
                quote,
                _this39 = this;

            return Promise.resolve().then(function () {
                return _this39.publicGetPairSettings();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    product = products[id];
                    symbol = id.replace('_', '/');
                    _symbol$split9 = symbol.split('/');
                    _symbol$split10 = _slicedToArray(_symbol$split9, 2);
                    base = _symbol$split10[0];
                    quote = _symbol$split10[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostUserInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBook({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                p,
                ticker,
                timestamp,
                _this40 = this;

            return Promise.resolve().then(function () {
                return _this40.publicGetTicker();
            }).then(function (_resp) {
                response = _resp;
                p = _this40.product(product);
                ticker = response[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this40.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy_price']),
                    'ask': parseFloat(ticker['sell_price']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_trade']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker['vol_curr']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var prefix = '';
            if (type == 'market') prefix = 'market_';
            var order = {
                'pair': this.productId(product),
                'quantity': amount,
                'price': price || 0,
                'type': prefix + side
            };
            return this.privatePostOrderCreate(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Key': this.apiKey,
                    'Sign': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var fyb = {

        'rateLimit': 2000,
        'api': {
            'public': {
                'get': ['ticker', 'tickerdetailed', 'orderbook', 'trades']
            },
            'private': {
                'post': ['test', 'getaccinfo', 'getpendingorders', 'getorderhistory', 'cancelpendingorder', 'placeorder', 'withdraw']
            }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostGetaccinfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook();
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this41 = this;

            return Promise.resolve().then(function () {
                return _this41.publicGetTickerdetailed();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this41.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this41.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostPlaceorder(this.extend({
                'qty': amount,
                'price': price,
                'type': side[0].toUpperCase()
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + path;
            if (type == 'public') {
                url += '.json';
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'timestamp': nonce }, params));
                headers = {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'key': this.apiKey,
                    'sig': this.hmac(body, this.secret, 'sha1')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var fybse = extend(fyb, {
        'id': 'fybse',
        'name': 'FYB-SE',
        'countries': 'SE', // Sweden
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766512-31019772-5edb-11e7-8241-2e675e6797f1.jpg',
            'api': 'https://www.fybse.se/api/SEK',
            'www': 'https://www.fybse.se',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'products': {
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' }
        }
    });

    //-----------------------------------------------------------------------------

    var fybsg = extend(fyb, {
        'id': 'fybsg',
        'name': 'FYB-SG',
        'countries': 'SG', // Singapore
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766513-3364d56a-5edb-11e7-9e6b-d5898bb89c81.jpg',
            'api': 'https://www.fybsg.com/api/SGD',
            'www': 'https://www.fybsg.com',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'products': {
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' }
        }
    });

    //-----------------------------------------------------------------------------

    var gdax = {
        'id': 'gdax',
        'name': 'GDAX',
        'countries': 'US',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg',
            'api': 'https://api.gdax.com',
            'www': 'https://www.gdax.com',
            'doc': 'https://docs.gdax.com'
        },
        'api': {
            'public': {
                'get': ['currencies', 'products', 'products/{id}/book', 'products/{id}/candles', 'products/{id}/stats', 'products/{id}/ticker', 'products/{id}/trades', 'time']
            },
            'private': {
                'get': ['accounts', 'accounts/{id}', 'accounts/{id}/holds', 'accounts/{id}/ledger', 'coinbase-accounts', 'fills', 'funding', 'orders', 'orders/{id}', 'payment-methods', 'position', 'reports/{id}', 'users/self/trailing-volume'],
                'post': ['deposits/coinbase-account', 'deposits/payment-method', 'funding/repay', 'orders', 'position/close', 'profiles/margin-transfer', 'reports', 'withdrawals/coinbase', 'withdrawals/crypto', 'withdrawals/payment-method'],
                'delete': ['orders', 'orders/{id}']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this42 = this;

            return Promise.resolve().then(function () {
                return _this42.publicGetProducts();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products.length; p++) {
                    product = products[p];
                    id = product['id'];
                    base = product['base_currency'];
                    quote = product['quote_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetAccounts();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetProductsIdBook({
                'id': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                ticker,
                quote,
                timestamp,
                _this43 = this;

            return Promise.resolve().then(function () {
                p = _this43.product(product);
                return _this43.publicGetProductsIdTicker({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                return _this43.publicGetProductsIdStats({
                    'id': p['id']
                });
            }).then(function (_resp) {
                quote = _resp;
                timestamp = _this43.parse8601(ticker['time']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this43.iso8601(timestamp),
                    'high': parseFloat(quote['high']),
                    'low': parseFloat(quote['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(quote['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(quote['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetProductsIdTrades({
                'symbol': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'client_oid': this.nonce(),
                'product_id': this.productId(product),
                'side': side,
                'size': amount,
                'type': type
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostOrder(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = '/' + this.implodeParams(path, params);
            var url = this.urls['api'] + request;
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce().toString();
                if (Object.keys(query).length) body = JSON.stringify(query);
                var what = nonce + method + request + (body || '');
                var secret = this.base64ToBinary(this.secret);
                var signature = this.hash(what, secret, 'sha256', 'binary');
                headers = {
                    'CB-ACCESS-KEY': this.apiKey,
                    'CB-ACCESS-SIGN': this.stringToBase64(signature),
                    'CB-ACCESS-TIMESTAMP': nonce,
                    'CB-ACCESS-PASSPHRASE': this.password
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var hitbtc = {

        'id': 'hitbtc',
        'name': 'HitBTC',
        'countries': 'HK', // Hong Kong
        'rateLimit': 2000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766555-8eaec20e-5edc-11e7-9c5b-6dc69fc42f5e.jpg',
            'api': 'http://api.hitbtc.com',
            'www': 'https://hitbtc.com',
            'doc': ['https://hitbtc.com/api', 'http://hitbtc-com.github.io/hitbtc-api', 'http://jsfiddle.net/bmknight/RqbYB']
        },
        'api': {
            'public': {
                'get': ['{symbol}/orderbook', '{symbol}/ticker', '{symbol}/trades', '{symbol}/trades/recent', 'symbols', 'ticker', 'time,']
            },
            'trading': {
                'get': ['balance', 'orders/active', 'orders/recent', 'order', 'trades/by/order', 'trades'],
                'post': ['new_order', 'cancel_order', 'cancel_orders']
            },
            'payment': {
                'get': ['balance', 'address/{currency}', 'transactions', 'transactions/{transaction}'],
                'post': ['transfer_to_trading', 'transfer_to_main', 'address/{currency}', 'payout']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this44 = this;

            return Promise.resolve().then(function () {
                return _this44.publicGetSymbols();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['symbols'].length; p++) {
                    product = products['symbols'][p];
                    id = product['symbol'];
                    base = product['commodity'];
                    quote = product['currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.tradingGetBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetSymbolOrderbook({
                'symbol': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this45 = this;

            return Promise.resolve().then(function () {
                return _this45.publicGetSymbolTicker({
                    'symbol': _this45.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this45.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume']),
                    'quoteVolume': parseFloat(ticker['volume_quote']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetSymbolTrades({
                'symbol': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'clientOrderId': this.nonce(),
                'symbol': this.productId(product),
                'side': side,
                'quantity': amount,
                'type': type
            };
            if (type == 'limit') order['price'] = price;
            return this.tradingPostNewOrder(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/api/' + this.version + '/' + type + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                query = this.extend({ 'nonce': nonce, 'apikey': this.apiKey }, query);
                if (method == 'POST') if (Object.keys(query).length) body = this.urlencode(query);
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Signature': this.hmac(url + (body || ''), this.secret, 'sha512').toLowerCase()
                };
            }
            url = this.urls['api'] + url;
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var huobi = {

        'id': 'huobi',
        'name': 'Huobi',
        'countries': 'CN',
        'rateLimit': 5000,
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
            'api': 'http://api.huobi.com',
            'www': 'https://www.huobi.com',
            'doc': 'https://github.com/huobiapi/API_Docs_en/wiki'
        },
        'api': {
            'staticmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'usdmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'trade': {
                'post': ['get_account_info', 'get_orders', 'order_info', 'buy', 'sell', 'buy_market', 'sell_market', 'cancel_order', 'get_new_deal_orders', 'get_order_id_by_trade_id', 'withdraw_coin', 'cancel_withdraw_coin', 'get_withdraw_coin_result', 'transfer', 'loan', 'repayment', 'get_loan_available', 'get_loans']
            }
        },
        'products': {
            'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 1 },
            'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 2 },
            'BTC/USD': { 'id': 'btc', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'type': 'usdmarket', 'coinType': 1 }
        },

        fetchBalance: function fetchBalance() {
            return this.tradePostGetAccountInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            var p = this.product(product);
            var method = p['type'] + 'GetDepthId';
            return this[method]({ 'id': p['id'] });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                method,
                response,
                ticker,
                timestamp,
                _this46 = this;

            return Promise.resolve().then(function () {
                p = _this46.product(product);
                method = p['type'] + 'GetTickerId';
                return _this46[method]({ 'id': p['id'] });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(response['time']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this46.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            var p = this.product(product);
            var method = p['type'] + 'GetDetailId';
            return this[method]({ 'id': p['id'] });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var p = this.product(product);
            var method = 'tradePost' + this.capitalize(side);
            var order = {
                'coin_type': p['coinType'],
                'amount': amount,
                'market': p['quote'].toLowerCase()
            };
            if (type == 'limit') order['price'] = price;else method += this.capitalize(type);
            return this[method](this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'trade';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'];
            if (type == 'trade') {
                url += '/api' + this.version;
                var query = this.keysort(this.extend({
                    'method': path,
                    'access_key': this.apiKey,
                    'created': this.nonce()
                }, params));
                var queryString = this.urlencode(this.omit(query, 'market'));
                // secret key must be at the end of query to be signed
                queryString += '&secret_key=' + this.secret;
                query['sign'] = this.hash(queryString);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            } else {
                url += '/' + type + '/' + this.implodeParams(path, params) + '_json.js';
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var jubi = {

        'id': 'jubi',
        'name': 'jubi.com',
        'countries': 'CN',
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766581-9d397d9a-5edd-11e7-8fb9-5d8236c0e692.jpg',
            'api': 'https://www.jubi.com/api',
            'www': 'https://www.jubi.com',
            'doc': 'https://www.jubi.com/help/api.html'
        },
        'api': {
            'public': {
                'get': ['depth', 'orders', 'ticker']
            },
            'private': {
                'post': ['balance', 'trade_add', 'trade_cancel', 'trade_list', 'trade_view', 'wallet']
            }
        },
        'products': {
            'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'ETH/CNY': { 'id': 'eth', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY' },
            'ANS/CNY': { 'id': 'ans', 'symbol': 'ANS/CNY', 'base': 'ANS', 'quote': 'CNY' },
            'BLK/CNY': { 'id': 'blk', 'symbol': 'BLK/CNY', 'base': 'BLK', 'quote': 'CNY' },
            'DNC/CNY': { 'id': 'dnc', 'symbol': 'DNC/CNY', 'base': 'DNC', 'quote': 'CNY' },
            'DOGE/CNY': { 'id': 'doge', 'symbol': 'DOGE/CNY', 'base': 'DOGE', 'quote': 'CNY' },
            'EAC/CNY': { 'id': 'eac', 'symbol': 'EAC/CNY', 'base': 'EAC', 'quote': 'CNY' },
            'ETC/CNY': { 'id': 'etc', 'symbol': 'ETC/CNY', 'base': 'ETC', 'quote': 'CNY' },
            'FZ/CNY': { 'id': 'fz', 'symbol': 'FZ/CNY', 'base': 'FZ', 'quote': 'CNY' },
            'GOOC/CNY': { 'id': 'gooc', 'symbol': 'GOOC/CNY', 'base': 'GOOC', 'quote': 'CNY' },
            'GAME/CNY': { 'id': 'game', 'symbol': 'GAME/CNY', 'base': 'GAME', 'quote': 'CNY' },
            'HLB/CNY': { 'id': 'hlb', 'symbol': 'HLB/CNY', 'base': 'HLB', 'quote': 'CNY' },
            'IFC/CNY': { 'id': 'ifc', 'symbol': 'IFC/CNY', 'base': 'IFC', 'quote': 'CNY' },
            'JBC/CNY': { 'id': 'jbc', 'symbol': 'JBC/CNY', 'base': 'JBC', 'quote': 'CNY' },
            'KTC/CNY': { 'id': 'ktc', 'symbol': 'KTC/CNY', 'base': 'KTC', 'quote': 'CNY' },
            'LKC/CNY': { 'id': 'lkc', 'symbol': 'LKC/CNY', 'base': 'LKC', 'quote': 'CNY' },
            'LSK/CNY': { 'id': 'lsk', 'symbol': 'LSK/CNY', 'base': 'LSK', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' },
            'MAX/CNY': { 'id': 'max', 'symbol': 'MAX/CNY', 'base': 'MAX', 'quote': 'CNY' },
            'MET/CNY': { 'id': 'met', 'symbol': 'MET/CNY', 'base': 'MET', 'quote': 'CNY' },
            'MRYC/CNY': { 'id': 'mryc', 'symbol': 'MRYC/CNY', 'base': 'MRYC', 'quote': 'CNY' },
            'MTC/CNY': { 'id': 'mtc', 'symbol': 'MTC/CNY', 'base': 'MTC', 'quote': 'CNY' },
            'NXT/CNY': { 'id': 'nxt', 'symbol': 'NXT/CNY', 'base': 'NXT', 'quote': 'CNY' },
            'PEB/CNY': { 'id': 'peb', 'symbol': 'PEB/CNY', 'base': 'PEB', 'quote': 'CNY' },
            'PGC/CNY': { 'id': 'pgc', 'symbol': 'PGC/CNY', 'base': 'PGC', 'quote': 'CNY' },
            'PLC/CNY': { 'id': 'plc', 'symbol': 'PLC/CNY', 'base': 'PLC', 'quote': 'CNY' },
            'PPC/CNY': { 'id': 'ppc', 'symbol': 'PPC/CNY', 'base': 'PPC', 'quote': 'CNY' },
            'QEC/CNY': { 'id': 'qec', 'symbol': 'QEC/CNY', 'base': 'QEC', 'quote': 'CNY' },
            'RIO/CNY': { 'id': 'rio', 'symbol': 'RIO/CNY', 'base': 'RIO', 'quote': 'CNY' },
            'RSS/CNY': { 'id': 'rss', 'symbol': 'RSS/CNY', 'base': 'RSS', 'quote': 'CNY' },
            'SKT/CNY': { 'id': 'skt', 'symbol': 'SKT/CNY', 'base': 'SKT', 'quote': 'CNY' },
            'TFC/CNY': { 'id': 'tfc', 'symbol': 'TFC/CNY', 'base': 'TFC', 'quote': 'CNY' },
            'VRC/CNY': { 'id': 'vrc', 'symbol': 'VRC/CNY', 'base': 'VRC', 'quote': 'CNY' },
            'VTC/CNY': { 'id': 'vtc', 'symbol': 'VTC/CNY', 'base': 'VTC', 'quote': 'CNY' },
            'WDC/CNY': { 'id': 'wdc', 'symbol': 'WDC/CNY', 'base': 'WDC', 'quote': 'CNY' },
            'XAS/CNY': { 'id': 'xas', 'symbol': 'XAS/CNY', 'base': 'XAS', 'quote': 'CNY' },
            'XPM/CNY': { 'id': 'xpm', 'symbol': 'XPM/CNY', 'base': 'XPM', 'quote': 'CNY' },
            'XRP/CNY': { 'id': 'xrp', 'symbol': 'XRP/CNY', 'base': 'XRP', 'quote': 'CNY' },
            'XSGS/CNY': { 'id': 'xsgs', 'symbol': 'XSGS/CNY', 'base': 'XSGS', 'quote': 'CNY' },
            'YTC/CNY': { 'id': 'ytc', 'symbol': 'YTC/CNY', 'base': 'YTC', 'quote': 'CNY' },
            'ZET/CNY': { 'id': 'zet', 'symbol': 'ZET/CNY', 'base': 'ZET', 'quote': 'CNY' },
            'ZCC/CNY': { 'id': 'zcc', 'symbol': 'ZCC/CNY', 'base': 'ZCC', 'quote': 'CNY' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetDepth({
                'coin': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this47 = this;

            return Promise.resolve().then(function () {
                return _this47.publicGetTicker({
                    'coin': _this47.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this47.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this47.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetOrders({
                'coin': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            return this.privatePostTradeAdd(this.extend({
                'amount': amount,
                'price': price,
                'type': side,
                'coin': this.productId(product)
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce().toString();
                var query = this.extend({
                    'key': this.apiKey,
                    'nonce': nonce
                }, params);
                query['signature'] = this.hmac(this.urlencode(query), this.hash(this.secret));
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------
    // kraken is also owner of ex. Coinsetter / CaVirtEx / Clevercoin

    var kraken = {

        'id': 'kraken',
        'name': 'Kraken',
        'countries': 'US',
        'version': '0',
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e1509.jpg',
            'api': 'https://api.kraken.com',
            'www': 'https://www.kraken.com',
            'doc': ['https://www.kraken.com/en-us/help/api', 'https://github.com/nothingisdead/npm-kraken-api']
        },
        'api': {
            'public': {
                'get': ['Assets', 'AssetPairs', 'Depth', 'OHLC', 'Spread', 'Ticker', 'Time', 'Trades']
            },
            'private': {
                'post': ['AddOrder', 'Balance', 'CancelOrder', 'ClosedOrders', 'DepositAddresses', 'DepositMethods', 'DepositStatus', 'Ledgers', 'OpenOrders', 'OpenPositions', 'QueryLedgers', 'QueryOrders', 'QueryTrades', 'TradeBalance', 'TradesHistory', 'TradeVolume', 'Withdraw', 'WithdrawCancel', 'WithdrawInfo', 'WithdrawStatus']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                id,
                product,
                base,
                quote,
                darkpool,
                symbol,
                _this48 = this;

            return Promise.resolve().then(function () {
                return _this48.publicGetAssetPairs();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    product = products['result'][id];
                    base = product['base'];
                    quote = product['quote'];

                    if (base[0] == 'X' || base[0] == 'Z') {
                        base = base.slice(1);
                    }if (quote[0] == 'X' || quote[0] == 'Z') {
                        quote = quote.slice(1);
                    }base = _this48.commonCurrencyCode(base);
                    quote = _this48.commonCurrencyCode(quote);
                    darkpool = id.indexOf('.d') >= 0;
                    symbol = darkpool ? product['altname'] : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetDepth({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                response,
                ticker,
                timestamp,
                _this49 = this;

            return Promise.resolve().then(function () {
                p = _this49.product(product);
                return _this49.publicGetTicker({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][p['id']];
                timestamp = _this49.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this49.iso8601(timestamp),
                    'high': parseFloat(ticker['h'][1]),
                    'low': parseFloat(ticker['l'][1]),
                    'bid': parseFloat(ticker['b'][0]),
                    'ask': parseFloat(ticker['a'][0]),
                    'vwap': parseFloat(ticker['p'][1]),
                    'open': parseFloat(ticker['o']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['c'][0]),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['v'][1]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'pair': this.productId(product)
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'pair': this.productId(product),
                'type': side,
                'ordertype': type,
                'volume': amount
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostAddOrder(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/' + this.version + '/' + type + '/' + path;
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce().toString();
                var query = this.extend({ 'nonce': nonce }, params);
                body = this.urlencode(query);
                query = this.stringToBinary(url + this.hash(nonce + body, 'sha256', 'binary'));
                var secret = this.base64ToBinary(this.secret);
                headers = {
                    'API-Key': this.apiKey,
                    'API-Sign': this.hmac(query, secret, 'sha512', 'base64'),
                    'Content-type': 'application/x-www-form-urlencoded'
                };
            }
            url = this.urls['api'] + url;
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var luno = {

        'id': 'luno',
        'name': 'luno',
        'countries': ['UK', 'SG', 'ZA'],
        'rateLimit': 5000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766607-8c1a69d8-5ede-11e7-930c-540b5eb9be24.jpg',
            'api': 'https://api.mybitx.com/api',
            'www': 'https://www.luno.com',
            'doc': ['https://npmjs.org/package/bitx', 'https://github.com/bausmeier/node-bitx']
        },
        'api': {
            'public': {
                'get': ['orderbook', 'ticker', 'tickers', 'trades']
            },
            'private': {
                'get': ['accounts/{id}/pending', 'accounts/{id}/transactions', 'balance', 'fee_info', 'funding_address', 'listorders', 'listtrades', 'orders/{id}', 'quotes/{id}', 'withdrawals', 'withdrawals/{id}'],
                'post': ['accounts', 'postorder', 'marketorder', 'stoporder', 'funding_address', 'withdrawals', 'send', 'quotes', 'oauth2/grant'],
                'put': ['quotes/{id}'],
                'delete': ['quotes/{id}', 'withdrawals/{id}']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this50 = this;

            return Promise.resolve().then(function () {
                return _this50.publicGetTickers();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['tickers'].length; p++) {
                    product = products['tickers'][p];
                    id = product['pair'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = _this50.commonCurrencyCode(base);
                    quote = _this50.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this51 = this;

            return Promise.resolve().then(function () {
                return _this51.publicGetTicker({
                    'pair': _this51.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this51.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_trade']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['rolling_24_hour_volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePost';
            var order = { 'pair': this.productId(product) };
            if (type == 'market') {
                method += 'Marketorder';
                order['type'] = side.toUpperCase();
                if (side == 'buy') order['counter_volume'] = amount;else order['base_volume'] = amount;
            } else {
                method += 'Order';
                order['volume'] = amount;
                order['price'] = price;
                if (side == 'buy') order['type'] = 'BID';else order['type'] = 'ASK';
            }
            return this[method](this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
            if (type == 'private') {
                var auth = this.stringToBase64(this.apiKey + ':' + this.secret);
                headers = { 'Authorization': 'Basic ' + auth };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------
    // OKCoin 
    // China
    // https://www.okcoin.com/
    // https://www.okcoin.com/rest_getStarted.html
    // https://github.com/OKCoin/websocket
    // https://www.npmjs.com/package/okcoin.com
    // https://www.okcoin.cn
    // https://www.okcoin.cn/rest_getStarted.html

    var okcoin = {

        'version': 'v1',
        'rateLimit': 2000, // up to 3000 requests per 5 minutes ≈ 600 requests per minute ≈ 10 requests per second ≈ 100 ms
        'api': {
            'public': {
                'get': ['depth', 'exchange_rate', 'future_depth', 'future_estimated_price', 'future_hold_amount', 'future_index', 'future_kline', 'future_price_limit', 'future_ticker', 'future_trades', 'kline', 'otcs', 'ticker', 'trades']
            },
            'private': {
                'post': ['account_records', 'batch_trade', 'borrow_money', 'borrow_order_info', 'borrows_info', 'cancel_borrow', 'cancel_order', 'cancel_otc_order', 'cancel_withdraw', 'future_batch_trade', 'future_cancel', 'future_devolve', 'future_explosive', 'future_order_info', 'future_orders_info', 'future_position', 'future_position_4fix', 'future_trade', 'future_trades_history', 'future_userinfo', 'future_userinfo_4fix', 'lend_depth', 'order_fee', 'order_history', 'order_info', 'orders_info', 'otc_order_history', 'otc_order_info', 'repayment', 'submit_otc_order', 'trade', 'trade_history', 'trade_otc_order', 'withdraw', 'withdraw_info', 'unrepayments_info', 'userinfo']
            }
        },

        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetDepth({
                'symbol': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var response,
                ticker,
                timestamp,
                _this52 = this;

            return Promise.resolve().then(function () {
                return _this52.publicGetTicker({
                    'symbol': _this52.productId(product)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(response['date']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this52.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTrades({
                'symbol': this.productId(product)
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostUserinfo();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'symbol': this.productId(product),
                'type': side,
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;else order['type'] += '_market';
            return this.privatePostTrade(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/api/' + this.version + '/' + path + '.do';
            if (type == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var query = this.keysort(this.extend({
                    'api_key': this.apiKey
                }, params));
                // secret key must be at the end of query
                var queryString = this.urlencode(query) + '&secret_key=' + this.secret;
                query['sign'] = this.hash(queryString).toUpperCase();
                body = this.urlencode(query);
                headers = { 'Content-type': 'application/x-www-form-urlencoded' };
            }
            url = this.urls['api'] + url;
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var okcoincny = extend(okcoin, {
        'id': 'okcoincny',
        'name': 'OKCoin CNY',
        'countries': 'CN',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766792-8be9157a-5ee5-11e7-926c-6d69b8d3378d.jpg',
            'api': 'https://www.okcoin.cn',
            'www': 'https://www.okcoin.cn',
            'doc': 'https://www.okcoin.cn/rest_getStarted.html'
        },
        'products': {
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' }
        }
    });

    //-----------------------------------------------------------------------------

    var okcoinusd = extend(okcoin, {
        'id': 'okcoinusd',
        'name': 'OKCoin USD',
        'countries': ['CN', 'US'],
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg',
            'api': 'https://www.okcoin.com',
            'www': 'https://www.okcoin.com',
            'doc': ['https://www.okcoin.com/rest_getStarted.html', 'https://www.npmjs.com/package/okcoin.com']
        },
        'products': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'LTC/USD': { 'id': 'ltc_usd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' }
        }
    });

    //-----------------------------------------------------------------------------

    var poloniex = {

        'id': 'poloniex',
        'name': 'Poloniex',
        'countries': 'US',
        'rateLimit': 1000, // 6 calls per second
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
            'api': {
                'public': 'https://poloniex.com/public',
                'private': 'https://poloniex.com/tradingApi'
            },
            'www': 'https://poloniex.com',
            'doc': ['https://poloniex.com/support/api/', 'http://pastebin.com/dMX7mZE0']
        },
        'api': {
            'public': {
                'get': ['return24hVolume', 'returnChartData', 'returnCurrencies', 'returnLoanOrders', 'returnOrderBook', 'returnTicker', 'returnTradeHistory']
            },
            'private': {
                'post': ['buy', 'cancelLoanOffer', 'cancelOrder', 'closeMarginPosition', 'createLoanOffer', 'generateNewAddress', 'getMarginPosition', 'marginBuy', 'marginSell', 'moveOrder', 'returnActiveLoans', 'returnAvailableAccountBalances', 'returnBalances', 'returnCompleteBalances', 'returnDepositAddresses', 'returnDepositsWithdrawals', 'returnFeeInfo', 'returnLendingHistory', 'returnMarginAccountSummary', 'returnOpenLoanOffers', 'returnOpenOrders', 'returnOrderTrades', 'returnTradableBalances', 'returnTradeHistory', 'sell', 'toggleAutoRenew', 'transferBalance', 'withdraw']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                id,
                product,
                symbol,
                _symbol$split11,
                _symbol$split12,
                base,
                quote,
                _this53 = this;

            return Promise.resolve().then(function () {
                return _this53.publicGetReturnTicker();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    product = products[id];
                    symbol = id.replace('_', '/');
                    _symbol$split11 = symbol.split('/');
                    _symbol$split12 = _slicedToArray(_symbol$split11, 2);
                    base = _symbol$split12[0];
                    quote = _symbol$split12[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostReturnCompleteBalances({
                'account': 'all'
            });
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetReturnOrderBook({
                'currencyPair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this54 = this;

            return Promise.resolve().then(function () {
                p = _this54.product(product);
                return _this54.publicGetReturnTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = _this54.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this54.iso8601(timestamp),
                    'high': parseFloat(ticker['high24hr']),
                    'low': parseFloat(ticker['low24hr']),
                    'bid': parseFloat(ticker['highestBid']),
                    'ask': parseFloat(ticker['lowestAsk']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': parseFloat(ticker['percentChange']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['baseVolume']),
                    'quoteVolume': parseFloat(ticker['quoteVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetReturnTradeHistory({
                'currencyPair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePost' + this.capitalize(side);
            return this[method](this.extend({
                'currencyPair': this.productId(product),
                'rate': price,
                'amount': amount
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.privatePostCancelOrder(this.extend({
                'orderNumber': id
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            var query = this.extend({ 'command': path }, params);
            if (type == 'public') {
                url += '?' + this.urlencode(query);
            } else {
                query['nonce'] = this.nonce();
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Key': this.apiKey,
                    'Sign': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var quadrigacx = {

        'id': 'quadrigacx',
        'name': 'QuadrigaCX',
        'countries': 'CA',
        'rateLimit': 2000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766825-98a6d0de-5ee7-11e7-9fa4-38e11a2c6f52.jpg',
            'api': 'https://api.quadrigacx.com',
            'www': 'https://www.quadrigacx.com',
            'doc': 'https://www.quadrigacx.com/api_info'
        },
        'api': {
            'public': {
                'get': ['order_book', 'ticker', 'transactions']
            },
            'private': {
                'post': ['balance', 'bitcoin_deposit_address', 'bitcoin_withdrawal', 'buy', 'cancel_order', 'ether_deposit_address', 'ether_withdrawal', 'lookup_order', 'open_orders', 'sell', 'user_transactions']
            }
        },
        'products': {
            'BTC/CAD': { 'id': 'btc_cad', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETH/CAD': { 'id': 'eth_cad', 'symbol': 'ETH/CAD', 'base': 'ETH', 'quote': 'CAD' }
        },

        fetchBalance: function fetchBalance() {
            return this.privatePostBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderBook({
                'book': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this55 = this;

            return Promise.resolve().then(function () {
                return _this55.publicGetTicker({
                    'book': _this55.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this55.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTransactions({
                'book': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var method = 'privatePost' + this.capitalize(side);
            var order = {
                'amount': amount,
                'book': this.productId(product)
            };
            if (type == 'limit') order['price'] = price;
            return this[method](this.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.privatePostCancelOrder(this.extend({ id: id }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (type == 'public') {
                url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce();
                var request = [nonce, this.uid, this.apiKey].join('');
                var signature = this.hmac(request, this.secret);
                var query = this.extend({
                    'key': this.apiKey,
                    'nonce': nonce,
                    'signature': signature
                }, params);
                body = JSON.stringify(query);
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var quoine = {

        'id': 'quoine',
        'name': 'QUOINE',
        'countries': ['JP', 'SG', 'VN'],
        'version': '2',
        'rateLimit': 2000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766844-9615a4e8-5ee8-11e7-8814-fcd004db8cdd.jpg',
            'api': 'https://api.quoine.com',
            'www': 'https://www.quoine.com',
            'doc': 'https://developers.quoine.com'
        },
        'api': {
            'public': {
                'get': ['products', 'products/{id}', 'products/{id}/price_levels', 'executions', 'ir_ladders/{currency}']
            },
            'private': {
                'get': ['accounts/balance', 'crypto_accounts', 'executions/me', 'fiat_accounts', 'loan_bids', 'loans', 'orders', 'orders/{id}', 'orders/{id}/trades', 'trades', 'trades/{id}/loans', 'trading_accounts', 'trading_accounts/{id}'],
                'post': ['fiat_accounts', 'loan_bids', 'orders'],
                'put': ['loan_bids/{id}/close', 'loans/{id}', 'orders/{id}', 'orders/{id}/cancel', 'trades/{id}', 'trades/{id}/close', 'trades/close_all', 'trading_accounts/{id}']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this56 = this;

            return Promise.resolve().then(function () {
                return _this56.publicGetProducts();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products.length; p++) {
                    product = products[p];
                    id = product['id'];
                    base = product['base_currency'];
                    quote = product['quoted_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetAccountsBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetProductsIdPriceLevels({
                'id': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this57 = this;

            return Promise.resolve().then(function () {
                return _this57.publicGetProductsId({
                    'id': _this57.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this57.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this57.iso8601(timestamp),
                    'high': parseFloat(ticker['high_market_ask']),
                    'low': parseFloat(ticker['low_market_bid']),
                    'bid': parseFloat(ticker['market_bid']),
                    'ask': parseFloat(ticker['market_ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_traded_price']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume_24h']),
                    'quoteVolume': undefined,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetExecutions({
                'product_id': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'order_type': type,
                'product_id': this.productId(product),
                'side': side,
                'quantity': amount
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostOrders(this.extend({
                'order': order
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.privatePutOrdersIdCancel(this.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            headers = {
                'X-Quoine-API-Version': this.version,
                'Content-type': 'application/json'
            };
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                var request = {
                    'path': url,
                    'nonce': nonce,
                    'token_id': this.apiKey,
                    'iat': Math.floor(nonce / 1000) // issued at
                };
                if (Object.keys(query).length) body = JSON.stringify(query);
                headers['X-Quoine-Auth'] = this.jwt(request, this.secret);
            }
            return this.fetch(this.urls['api'] + url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var therock = {

        'id': 'therock',
        'name': 'TheRockTrading',
        'countries': 'MT',
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg',
            'api': 'https://api.therocktrading.com',
            'www': 'https://therocktrading.com',
            'doc': 'https://api.therocktrading.com/doc/'
        },
        'api': {
            'public': {
                'get': ['funds/{id}/orderbook', 'funds/{id}/ticker', 'funds/{id}/trades', 'funds/tickers']
            },
            'private': {
                'get': ['balances', 'balances/{id}', 'discounts', 'discounts/{id}', 'funds', 'funds/{id}', 'funds/{id}/trades', 'funds/{fund_id}/orders', 'funds/{fund_id}/orders/{id}', 'funds/{fund_id}/position_balances', 'funds/{fund_id}/positions', 'funds/{fund_id}/positions/{id}', 'transactions', 'transactions/{id}', 'withdraw_limits/{id}', 'withdraw_limits'],
                'post': ['atms/withdraw', 'funds/{fund_id}/orders'],
                'delete': ['funds/{fund_id}/orders/{id}', 'funds/{fund_id}/orders/remove_all']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                base,
                quote,
                symbol,
                _this58 = this;

            return Promise.resolve().then(function () {
                return _this58.publicGetFundsTickers();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products['tickers'].length; p++) {
                    product = products['tickers'][p];
                    id = product['fund_id'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetBalances();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetFundsIdOrderbook({
                'id': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this59 = this;

            return Promise.resolve().then(function () {
                return _this59.publicGetFundsIdTicker({
                    'id': _this59.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this59.parse8601(ticker['date']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this59.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume_traded']),
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetFundsIdTrades({
                'id': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            if (type == 'market') throw new Error(this.id + ' allows limit orders only');
            return this.privatePostFundsFundIdOrders(this.extend({
                'fund_id': this.productId(product),
                'side': side,
                'amount': amount,
                'price': price
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'private') {
                var nonce = this.nonce().toString();
                headers = {
                    'X-TRT-KEY': this.apiKey,
                    'X-TRT-NONCE': nonce,
                    'X-TRT-SIGN': this.hmac(nonce + url, this.secret, 'sha512')
                };
                if (Object.keys(query).length) {
                    body = JSON.stringify(query);
                    headers['Content-Type'] = 'application/json';
                }
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var vaultoro = {

        'id': 'vaultoro',
        'name': 'Vaultoro',
        'countries': 'CH',
        'rateLimit': 1000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766880-f205e870-5ee9-11e7-8fe2-0d5b15880752.jpg',
            'api': 'https://api.vaultoro.com',
            'www': 'https://www.vaultoro.com',
            'doc': 'https://api.vaultoro.com'
        },
        'api': {
            'public': {
                'get': ['bidandask', 'buyorders', 'latest', 'latesttrades', 'markets', 'orderbook', 'sellorders', 'transactions/day', 'transactions/hour', 'transactions/month']
            },
            'private': {
                'get': ['balance', 'mytrades', 'orders'],
                'post': ['buy/{symbol}/{type}', 'cancel/{orderid', 'sell/{symbol}/{type}', 'withdraw']
            }
        },

        fetchProducts: function fetchProducts() {
            var result,
                products,
                product,
                base,
                quote,
                symbol,
                baseId,
                quoteId,
                id,
                _this60 = this;

            return Promise.resolve().then(function () {
                result = [];
                return _this60.publicGetMarkets();
            }).then(function (_resp) {
                products = _resp;
                product = products['data'];
                base = product['BaseCurrency'];
                quote = product['MarketCurrency'];
                symbol = base + '/' + quote;
                baseId = base;
                quoteId = quote;
                id = product['MarketName'];

                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'info': product
                });
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privateGetBalance();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicGetOrderbook();
        },
        fetchTicker: function fetchTicker(product) {
            var quote,
                bidsLength,
                bid,
                ask,
                response,
                ticker,
                timestamp,
                _this61 = this;

            return Promise.resolve().then(function () {
                return _this61.publicGetBidandask();
            }).then(function (_resp) {
                quote = _resp;
                bidsLength = quote['bids'].length;
                bid = quote['bids'][bidsLength - 1];
                ask = quote['asks'][0];
                return _this61.publicGetMarkets();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = _this61.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this61.iso8601(timestamp),
                    'high': parseFloat(ticker['24hHigh']),
                    'low': parseFloat(ticker['24hLow']),
                    'bid': bid[0],
                    'ask': ask[0],
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['24hVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetTransactionsDay();
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var p = this.product(product);
            var method = 'privatePost' + this.capitalize(side) + 'SymbolType';
            return this[method](this.extend({
                'symbol': p['quoteId'].toLowerCase(),
                'type': type,
                'gld': amount,
                'price': price || 1
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/';
            if (type == 'public') {
                url += path;
            } else {
                var nonce = this.nonce();
                url += this.version + '/' + this.implodeParams(path, params);
                var query = this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, this.omit(params, this.extractParams(path)));
                url += '?' + this.urlencode(query);
                headers = {
                    'Content-Type': 'application/json',
                    'X-Signature': this.hmac(url, this.secret)
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var virwox = {

        'id': 'virwox',
        'name': 'VirWoX',
        'countries': 'AT',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766894-6da9d360-5eea-11e7-90aa-41f2711b7405.jpg',
            'api': {
                'public': 'http://api.virwox.com/api/json.php',
                'private': 'https://www.virwox.com/api/trading.php'
            },
            'www': 'https://www.virwox.com',
            'doc': 'https://www.virwox.com/developers.php'
        },
        'api': {
            'public': {
                'get': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics'],
                'post': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics']
            },
            'private': {
                'get': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder'],
                'post': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                product,
                id,
                symbol,
                base,
                quote,
                _this62 = this;

            return Promise.resolve().then(function () {
                return _this62.publicGetInstruments();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    product = products['result'][keys[p]];
                    id = product['instrumentID'];
                    symbol = product['symbol'];
                    base = product['longCurrency'];
                    quote = product['shortCurrency'];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.privatePostGetBalances();
        },
        fetchBestPrices: function fetchBestPrices(product) {
            return this.publicPostGetBestPrices({
                'symbols': [this.symbol(product)]
            });
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.publicPostGetMarketDepth({
                'symbols': [this.symbol(product)],
                'buyDepth': 100,
                'sellDepth': 100
            });
        },
        fetchTicker: function fetchTicker(product) {
            var end,
                start,
                response,
                tickers,
                keys,
                length,
                lastKey,
                ticker,
                timestamp,
                _this63 = this;

            return Promise.resolve().then(function () {
                end = _this63.milliseconds();
                start = end - 86400000;
                return _this63.publicGetTradedPriceVolume({
                    'instrument': _this63.symbol(product),
                    'endDate': _this63.yyyymmddhhmmss(end),
                    'startDate': _this63.yyyymmddhhmmss(start),
                    'HLOC': 1
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result']['priceVolumeList'];
                keys = Object.keys(tickers);
                length = keys.length;
                lastKey = keys[length - 1];
                ticker = tickers[lastKey];
                timestamp = _this63.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this63.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['longVolume']),
                    'quoteVolume': parseFloat(ticker['shortVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.publicGetRawTradeData({
                'instrument': this.symbol(product),
                'timespan': 3600
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            var order = {
                'instrument': this.symbol(product),
                'orderType': side.toUpperCase(),
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;
            return this.privatePostPlaceOrder(this.extend(order, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][type];
            var auth = {};
            if (type == 'public') {
                auth['key'] = this.apiKey;
                auth['user'] = this.login;
                auth['pass'] = this.password;
            }
            var nonce = this.nonce();
            if (method == 'GET') {
                url += '?' + this.urlencode(this.extend({
                    'method': path,
                    'id': nonce
                }, auth, params));
            } else {
                headers = { 'Content-type': 'application/json' };
                body = JSON.stringify({
                    'method': path,
                    'params': this.extend(auth, params),
                    'id': nonce
                });
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var yobit = {

        'id': 'yobit',
        'name': 'YoBit',
        'countries': 'RU',
        'rateLimit': 2000, // responses are cached every 2 seconds
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766910-cdcbfdae-5eea-11e7-9859-03fea873272d.jpg',
            'api': 'https://yobit.net',
            'www': 'https://www.yobit.net',
            'doc': 'https://www.yobit.net/en/api/'
        },
        'api': {
            'api': {
                'get': ['depth/{pairs}', 'info', 'ticker/{pairs}', 'trades/{pairs}']
            },
            'tapi': {
                'post': ['ActiveOrders', 'CancelOrder', 'GetDepositAddress', 'getInfo', 'OrderInfo', 'Trade', 'TradeHistory', 'WithdrawCoinsToAddress']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                keys,
                result,
                p,
                id,
                product,
                symbol,
                _symbol$split13,
                _symbol$split14,
                base,
                quote,
                _this64 = this;

            return Promise.resolve().then(function () {
                return _this64.apiGetInfo();
            }).then(function (_resp) {
                products = _resp;
                keys = Object.keys(products['pairs']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    product = products['pairs'][id];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split13 = symbol.split('/');
                    _symbol$split14 = _slicedToArray(_symbol$split13, 2);
                    base = _symbol$split14[0];
                    quote = _symbol$split14[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.tapiPostGetInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.apiGetDepthPairs({
                'pairs': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this65 = this;

            return Promise.resolve().then(function () {
                p = _this65.product(product);
                return _this65.apiGetTickerPairs({
                    'pairs': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this65.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol_cur']),
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.apiGetTradesPairs({
                'pairs': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            if (type == 'market') throw new Error(this.id + ' allows limit orders only');
            return this.tapiPostTrade(this.extend({
                'pair': this.productId(product),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.tapiPostCancelOrder(this.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + type;
            if (type == 'api') {
                url += '/' + this.version + '/' + this.implodeParams(path, params);
                var query = this.omit(params, this.extractParams(path));
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                var _query = this.extend({ 'method': path, 'nonce': nonce }, params);
                body = this.urlencode(_query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': this.apiKey,
                    'sign': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var zaif = {

        'id': 'zaif',
        'name': 'Zaif',
        'countries': 'JP',
        'rateLimit': 3000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766927-39ca2ada-5eeb-11e7-972f-1b4199518ca6.jpg',
            'api': 'https://api.zaif.jp',
            'www': 'https://zaif.jp',
            'doc': ['https://corp.zaif.jp/api-docs', 'https://corp.zaif.jp/api-docs/api_links', 'https://www.npmjs.com/package/zaif.jp', 'https://github.com/you21979/node-zaif']
        },
        'api': {
            'api': {
                'get': ['depth/{pair}', 'currencies/{pair}', 'currencies/all', 'currency_pairs/{pair}', 'currency_pairs/all', 'last_price/{pair}', 'ticker/{pair}', 'trades/{pair}']
            },
            'tapi': {
                'post': ['active_orders', 'cancel_order', 'deposit_history', 'get_id_info', 'get_info', 'get_info2', 'get_personal_info', 'trade', 'trade_history', 'withdraw', 'withdraw_history']
            },
            'ecapi': {
                'post': ['createInvoice', 'getInvoice', 'getInvoiceIdsByOrderNumber', 'cancelInvoice']
            }
        },

        fetchProducts: function fetchProducts() {
            var products,
                result,
                p,
                product,
                id,
                symbol,
                _symbol$split15,
                _symbol$split16,
                base,
                quote,
                _this66 = this;

            return Promise.resolve().then(function () {
                return _this66.apiGetCurrencyPairsAll();
            }).then(function (_resp) {
                products = _resp;
                result = [];

                for (p = 0; p < products.length; p++) {
                    product = products[p];
                    id = product['currency_pair'];
                    symbol = product['name'];
                    _symbol$split15 = symbol.split('/');
                    _symbol$split16 = _slicedToArray(_symbol$split15, 2);
                    base = _symbol$split16[0];
                    quote = _symbol$split16[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': product
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            return this.tapiPostGetInfo();
        },
        fetchOrderBook: function fetchOrderBook(product) {
            return this.apiGetDepthPair({
                'pair': this.productId(product)
            });
        },
        fetchTicker: function fetchTicker(product) {
            var ticker,
                timestamp,
                _this67 = this;

            return Promise.resolve().then(function () {
                return _this67.apiGetTickerPair({
                    'pair': _this67.productId(product)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this67.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this67.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(product) {
            return this.apiGetTradesPair({
                'pair': this.productId(product)
            });
        },
        createOrder: function createOrder(product, type, side, amount) {
            var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

            if (type == 'market') throw new Error(this.id + ' allows limit orders only');
            return this.tapiPostTrade(this.extend({
                'currency_pair': this.productId(product),
                'action': side == 'buy' ? 'bid' : 'ask',
                'amount': amount,
                'price': price
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.tapiPostCancelOrder(this.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + type;
            if (type == 'api') {
                url += '/' + this.version + '/' + this.implodeParams(path, params);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'method': path,
                    'nonce': nonce
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Key': this.apiKey,
                    'Sign': this.hmac(body, this.secret, 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //=============================================================================

    var markets = {

        '_1broker': _1broker,
        '_1btcxe': _1btcxe,
        'anxpro': anxpro,
        'bit2c': bit2c,
        'bitbay': bitbay,
        'bitcoincoid': bitcoincoid,
        'bitfinex': bitfinex,
        'bitlish': bitlish,
        'bitmarket': bitmarket,
        'bitmex': bitmex,
        'bitso': bitso,
        'bitstamp': bitstamp,
        'bittrex': bittrex,
        'btcchina': btcchina,
        'btcx': btcx,
        'bxinth': bxinth,
        'ccex': ccex,
        'cex': cex,
        'coincheck': coincheck,
        'coinsecure': coinsecure,
        'exmo': exmo,
        'fybse': fybse,
        'fybsg': fybsg,
        'gdax': gdax,
        'hitbtc': hitbtc,
        'huobi': huobi,
        'jubi': jubi,
        'kraken': kraken,
        'luno': luno,
        'okcoincny': okcoincny,
        'okcoinusd': okcoinusd,
        'poloniex': poloniex,
        'quadrigacx': quadrigacx,
        'quoine': quoine,
        'therock': therock,
        'vaultoro': vaultoro,
        'virwox': virwox,
        'yobit': yobit,
        'zaif': zaif
    };

    var defineAllMarkets = function defineAllMarkets(markets) {
        var result = {};

        var _loop2 = function _loop2(id) {
            result[id] = function (params) {
                return new Market(extend(markets[id], params));
            };
        };

        for (var id in markets) {
            _loop2(id);
        }return result;
    };

    if (isNode) module.exports = defineAllMarkets(markets);else window.ccxt = defineAllMarkets(markets);
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UyxLQUEvRCxFQXRCSjtBQXVCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQXZCSjtBQXdCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQXhCSjtBQXlCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQXpCSjtBQTBCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQTFCSjtBQTJCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQTNCSjtBQTRCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQTVCSjtBQTZCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQTdCSjtBQThCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQTlCSjtBQStCUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQS9CSjtBQWdDUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVBQXNDLFFBQVEsS0FBOUMsRUFBc0QsU0FBUyxLQUEvRCxFQWhDSjtBQWlDUix1QkFBWSxFQUFFLE1BQU0sS0FBUixFQUFnQixVQUFVLFNBQTFCLEVB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QkFBZSxJQTlCTDtBQStCVixxQkFBZSxTQS9CTDtBQWdDVixxQkFBZSxTQWhDTDtBQWlDVixvQkFBZSxRQWpDTDtBQWtDVixzQkFBZSxVQWxDTDtBQW1DVixrQkFBZSxNQW5DTDtBQW9DVixtQkFBZSxPQXBDTDtBQXFDVixvQkFBZSxRQXJDTDtBQXNDVixrQkFBZSxNQXRDTDtBQXVDVixpQkFBZSxLQXZDTDtBQXdDVixnQkFBZTtBQXhDTCxLQUFkOztBQTJDQSxRQUFJLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBVSxPQUFWLEVBQW1CO0FBQ3RDLFlBQUksU0FBUyxFQUFiOztBQURzQyxxQ0FFN0IsRUFGNkI7QUFHbEMsbUJBQU8sRUFBUCxJQUFhLFVBQVUsTUFBVixFQUFrQjtBQUMzQix1QkFBTyxJQUFJLE1BQUosQ0FBWSxPQUFRLFFBQVEsRUFBUixDQUFSLEVBQXFCLE1BQXJCLENBQVosQ0FBUDtBQUNILGFBRkQ7QUFIa0M7O0FBRXRDLGFBQUssSUFBSSxFQUFULElBQWUsT0FBZjtBQUFBLG1CQUFTLEVBQVQ7QUFBQSxTQUlBLE9BQU8sTUFBUDtBQUNILEtBUEQ7O0FBU0EsUUFBSSxNQUFKLEVBQ0ksT0FBTyxPQUFQLEdBQWlCLGlCQUFrQixPQUFsQixDQUFqQixDQURKLEtBR0ksT0FBTyxJQUFQLEdBQWMsaUJBQWtCLE9BQWxCLENBQWQ7QUFFSCxDQTNnTUQiLCJmaWxlIjoiY2N4dC5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuKGZ1bmN0aW9uICgpIHtcblxudmFyIGlzTm9kZSA9ICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJylcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aCA/IChzdHJpbmcuY2hhckF0ICgwKS50b1VwcGVyQ2FzZSAoKSArIHN0cmluZy5zbGljZSAoMSkpIDogc3RyaW5nXG59XG5cbnZhciBrZXlzb3J0ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgT2JqZWN0LmtleXMgKG9iamVjdCkuc29ydCAoKS5mb3JFYWNoIChrZXkgPT4gcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XSlcbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbnZhciBleHRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge31cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgT2JqZWN0LmtleXMgKGFyZ3VtZW50c1tpXSkuZm9yRWFjaCAoa2V5ID0+XG4gICAgICAgICAgICAgICAgKHJlc3VsdFtrZXldID0gYXJndW1lbnRzW2ldW2tleV0pKVxuICAgIHJldHVybiByZXN1bHRcbn1cblxudmFyIG9taXQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIHJlc3VsdCA9IGV4dGVuZCAob2JqZWN0KVxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICBkZWxldGUgcmVzdWx0W2FyZ3VtZW50c1tpXV1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSAoYXJndW1lbnRzW2ldKSlcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgYXJndW1lbnRzW2ldLmxlbmd0aDsgaysrKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbYXJndW1lbnRzW2ldW2tdXVxuICAgIHJldHVybiByZXN1bHRcbn1cblxudmFyIGluZGV4QnkgPSBmdW5jdGlvbiAoYXJyYXksIGtleSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcbiAgICAgICAgcmVzdWx0W2FycmF5W2ldW2tleV1dID0gYXJyYXlbaV1cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbnZhciBmbGF0ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSAoKGFjYywgY3VyKSA9PiBhY2MuY29uY2F0IChjdXIpLCBbXSlcbn1cblxudmFyIHVybGVuY29kZSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMgKG9iamVjdCkubWFwIChrZXkgPT4gXG4gICAgICAgIGVuY29kZVVSSUNvbXBvbmVudCAoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCAob2JqZWN0W2tleV0pKS5qb2luICgnJicpXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuaWYgKGlzTm9kZSkge1xuXG4gICAgY29uc3QgY3J5cHRvID0gcmVxdWlyZSAoJ2NyeXB0bycpXG4gICAgdmFyICAgZmV0Y2ggID0gcmVxdWlyZSAoJ25vZGUtZmV0Y2gnKVxuXG4gICAgdmFyIHN0cmluZ1RvQmluYXJ5ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20gKHN0cmluZywgJ2JpbmFyeScpXG4gICAgfVxuXG4gICAgdmFyIHN0cmluZ1RvQmFzZTY0ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlciAoc3RyaW5nKS50b1N0cmluZyAoJ2Jhc2U2NCcpXG4gICAgfVxuXG4gICAgdmFyIHV0ZjE2VG9CYXNlNjQgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0Jhc2U2NCAoc3RyaW5nKVxuICAgIH1cblxuICAgIHZhciBiYXNlNjRUb0JpbmFyeSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tIChzdHJpbmcsICdiYXNlNjQnKVxuICAgIH1cblxuICAgIHZhciBiYXNlNjRUb1N0cmluZyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tIChzdHJpbmcsICdiYXNlNjQnKS50b1N0cmluZyAoKVxuICAgIH1cblxuICAgIHZhciBoYXNoID0gZnVuY3Rpb24gKHJlcXVlc3QsIGhhc2ggPSAnbWQ1JywgZGlnZXN0ID0gJ2hleCcpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoIChoYXNoKS51cGRhdGUgKHJlcXVlc3QpLmRpZ2VzdCAoZGlnZXN0KVxuICAgIH1cblxuICAgIHZhciBobWFjID0gZnVuY3Rpb24gKHJlcXVlc3QsIHNlY3JldCwgaGFzaCA9ICdzaGEyNTYnLCBkaWdlc3QgPSAnaGV4Jykge1xuICAgICAgICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMgKGhhc2gsIHNlY3JldCkudXBkYXRlIChyZXF1ZXN0KS5kaWdlc3QgKGRpZ2VzdClcbiAgICB9XG5cbn0gZWxzZSB7XG5cbiAgICB2YXIgZmV0Y2ggPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zLCB2ZXJib3NlID0gZmFsc2UpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UgKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cgKHVybCwgb3B0aW9ucylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCAoKVxuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnXG5cbiAgICAgICAgICAgIHhoci5vcGVuIChtZXRob2QsIHVybCwgdHJ1ZSkgICAgICAgICAgICBcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7IFxuICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUgKHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKG1ldGhvZCwgdXJsLCB4aHIuc3RhdHVzLCB4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmhlYWRlcnMgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaGVhZGVyIGluIG9wdGlvbnMuaGVhZGVycylcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIgKGhlYWRlciwgb3B0aW9ucy5oZWFkZXJzW2hlYWRlcl0pXG5cbiAgICAgICAgICAgIHhoci5zZW5kIChvcHRpb25zLmJvZHkpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdmFyIHN0cmluZ1RvQmluYXJ5ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICByZXR1cm4gQ3J5cHRvSlMuZW5jLkxhdGluMS5wYXJzZSAoc3RyaW5nKVxuICAgIH1cblxuICAgIHZhciBzdHJpbmdUb0Jhc2U2NCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UgKHN0cmluZykudG9TdHJpbmcgKENyeXB0b0pTLmVuYy5CYXNlNjQpXG4gICAgfVxuXG4gICAgdmFyIHV0ZjE2VG9CYXNlNjQgID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICByZXR1cm4gQ3J5cHRvSlMuZW5jLlV0ZjE2LnBhcnNlIChzdHJpbmcpLnRvU3RyaW5nIChDcnlwdG9KUy5lbmMuQmFzZTY0KVxuICAgIH1cblxuICAgIHZhciBiYXNlNjRUb0JpbmFyeSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIENyeXB0b0pTLmVuYy5CYXNlNjQucGFyc2UgKHN0cmluZylcbiAgICB9XG5cbiAgICB2YXIgYmFzZTY0VG9TdHJpbmcgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBDcnlwdG9KUy5lbmMuQmFzZTY0LnBhcnNlIChzdHJpbmcpLnRvU3RyaW5nIChDcnlwdG9KUy5lbmMuVXRmOClcbiAgICB9XG5cbiAgICB2YXIgaGFzaCA9IGZ1bmN0aW9uIChyZXF1ZXN0LCBoYXNoID0gJ21kNScsIGRpZ2VzdCA9ICdoZXgnKSB7XG4gICAgICAgIHZhciBlbmNvZGluZyA9IChkaWdlc3QgPT09ICdiaW5hcnknKSA/ICdMYXRpbjEnIDogY2FwaXRhbGl6ZSAoZGlnZXN0KVxuICAgICAgICByZXR1cm4gQ3J5cHRvSlNbaGFzaC50b1VwcGVyQ2FzZSAoKV0gKHJlcXVlc3QpLnRvU3RyaW5nIChDcnlwdG9KUy5lbmNbZW5jb2RpbmddKVxuICAgIH1cblxuICAgIHZhciBobWFjID0gZnVuY3Rpb24gKHJlcXVlc3QsIHNlY3JldCwgaGFzaCA9ICdzaGEyNTYnLCBkaWdlc3QgPSAnaGV4Jykge1xuICAgICAgICB2YXIgZW5jb2RpbmcgPSAoZGlnZXN0ID09PSAnYmluYXJ5JykgPyAnTGF0aW4xJyA6IGNhcGl0YWxpemUgKGRpZ2VzdClcbiAgICAgICAgcmV0dXJuIENyeXB0b0pTWydIbWFjJyArIGhhc2gudG9VcHBlckNhc2UgKCldIChyZXF1ZXN0LCBzZWNyZXQpLnRvU3RyaW5nIChDcnlwdG9KUy5lbmNbY2FwaXRhbGl6ZSAoZW5jb2RpbmcpXSlcbiAgICB9XG59XG5cbnZhciB1cmxlbmNvZGVCYXNlNjQgPSBmdW5jdGlvbiAoYmFzZTY0c3RyaW5nKSB7XG4gICAgcmV0dXJuIGJhc2U2NHN0cmluZy5yZXBsYWNlICgvWz1dKyQvLCAnJykucmVwbGFjZSAoL1xcKy9nLCAnLScpLnJlcGxhY2UgKC9cXC8vZywgJ18nKSBcbn1cblxudmFyIGp3dCA9IGZ1bmN0aW9uIChyZXF1ZXN0LCBzZWNyZXQsIGFsZyA9ICdIUzI1NicsIGhhc2ggPSAnc2hhMjU2Jykge1xuICAgIHZhciBlbmNvZGVkSGVhZGVyID0gdXJsZW5jb2RlQmFzZTY0IChzdHJpbmdUb0Jhc2U2NCAoSlNPTi5zdHJpbmdpZnkgKHsgJ2FsZyc6IGFsZywgJ3R5cCc6ICdKV1QnIH0pKSlcbiAgICB2YXIgZW5jb2RlZERhdGEgPSB1cmxlbmNvZGVCYXNlNjQgKHN0cmluZ1RvQmFzZTY0IChKU09OLnN0cmluZ2lmeSAocmVxdWVzdCkpKVxuICAgIHZhciB0b2tlbiA9IFsgZW5jb2RlZEhlYWRlciwgZW5jb2RlZERhdGEgXS5qb2luICgnLicpXG4gICAgdmFyIHNpZ25hdHVyZSA9IHVybGVuY29kZUJhc2U2NCAodXRmMTZUb0Jhc2U2NCAoaG1hYyAodG9rZW4sIHNlY3JldCwgaGFzaCwgJ3V0ZjE2JykpKVxuICAgIHJldHVybiBbIHRva2VuLCBzaWduYXR1cmUgXS5qb2luICgnLicpXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE1hcmtldCA9IGZ1bmN0aW9uIChjb25maWcpIHtcblxuICAgIHRoaXMuaGFzaCA9IGhhc2hcbiAgICB0aGlzLmhtYWMgPSBobWFjXG4gICAgdGhpcy5qd3QgPSBqd3RcbiAgICB0aGlzLnN0cmluZ1RvQmluYXJ5ID0gc3RyaW5nVG9CaW5hcnlcbiAgICB0aGlzLnN0cmluZ1RvQmFzZTY0ID0gc3RyaW5nVG9CYXNlNjRcbiAgICB0aGlzLmJhc2U2NFRvQmluYXJ5ID0gYmFzZTY0VG9CaW5hcnlcbiAgICB0aGlzLnVybGVuY29kZSA9IHVybGVuY29kZVxuICAgIHRoaXMub21pdCA9IG9taXRcbiAgICB0aGlzLmV4dGVuZCA9IGV4dGVuZFxuICAgIHRoaXMuZmxhdHRlbiA9IGZsYXRcbiAgICB0aGlzLmluZGV4QnkgPSBpbmRleEJ5XG4gICAgdGhpcy5rZXlzb3J0ID0ga2V5c29ydFxuICAgIHRoaXMuY2FwaXRhbGl6ZSA9IGNhcGl0YWxpemVcblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoaXNOb2RlKVxuICAgICAgICAgICAgdGhpcy5ub2RlVmVyc2lvbiA9IHByb2Nlc3MudmVyc2lvbi5tYXRjaCAoL1xcZCtcXC5cXGQrLlxcZCsvKSBbMF1cblxuICAgICAgICBpZiAodGhpcy5hcGkpXG4gICAgICAgICAgICBPYmplY3Qua2V5cyAodGhpcy5hcGkpLmZvckVhY2ggKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzICh0aGlzLmFwaVt0eXBlXSkuZm9yRWFjaCAobWV0aG9kID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybHMgPSB0aGlzLmFwaVt0eXBlXVttZXRob2RdXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVybCA9IHVybHNbaV0udHJpbSAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNwbGl0UGF0aCA9IHVybC5zcGxpdCAoL1teYS16QS1aMC05XS8pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1cHBlcmNhc2VNZXRob2QgID0gbWV0aG9kLnRvVXBwZXJDYXNlICgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG93ZXJjYXNlTWV0aG9kICA9IG1ldGhvZC50b0xvd2VyQ2FzZSAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhbWVsY2FzZU1ldGhvZCAgPSBjYXBpdGFsaXplIChsb3dlcmNhc2VNZXRob2QpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FtZWxjYXNlU3VmZml4ICA9IHNwbGl0UGF0aC5tYXAgKGNhcGl0YWxpemUpLmpvaW4gKCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVuZGVyc2NvcmVTdWZmaXggPSBzcGxpdFBhdGgubWFwICh4ID0+IHgudHJpbSAoKS50b0xvd2VyQ2FzZSAoKSkuZmlsdGVyICh4ID0+IHgubGVuZ3RoID4gMCkuam9pbiAoJ18nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FtZWxjYXNlU3VmZml4LmluZGV4T2YgKGNhbWVsY2FzZU1ldGhvZCkgPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FtZWxjYXNlU3VmZml4ID0gY2FtZWxjYXNlU3VmZml4LnNsaWNlIChjYW1lbGNhc2VNZXRob2QubGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5kZXJzY29yZVN1ZmZpeC5pbmRleE9mIChsb3dlcmNhc2VNZXRob2QpID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVyc2NvcmVTdWZmaXggPSB1bmRlcnNjb3JlU3VmZml4LnNsaWNlIChsb3dlcmNhc2VNZXRob2QubGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FtZWxjYXNlICA9IHR5cGUgKyBjYW1lbGNhc2VNZXRob2QgKyBjYXBpdGFsaXplIChjYW1lbGNhc2VTdWZmaXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdW5kZXJzY29yZSA9IHR5cGUgKyAnXycgKyBsb3dlcmNhc2VNZXRob2QgKyAnXycgKyB1bmRlcnNjb3JlU3VmZml4XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmID0gKHBhcmFtcyA9PiB0aGlzLnJlcXVlc3QgKHVybCwgdHlwZSwgdXBwZXJjYXNlTWV0aG9kLCBwYXJhbXMpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2NhbWVsY2FzZV0gID0gZlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1t1bmRlcnNjb3JlXSA9IGZcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG5cbiAgICAvLyAgICAgaWYgKGlzTm9kZSlcbiAgICAvLyAgICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IGV4dGVuZCAoe1xuICAgIC8vICAgICAgICAgICAgICdVc2VyLUFnZW50JzogJ2NjeHQvMC4xLjAgKCtodHRwczovL2dpdGh1Yi5jb20va3JvaXRvci9jY3h0KSBOb2RlLmpzLycgKyB0aGlzLm5vZGVWZXJzaW9uICsgJyAoSmF2YVNjcmlwdCknXG4gICAgLy8gICAgICAgICB9LCBvcHRpb25zLmhlYWRlcnMpXG5cbiAgICAvLyAgICAgaWYgKHRoaXMudmVyYm9zZSlcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nICh0aGlzLmlkLCB1cmwsIG9wdGlvbnMpXG5cbiAgICAvLyAgICAgcmV0dXJuIChmZXRjaCAoKHRoaXMuY29ycyA/IHRoaXMuY29ycyA6ICcnKSArIHVybCwgb3B0aW9ucylcbiAgICAvLyAgICAgICAgIC50aGVuIChyZXNwb25zZSA9PiAodHlwZW9mIHJlc3BvbnNlID09PSAnc3RyaW5nJykgPyByZXNwb25zZSA6IHJlc3BvbnNlLnRleHQgKCkpXG4gICAgLy8gICAgICAgICAudGhlbiAocmVzcG9uc2UgPT4ge1xuICAgIC8vICAgICAgICAgICAgIHRyeSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlIChyZXNwb25zZSlcbiAgICAvLyAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciBjbG91ZGZsYXJlUHJvdGVjdGlvbiA9IHJlc3BvbnNlLm1hdGNoICgvY2xvdWRmbGFyZS9pKSA/ICdERG9TIHByb3RlY3Rpb24gYnkgQ2xvdWRmbGFyZScgOiAnJ1xuICAgIC8vICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJib3NlKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cgKHRoaXMuaWQsIHJlc3BvbnNlLCBjbG91ZGZsYXJlUHJvdGVjdGlvbiwgZSlcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhyb3cgZVxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH0pKVxuICAgIC8vIH1cblxuICAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAodXJsLCBtZXRob2QgPSAnR0VUJywgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIGlmIChpc05vZGUpXG4gICAgICAgICAgICBoZWFkZXJzID0gZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ1VzZXItQWdlbnQnOiAnY2N4dC8wLjEuMCAoK2h0dHBzOi8vZ2l0aHViLmNvbS9rcm9pdG9yL2NjeHQpIE5vZGUuanMvJyArIHRoaXMubm9kZVZlcnNpb24gKyAnIChKYXZhU2NyaXB0KSdcbiAgICAgICAgICAgIH0sIGhlYWRlcnMpXG5cbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7ICdtZXRob2QnOiBtZXRob2QsICdoZWFkZXJzJzogaGVhZGVycywgJ2JvZHknOiBib2R5IH1cblxuICAgICAgICBpZiAodGhpcy52ZXJib3NlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cgKHRoaXMuaWQsIHVybCwgb3B0aW9ucylcblxuICAgICAgICByZXR1cm4gKGZldGNoICgodGhpcy5jb3JzID8gdGhpcy5jb3JzIDogJycpICsgdXJsLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4gKHJlc3BvbnNlID0+ICh0eXBlb2YgcmVzcG9uc2UgPT09ICdzdHJpbmcnKSA/IHJlc3BvbnNlIDogcmVzcG9uc2UudGV4dCAoKSlcbiAgICAgICAgICAgIC50aGVuIChyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UgKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb3VkZmxhcmVQcm90ZWN0aW9uID0gcmVzcG9uc2UubWF0Y2ggKC9jbG91ZGZsYXJlL2kpID8gJ0REb1MgcHJvdGVjdGlvbiBieSBDbG91ZGZsYXJlJyA6ICcnXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcmJvc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAodGhpcy5pZCwgcmVzcG9uc2UsIGNsb3VkZmxhcmVQcm90ZWN0aW9uLCBlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgdGhpcy5sb2FkX3Byb2R1Y3RzID0gXG4gICAgdGhpcy5sb2FkUHJvZHVjdHMgPSBmdW5jdGlvbiAocmVsb2FkID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFyZWxvYWQgJiYgdGhpcy5wcm9kdWN0cylcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVzb2x2ZSAodGhpcy5wcm9kdWN0cykpXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoUHJvZHVjdHMgKCkudGhlbiAocHJvZHVjdHMgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdHMgPSBpbmRleEJ5IChwcm9kdWN0cywgJ3N5bWJvbCcpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5mZXRjaF9wcm9kdWN0cyA9IFxuICAgIHRoaXMuZmV0Y2hQcm9kdWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlICgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlICh0aGlzLnByb2R1Y3RzKSlcbiAgICB9XG5cbiAgICB0aGlzLmNvbW1vbkN1cnJlbmN5Q29kZSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkgeyBcbiAgICAgICAgcmV0dXJuIChjdXJyZW5jeSA9PT0gJ1hCVCcpID8gJ0JUQycgOiBjdXJyZW5jeVxuICAgIH1cblxuICAgIHRoaXMucHJvZHVjdCA9IGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiAoKCh0eXBlb2YgcHJvZHVjdCA9PT0gJ3N0cmluZycpICYmXG4gICAgICAgICAgICAodHlwZW9mIHRoaXMucHJvZHVjdHMgIT0gJ3VuZGVmaW5lZCcpICYmXG4gICAgICAgICAgICAodHlwZW9mIHRoaXMucHJvZHVjdHNbcHJvZHVjdF0gIT0gJ3VuZGVmaW5lZCcpKSA/IHRoaXMucHJvZHVjdHNbcHJvZHVjdF0gOiBwcm9kdWN0KSAgICAgICAgXG4gICAgfVxuXG4gICAgdGhpcy5wcm9kdWN0X2lkID0gXG4gICAgdGhpcy5wcm9kdWN0SWQgID0gZnVuY3Rpb24gKHByb2R1Y3QpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpLmlkIHx8IHByb2R1Y3RcbiAgICB9XG5cbiAgICB0aGlzLnN5bWJvbCA9IGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpLnN5bWJvbCB8fCBwcm9kdWN0XG4gICAgfVxuXG4gICAgdGhpcy5leHRyYWN0X3BhcmFtcyA9IFxuICAgIHRoaXMuZXh0cmFjdFBhcmFtcyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgdmFyIHJlID0gL3soW2EtekEtWjAtOV9dKz8pfS9nXG4gICAgICAgIHZhciBtYXRjaGVzID0gW11cbiAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlLmV4ZWMgKHN0cmluZykpXG4gICAgICAgICAgICBtYXRjaGVzLnB1c2ggKG1hdGNoWzFdKVxuICAgICAgICByZXR1cm4gbWF0Y2hlc1xuICAgIH1cblxuICAgIHRoaXMuaW1wbG9kZV9wYXJhbXMgPSBcbiAgICB0aGlzLmltcGxvZGVQYXJhbXMgPSBmdW5jdGlvbiAoc3RyaW5nLCBwYXJhbXMpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1zKVxuICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UgKCd7JyArIHByb3BlcnR5ICsgJ30nLCBwYXJhbXNbcHJvcGVydHldKVxuICAgICAgICByZXR1cm4gc3RyaW5nXG4gICAgfVxuXG4gICAgdGhpcy5idXkgPSBmdW5jdGlvbiAocHJvZHVjdCwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JkZXIgKHByb2R1Y3QsICdidXknLCBhbW91bnQsIHByaWNlLCBwYXJhbXMpXG4gICAgfVxuXG4gICAgdGhpcy5zZWxsID0gZnVuY3Rpb24gKHByb2R1Y3QsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yZGVyIChwcm9kdWN0LCAnc2VsbCcsIGFtb3VudCwgcHJpY2UsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLnRyYWRlID1cbiAgICB0aGlzLm9yZGVyID0gZnVuY3Rpb24gKHByb2R1Y3QsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCB0eXBlID0gKHR5cGVvZiBwcmljZSA9PSAndW5kZWZpbmVkJykgPyAnbWFya2V0JyA6ICdsaW1pdCdcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZV9idXlfb3JkZXIgPVxuICAgIHRoaXMuY3JlYXRlQnV5T3JkZXIgPSBmdW5jdGlvbiAocHJvZHVjdCwgdHlwZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHsgXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCAnYnV5JywgIGFtb3VudCwgcHJpY2UsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZV9zZWxsX29yZGVyID1cbiAgICB0aGlzLmNyZWF0ZVNlbGxPcmRlciA9IGZ1bmN0aW9uIChwcm9kdWN0LCB0eXBlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgJ3NlbGwnLCBhbW91bnQsIHByaWNlLCBwYXJhbXMpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGVfbGltaXRfYnV5X29yZGVyID1cbiAgICB0aGlzLmNyZWF0ZUxpbWl0QnV5T3JkZXIgPSBmdW5jdGlvbiAocHJvZHVjdCwgYW1vdW50LCBwcmljZSwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGltaXRPcmRlciAgKHByb2R1Y3QsICdidXknLCAgYW1vdW50LCBwcmljZSwgcGFyYW1zKVxuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlX2xpbWl0X3NlbGxfb3JkZXIgPSBcbiAgICB0aGlzLmNyZWF0ZUxpbWl0U2VsbE9yZGVyID0gZnVuY3Rpb24gKHByb2R1Y3QsIGFtb3VudCwgcHJpY2UsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpbWl0T3JkZXIgKHByb2R1Y3QsICdzZWxsJywgYW1vdW50LCBwcmljZSwgcGFyYW1zKVxuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlX21hcmtldF9idXlfb3JkZXIgPVxuICAgIHRoaXMuY3JlYXRlTWFya2V0QnV5T3JkZXIgPSBmdW5jdGlvbiAocHJvZHVjdCwgYW1vdW50LCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVNYXJrZXRPcmRlciAocHJvZHVjdCwgJ2J1eScsICBhbW91bnQsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZV9tYXJrZXRfc2VsbF9vcmRlciA9XG4gICAgdGhpcy5jcmVhdGVNYXJrZXRTZWxsT3JkZXIgPSBmdW5jdGlvbiAocHJvZHVjdCwgYW1vdW50LCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVNYXJrZXRPcmRlciAocHJvZHVjdCwgJ3NlbGwnLCBhbW91bnQsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZV9saW1pdF9vcmRlciA9IFxuICAgIHRoaXMuY3JlYXRlTGltaXRPcmRlciA9IGZ1bmN0aW9uIChwcm9kdWN0LCBzaWRlLCBhbW91bnQsIHByaWNlLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPcmRlciAocHJvZHVjdCwgJ2xpbWl0JywgIHNpZGUsIGFtb3VudCwgcHJpY2UsIHBhcmFtcylcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZV9tYXJrZXRfb3JkZXIgPVxuICAgIHRoaXMuY3JlYXRlTWFya2V0T3JkZXIgPSBmdW5jdGlvbiAocHJvZHVjdCwgc2lkZSwgYW1vdW50LCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPcmRlciAocHJvZHVjdCwgJ21hcmtldCcsIHNpZGUsIGFtb3VudCwgdW5kZWZpbmVkLCBwYXJhbXMpXG4gICAgfVxuXG4gICAgdGhpcy5pc284NjAxICAgICAgICA9IHRpbWVzdGFtcCA9PiBuZXcgRGF0ZSAodGltZXN0YW1wKS50b0lTT1N0cmluZyAoKVxuICAgIHRoaXMucGFyc2U4NjAxICAgICAgPSBEYXRlLnBhcnNlIFxuICAgIHRoaXMuc2Vjb25kcyAgICAgICAgPSAoKSA9PiBNYXRoLmZsb29yICh0aGlzLm1pbGxpc2Vjb25kcyAoKSAvIDEwMDApXG4gICAgdGhpcy5taWNyb3NlY29uZHMgICA9ICgpID0+IE1hdGguZmxvb3IgKHRoaXMubWlsbGlzZWNvbmRzICgpICogMTAwMClcbiAgICB0aGlzLm1pbGxpc2Vjb25kcyAgID0gRGF0ZS5ub3dcbiAgICB0aGlzLm5vbmNlICAgICAgICAgID0gdGhpcy5zZWNvbmRzXG4gICAgdGhpcy5pZCAgICAgICAgICAgICA9IHVuZGVmaW5lZFxuICAgIHRoaXMucmF0ZUxpbWl0ICAgICAgPSAyMDAwXG4gICAgdGhpcy50aW1lb3V0ICAgICAgICA9IHVuZGVmaW5lZFxuICAgIHRoaXMueXl5eW1tZGRoaG1tc3MgPSB0aW1lc3RhbXAgPT4ge1xuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlICh0aW1lc3RhbXApXG4gICAgICAgIGxldCB5eXl5ID0gZGF0ZS5nZXRVVENGdWxsWWVhciAoKVxuICAgICAgICBsZXQgTU0gPSBkYXRlLmdldFVUQ01vbnRoICgpXG4gICAgICAgIGxldCBkZCA9IGRhdGUuZ2V0VVRDRGF5ICgpXG4gICAgICAgIGxldCBoaCA9IGRhdGUuZ2V0VVRDSG91cnMgKClcbiAgICAgICAgbGV0IG1tID0gZGF0ZS5nZXRVVENNaW51dGVzICgpXG4gICAgICAgIGxldCBzcyA9IGRhdGUuZ2V0VVRDU2Vjb25kcyAoKVxuICAgICAgICBNTSA9IE1NIDwgMTAgPyAoJzAnICsgTU0pIDogTU1cbiAgICAgICAgZGQgPSBkZCA8IDEwID8gKCcwJyArIGRkKSA6IGRkXG4gICAgICAgIGhoID0gaGggPCAxMCA/ICgnMCcgKyBoaCkgOiBoaFxuICAgICAgICBtbSA9IG1tIDwgMTAgPyAoJzAnICsgbW0pIDogbW1cbiAgICAgICAgc3MgPSBzcyA8IDEwID8gKCcwJyArIHNzKSA6IHNzXG4gICAgICAgIHJldHVybiB5eXl5ICsgJy0nICsgTU0gKyAnLScgKyBkZCArICcgJyArIGhoICsgJzonICsgbW0gKyAnOicgKyBzc1xuICAgIH1cblxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIGNvbmZpZylcbiAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSBjb25maWdbcHJvcGVydHldXG5cbiAgICB0aGlzLmZldGNoX2JhbGFuY2UgICAgPSB0aGlzLmZldGNoQmFsYW5jZVxuICAgIHRoaXMuZmV0Y2hfb3JkZXJfYm9vayA9IHRoaXMuZmV0Y2hPcmRlckJvb2tcbiAgICB0aGlzLmZldGNoX3RpY2tlciAgICAgPSB0aGlzLmZldGNoVGlja2VyXG4gICAgdGhpcy5mZXRjaF90cmFkZXMgICAgID0gdGhpcy5mZXRjaFRyYWRlc1xuICBcbiAgICB0aGlzLnZlcmJvc2UgPSB0aGlzLmxvZyB8fCB0aGlzLmRlYnVnIHx8ICh0aGlzLnZlcmJvc2l0eSA9PSAxKSB8fCB0aGlzLnZlcmJvc2VcblxuICAgIHRoaXMuaW5pdCAoKVxufVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnZhciBfMWJyb2tlciA9IHtcblxuICAgICdpZCc6ICdfMWJyb2tlcicsXG4gICAgJ25hbWUnOiAnMUJyb2tlcicsXG4gICAgJ2NvdW50cmllcyc6ICdVUycsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3ZlcnNpb24nOiAndjInLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2MDIxLTQyMGJkOWZjLTVlY2ItMTFlNy04ZWQ2LTU2ZDAwODFlZmVkMi5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vMWJyb2tlci5jb20vYXBpJywgICAgICAgIFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vMWJyb2tlci5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vMWJyb2tlci5jb20vP2M9ZW4vY29udGVudC9hcGktZG9jdW1lbnRhdGlvbicsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ21hcmtldC9iYXJzJyxcbiAgICAgICAgICAgICAgICAnbWFya2V0L2NhdGVnb3JpZXMnLFxuICAgICAgICAgICAgICAgICdtYXJrZXQvZGV0YWlscycsXG4gICAgICAgICAgICAgICAgJ21hcmtldC9saXN0JyxcbiAgICAgICAgICAgICAgICAnbWFya2V0L3F1b3RlcycsXG4gICAgICAgICAgICAgICAgJ21hcmtldC90aWNrcycsXG4gICAgICAgICAgICAgICAgJ29yZGVyL2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ29yZGVyL2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgJ29yZGVyL29wZW4nLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbi9jbG9zZScsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uL2Nsb3NlX2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uL2VkaXQnLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbi9oaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24vb3BlbicsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uL3NoYXJlZC9nZXQnLFxuICAgICAgICAgICAgICAgICdzb2NpYWwvcHJvZmlsZV9zdGF0aXN0aWNzJyxcbiAgICAgICAgICAgICAgICAnc29jaWFsL3Byb2ZpbGVfdHJhZGVzJyxcbiAgICAgICAgICAgICAgICAndXNlci9iaXRjb2luX2RlcG9zaXRfYWRkcmVzcycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZGV0YWlscycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICd1c2VyL3F1b3RhX3N0YXR1cycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvdHJhbnNhY3Rpb25fbG9nJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoQ2F0ZWdvcmllcyAoKSB7XG4gICAgICAgIGxldCBjYXRlZ29yaWVzID0gYXdhaXQgdGhpcy5wcml2YXRlR2V0TWFya2V0Q2F0ZWdvcmllcyAoKTtcbiAgICAgICAgcmV0dXJuIGNhdGVnb3JpZXNbJ3Jlc3BvbnNlJ107XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IGF3YWl0IHRoaXMuZmV0Y2hDYXRlZ29yaWVzICgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gY2F0ZWdvcmllc1tjXTtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IHRoaXMucHJpdmF0ZUdldE1hcmtldExpc3QgKHsgXG4gICAgICAgICAgICAgICAgJ2NhdGVnb3J5JzogY2F0ZWdvcnkudG9Mb3dlckNhc2UgKCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcHJvZHVjdHNbJ3Jlc3BvbnNlJ10ubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzWydyZXNwb25zZSddW3BdO1xuICAgICAgICAgICAgICAgIGlmICgoY2F0ZWdvcnkgPT0gJ0ZPUkVYJykgfHwgKGNhdGVnb3J5ID09ICdDUllQVE8nKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBwcm9kdWN0WydzeW1ib2wnXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN5bWJvbCA9IHByb2R1Y3RbJ25hbWUnXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFsgYmFzZSwgcXVvdGUgXSA9IHN5bWJvbC5zcGxpdCAoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBwcm9kdWN0WydzeW1ib2wnXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN5bWJvbCA9IHByb2R1Y3RbJ3N5bWJvbCddO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHByb2R1Y3RbJ25hbWUnXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBwcm9kdWN0Wyd0eXBlJ10udG9Mb3dlckNhc2UgKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUdldFVzZXJPdmVydmlldyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUdldE1hcmtldFF1b3RlcyAoe1xuICAgICAgICAgICAgJ3N5bWJvbHMnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlR2V0TWFya2V0QmFycyAoe1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdyZXNvbHV0aW9uJzogNjAsXG4gICAgICAgICAgICAnbGltaXQnOiAxLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnbWFyZ2luJzogYW1vdW50LFxuICAgICAgICAgICAgJ2RpcmVjdGlvbic6IChzaWRlID09ICdzZWxsJykgPyAnc2hvcnQnIDogJ2xvbmcnLFxuICAgICAgICAgICAgJ2xldmVyYWdlJzogMSxcbiAgICAgICAgICAgICd0eXBlJzogc2lkZSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2xpbWl0JylcbiAgICAgICAgICAgIG9yZGVyWydwcmljZSddID0gcHJpY2U7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9yZGVyWyd0eXBlJ10gKz0gJ19tYXJrZXQnO1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlR2V0T3JkZXJDcmVhdGUgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgcGF0aCArICcucGhwJztcbiAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5leHRlbmQgKHsgJ3Rva2VuJzogKHRoaXMuYXBpS2V5IHx8IHRoaXMudG9rZW4pIH0sIHBhcmFtcyk7XG4gICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNyeXB0b2NhcGl0YWwgPSB7XG5cbiAgICAnY29tbWVudCc6ICdDcnlwdG8gQ2FwaXRhbCBBUEknLFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdzdGF0cycsXG4gICAgICAgICAgICAgICAgJ2hpc3RvcmljYWwtcHJpY2VzJyxcbiAgICAgICAgICAgICAgICAnb3JkZXItYm9vaycsXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHsgICAgICAgICAgICBcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdiYWxhbmNlcy1hbmQtaW5mbycsXG4gICAgICAgICAgICAgICAgJ29wZW4tb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAndXNlci10cmFuc2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgICdidGMtZGVwb3NpdC1hZGRyZXNzL2dldCcsXG4gICAgICAgICAgICAgICAgJ2J0Yy1kZXBvc2l0LWFkZHJlc3MvbmV3JyxcbiAgICAgICAgICAgICAgICAnZGVwb3NpdHMvZ2V0JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMvZ2V0JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL25ldycsXG4gICAgICAgICAgICAgICAgJ29yZGVycy9lZGl0JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ29yZGVycy9zdGF0dXMnLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2Fscy9uZXcnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RCYWxhbmNlc0FuZEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlckJvb2sgKHtcbiAgICAgICAgICAgICdjdXJyZW5jeSc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHVibGljR2V0U3RhdHMgKHtcbiAgICAgICAgICAgICdjdXJyZW5jeSc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsnc3RhdHMnXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydtYXgnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydtaW4nXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAodGlja2VyWydvcGVuJ10pLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3RfcHJpY2UnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogcGFyc2VGbG9hdCAodGlja2VyWydkYWlseV9jaGFuZ2UnXSksXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3RvdGFsX2J0Y190cmFkZWQnXSksXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFRyYW5zYWN0aW9ucyAoe1xuICAgICAgICAgICAgJ2N1cnJlbmN5JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdzaWRlJzogc2lkZSxcbiAgICAgICAgICAgICd0eXBlJzogdHlwZSxcbiAgICAgICAgICAgICdjdXJyZW5jeSc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdsaW1pdCcpXG4gICAgICAgICAgICBvcmRlclsnbGltaXRfcHJpY2UnXSA9IHByaWNlO1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdE9yZGVyc05ldyAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLycgKyBwYXRoO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdhcGlfa2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ25vbmNlJzogdGhpcy5ub25jZSAoKSxcbiAgICAgICAgICAgIH0sIHBhcmFtcyk7XG4gICAgICAgICAgICBxdWVyeVsnc2lnbmF0dXJlJ10gPSB0aGlzLmhtYWMgKEpTT04uc3RyaW5naWZ5IChxdWVyeSksIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSAocXVlcnkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgXzFidGN4ZSA9IGV4dGVuZCAoY3J5cHRvY2FwaXRhbCwge1xuXG4gICAgJ2lkJzogJ18xYnRjeGUnLFxuICAgICduYW1lJzogJzFCVENYRScsXG4gICAgJ2NvdW50cmllcyc6ICdQQScsIC8vIFBhbmFtYVxuICAgICdjb21tZW50JzogJ0NyeXB0byBDYXBpdGFsIEFQSScsXG4gICAgJ3VybHMnOiB7IFxuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2MDQ5LTJiMjk0NDA4LTVlY2MtMTFlNy04NWNjLWFkYWZmMDEzZGMxYS5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vMWJ0Y3hlLmNvbS9hcGknLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vMWJ0Y3hlLmNvbScsXG4gICAgICAgICdkb2MnOiAnaHR0cHM6Ly8xYnRjeGUuY29tL2FwaS1kb2NzLnBocCcsXG4gICAgfSwgICAgXG4gICAgJ3Byb2R1Y3RzJzoge1xuICAgICAgICAnQlRDL1VTRCc6IHsgJ2lkJzogJ1VTRCcsICdzeW1ib2wnOiAnQlRDL1VTRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdVU0QnLCB9LFxuICAgICAgICAnQlRDL0VVUic6IHsgJ2lkJzogJ0VVUicsICdzeW1ib2wnOiAnQlRDL0VVUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdFVVInLCB9LFxuICAgICAgICAnQlRDL0NOWSc6IHsgJ2lkJzogJ0NOWScsICdzeW1ib2wnOiAnQlRDL0NOWScsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDTlknLCB9LFxuICAgICAgICAnQlRDL1JVQic6IHsgJ2lkJzogJ1JVQicsICdzeW1ib2wnOiAnQlRDL1JVQicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdSVUInLCB9LFxuICAgICAgICAnQlRDL0NIRic6IHsgJ2lkJzogJ0NIRicsICdzeW1ib2wnOiAnQlRDL0NIRicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDSEYnLCB9LFxuICAgICAgICAnQlRDL0pQWSc6IHsgJ2lkJzogJ0pQWScsICdzeW1ib2wnOiAnQlRDL0pQWScsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdKUFknLCB9LFxuICAgICAgICAnQlRDL0dCUCc6IHsgJ2lkJzogJ0dCUCcsICdzeW1ib2wnOiAnQlRDL0dCUCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdHQlAnLCB9LFxuICAgICAgICAnQlRDL0NBRCc6IHsgJ2lkJzogJ0NBRCcsICdzeW1ib2wnOiAnQlRDL0NBRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDQUQnLCB9LFxuICAgICAgICAnQlRDL0FVRCc6IHsgJ2lkJzogJ0FVRCcsICdzeW1ib2wnOiAnQlRDL0FVRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdBVUQnLCB9LFxuICAgICAgICAnQlRDL0FFRCc6IHsgJ2lkJzogJ0FFRCcsICdzeW1ib2wnOiAnQlRDL0FFRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdBRUQnLCB9LFxuICAgICAgICAnQlRDL0JHTic6IHsgJ2lkJzogJ0JHTicsICdzeW1ib2wnOiAnQlRDL0JHTicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdCR04nLCB9LFxuICAgICAgICAnQlRDL0NaSyc6IHsgJ2lkJzogJ0NaSycsICdzeW1ib2wnOiAnQlRDL0NaSycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDWksnLCB9LFxuICAgICAgICAnQlRDL0RLSyc6IHsgJ2lkJzogJ0RLSycsICdzeW1ib2wnOiAnQlRDL0RLSycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdES0snLCB9LFxuICAgICAgICAnQlRDL0hLRCc6IHsgJ2lkJzogJ0hLRCcsICdzeW1ib2wnOiAnQlRDL0hLRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdIS0QnLCB9LFxuICAgICAgICAnQlRDL0hSSyc6IHsgJ2lkJzogJ0hSSycsICdzeW1ib2wnOiAnQlRDL0hSSycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdIUksnLCB9LFxuICAgICAgICAnQlRDL0hVRic6IHsgJ2lkJzogJ0hVRicsICdzeW1ib2wnOiAnQlRDL0hVRicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdIVUYnLCB9LFxuICAgICAgICAnQlRDL0lMUyc6IHsgJ2lkJzogJ0lMUycsICdzeW1ib2wnOiAnQlRDL0lMUycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdJTFMnLCB9LFxuICAgICAgICAnQlRDL0lOUic6IHsgJ2lkJzogJ0lOUicsICdzeW1ib2wnOiAnQlRDL0lOUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdJTlInLCB9LFxuICAgICAgICAnQlRDL01VUic6IHsgJ2lkJzogJ01VUicsICdzeW1ib2wnOiAnQlRDL01VUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdNVVInLCB9LFxuICAgICAgICAnQlRDL01YTic6IHsgJ2lkJzogJ01YTicsICdzeW1ib2wnOiAnQlRDL01YTicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdNWE4nLCB9LFxuICAgICAgICAnQlRDL05PSyc6IHsgJ2lkJzogJ05PSycsICdzeW1ib2wnOiAnQlRDL05PSycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdOT0snLCB9LFxuICAgICAgICAnQlRDL05aRCc6IHsgJ2lkJzogJ05aRCcsICdzeW1ib2wnOiAnQlRDL05aRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdOWkQnLCB9LFxuICAgICAgICAnQlRDL1BMTic6IHsgJ2lkJzogJ1BMTicsICdzeW1ib2wnOiAnQlRDL1BMTicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdQTE4nLCB9LFxuICAgICAgICAnQlRDL1JPTic6IHsgJ2lkJzogJ1JPTicsICdzeW1ib2wnOiAnQlRDL1JPTicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdST04nLCB9LFxuICAgICAgICAnQlRDL1NFSyc6IHsgJ2lkJzogJ1NFSycsICdzeW1ib2wnOiAnQlRDL1NFSycsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdTRUsnLCB9LFxuICAgICAgICAnQlRDL1NHRCc6IHsgJ2lkJzogJ1NHRCcsICdzeW1ib2wnOiAnQlRDL1NHRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdTR0QnLCB9LFxuICAgICAgICAnQlRDL1RIQic6IHsgJ2lkJzogJ1RIQicsICdzeW1ib2wnOiAnQlRDL1RIQicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdUSEInLCB9LFxuICAgICAgICAnQlRDL1RSWSc6IHsgJ2lkJzogJ1RSWScsICdzeW1ib2wnOiAnQlRDL1RSWScsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdUUlknLCB9LFxuICAgICAgICAnQlRDL1pBUic6IHsgJ2lkJzogJ1pBUicsICdzeW1ib2wnOiAnQlRDL1pBUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdaQVInLCB9LFxuICAgIH0sXG59KVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhbnhwcm8gPSB7XG5cbiAgICAnaWQnOiAnYW54cHJvJyxcbiAgICAnbmFtZSc6ICdBTlhQcm8nLFxuICAgICdjb3VudHJpZXMnOiBbICdKUCcsICdTRycsICdISycsICdOWicsIF0sXG4gICAgJ3ZlcnNpb24nOiAnMicsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjU5ODMtZmQ4NTk1ZGEtNWVjOS0xMWU3LTgyZTMtYWRiM2FiOGMyNjEyLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9hbnhwcm8uY29tL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9hbnhwcm8uY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2FueHByby5jb20vcGFnZXMvYXBpJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICd7Y3VycmVuY3lfcGFpcn0vbW9uZXkvdGlja2VyJyxcbiAgICAgICAgICAgICAgICAne2N1cnJlbmN5X3BhaXJ9L21vbmV5L2RlcHRoL2Z1bGwnLFxuICAgICAgICAgICAgICAgICd7Y3VycmVuY3lfcGFpcn0vbW9uZXkvdHJhZGUvZmV0Y2gnLCAvLyBkaXNhYmxlZCBieSBBTlhQcm9cbiAgICAgICAgICAgIF0sICAgIFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICd7Y3VycmVuY3lfcGFpcn0vbW9uZXkvb3JkZXIvYWRkJyxcbiAgICAgICAgICAgICAgICAne2N1cnJlbmN5X3BhaXJ9L21vbmV5L29yZGVyL2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ3tjdXJyZW5jeV9wYWlyfS9tb25leS9vcmRlci9xdW90ZScsXG4gICAgICAgICAgICAgICAgJ3tjdXJyZW5jeV9wYWlyfS9tb25leS9vcmRlci9yZXN1bHQnLFxuICAgICAgICAgICAgICAgICd7Y3VycmVuY3lfcGFpcn0vbW9uZXkvb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnbW9uZXkve2N1cnJlbmN5fS9hZGRyZXNzJyxcbiAgICAgICAgICAgICAgICAnbW9uZXkve2N1cnJlbmN5fS9zZW5kX3NpbXBsZScsXG4gICAgICAgICAgICAgICAgJ21vbmV5L2luZm8nLFxuICAgICAgICAgICAgICAgICdtb25leS90cmFkZS9saXN0JyxcbiAgICAgICAgICAgICAgICAnbW9uZXkvd2FsbGV0L2hpc3RvcnknLFxuICAgICAgICAgICAgXSwgICAgXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnQlRDVVNEJywgJ3N5bWJvbCc6ICdCVEMvVVNEJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1VTRCcgfSxcbiAgICAgICAgJ0JUQy9IS0QnOiB7ICdpZCc6ICdCVENIS0QnLCAnc3ltYm9sJzogJ0JUQy9IS0QnLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnSEtEJyB9LFxuICAgICAgICAnQlRDL0VVUic6IHsgJ2lkJzogJ0JUQ0VVUicsICdzeW1ib2wnOiAnQlRDL0VVUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdFVVInIH0sXG4gICAgICAgICdCVEMvQ0FEJzogeyAnaWQnOiAnQlRDQ0FEJywgJ3N5bWJvbCc6ICdCVEMvQ0FEJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ0NBRCcgfSxcbiAgICAgICAgJ0JUQy9BVUQnOiB7ICdpZCc6ICdCVENBVUQnLCAnc3ltYm9sJzogJ0JUQy9BVUQnLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnQVVEJyB9LFxuICAgICAgICAnQlRDL1NHRCc6IHsgJ2lkJzogJ0JUQ1NHRCcsICdzeW1ib2wnOiAnQlRDL1NHRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdTR0QnIH0sXG4gICAgICAgICdCVEMvSlBZJzogeyAnaWQnOiAnQlRDSlBZJywgJ3N5bWJvbCc6ICdCVEMvSlBZJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ0pQWScgfSxcbiAgICAgICAgJ0JUQy9HQlAnOiB7ICdpZCc6ICdCVENHQlAnLCAnc3ltYm9sJzogJ0JUQy9HQlAnLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnR0JQJyB9LFxuICAgICAgICAnQlRDL05aRCc6IHsgJ2lkJzogJ0JUQ05aRCcsICdzeW1ib2wnOiAnQlRDL05aRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdOWkQnIH0sXG4gICAgICAgICdMVEMvQlRDJzogeyAnaWQnOiAnTFRDQlRDJywgJ3N5bWJvbCc6ICdMVEMvQlRDJywgJ2Jhc2UnOiAnTFRDJywgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ0RPR0UvQlRDJzogeyAnaWQnOiAnRE9HRUJUQycsICdzeW1ib2wnOiAnRE9HRS9CVEMnLCAnYmFzZSc6ICdET0dFJywgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ1NUUi9CVEMnOiB7ICdpZCc6ICdTVFJCVEMnLCAnc3ltYm9sJzogJ1NUUi9CVEMnLCAnYmFzZSc6ICdTVFInLCAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnWFJQL0JUQyc6IHsgJ2lkJzogJ1hSUEJUQycsICdzeW1ib2wnOiAnWFJQL0JUQycsICdiYXNlJzogJ1hSUCcsICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0TW9uZXlJbmZvICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRDdXJyZW5jeVBhaXJNb25leURlcHRoRnVsbCAoe1xuICAgICAgICAgICAgJ2N1cnJlbmN5X3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnB1YmxpY0dldEN1cnJlbmN5UGFpck1vbmV5VGlja2VyICh7XG4gICAgICAgICAgICAnY3VycmVuY3lfcGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsnZGF0YSddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyc2VJbnQgKHRpY2tlclsnZGF0YVVwZGF0ZVRpbWUnXSAvIDEwMDApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoaWdoJ11bJ3ZhbHVlJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93J11bJ3ZhbHVlJ10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYnV5J11bJ3ZhbHVlJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnc2VsbCddKVsndmFsdWUnXSxcbiAgICAgICAgICAgICd2d2FwJzogcGFyc2VGbG9hdCAodGlja2VyWyd2d2FwJ11bJ3ZhbHVlJ10pLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdCddWyd2YWx1ZSddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogcGFyc2VGbG9hdCAodGlja2VyWydhdmcnXVsndmFsdWUnXSksXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sJ11bJ3ZhbHVlJ10pLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRDdXJyZW5jeVBhaXJNb25leVRyYWRlRmV0Y2ggKHtcbiAgICAgICAgICAgICdjdXJyZW5jeV9wYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdjdXJyZW5jeV9wYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ2Ftb3VudF9pbnQnOiBhbW91bnQsXG4gICAgICAgICAgICAndHlwZSc6IHNpZGUsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdsaW1pdCcpXG4gICAgICAgICAgICBvcmRlclsncHJpY2VfaW50J10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RDdXJyZW5jeVBhaXJPcmRlckFkZCAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgbm9uY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZHMgKCk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgcmVxdWVzdDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHRoaXMuZXh0ZW5kICh7ICdub25jZSc6IG5vbmNlIH0sIHF1ZXJ5KSk7XG4gICAgICAgICAgICBsZXQgc2VjcmV0ID0gdGhpcy5iYXNlNjRUb0JpbmFyeSAodGhpcy5zZWNyZXQpO1xuICAgICAgICAgICAgbGV0IGF1dGggPSByZXF1ZXN0ICsgXCJcXDBcIiArIGJvZHk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnUmVzdC1LZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnUmVzdC1TaWduJzogdGhpcy5obWFjIChhdXRoLCBzZWNyZXQsICdzaGE1MTInLCAnYmFzZTY0JyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYml0MmMgPSB7XG5cbiAgICAnaWQnOiAnYml0MmMnLFxuICAgICduYW1lJzogJ0JpdDJDJyxcbiAgICAnY291bnRyaWVzJzogJ0lMJywgLy8gSXNyYWVsXG4gICAgJ3JhdGVMaW1pdCc6IDMwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjYxMTktMzU5MzIyMGUtNWVjZS0xMWU3LThiM2EtNWEwNDFmNmJjYzNmLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cuYml0MmMuY28uaWwnLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LmJpdDJjLmNvLmlsJyxcbiAgICAgICAgJ2RvYyc6IFtcbiAgICAgICAgICAgICdodHRwczovL3d3dy5iaXQyYy5jby5pbC9ob21lL2FwaScsXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL09mZXJFL2JpdDJjJyxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdFeGNoYW5nZXMve3BhaXJ9L1RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ0V4Y2hhbmdlcy97cGFpcn0vb3JkZXJib29rJyxcbiAgICAgICAgICAgICAgICAnRXhjaGFuZ2VzL3twYWlyfS90cmFkZXMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnQWNjb3VudC9CYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnQWNjb3VudC9CYWxhbmNlL3YyJyxcbiAgICAgICAgICAgICAgICAnTWVyY2hhbnQvQ3JlYXRlQ2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgICdPcmRlci9BY2NvdW50SGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ09yZGVyL0FkZENvaW5GdW5kc1JlcXVlc3QnLFxuICAgICAgICAgICAgICAgICdPcmRlci9BZGRGdW5kJyxcbiAgICAgICAgICAgICAgICAnT3JkZXIvQWRkT3JkZXInLFxuICAgICAgICAgICAgICAgICdPcmRlci9BZGRPcmRlck1hcmtldFByaWNlQnV5JyxcbiAgICAgICAgICAgICAgICAnT3JkZXIvQWRkT3JkZXJNYXJrZXRQcmljZVNlbGwnLFxuICAgICAgICAgICAgICAgICdPcmRlci9DYW5jZWxPcmRlcicsXG4gICAgICAgICAgICAgICAgJ09yZGVyL015T3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnUGF5bWVudC9HZXRNeUlkJyxcbiAgICAgICAgICAgICAgICAnUGF5bWVudC9TZW5kJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvTklTJzogeyAnaWQnOiAnQnRjTmlzJywgJ3N5bWJvbCc6ICdCVEMvTklTJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ05JUycgfSxcbiAgICAgICAgJ0xUQy9CVEMnOiB7ICdpZCc6ICdMdGNCdGMnLCAnc3ltYm9sJzogJ0xUQy9CVEMnLCAnYmFzZSc6ICdMVEMnLCAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnTFRDL05JUyc6IHsgJ2lkJzogJ0x0Y05pcycsICdzeW1ib2wnOiAnTFRDL05JUycsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdOSVMnIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0QWNjb3VudEJhbGFuY2VWMiAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0RXhjaGFuZ2VzUGFpck9yZGVyYm9vayAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRFeGNoYW5nZXNQYWlyVGlja2VyICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2wnXSksXG4gICAgICAgICAgICAnYmlkJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Fzayc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGwnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXYnXSksXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYSddKSxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0RXhjaGFuZ2VzUGFpclRyYWRlcyAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IG1ldGhvZCA9ICdwcml2YXRlUG9zdE9yZGVyQWRkT3JkZXInO1xuICAgICAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgICAgICAnQW1vdW50JzogYW1vdW50LFxuICAgICAgICAgICAgJ1BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdtYXJrZXQnKSB7XG4gICAgICAgICAgICBtZXRob2QgKz0gJ01hcmtldFByaWNlJyArIHRoaXMuY2FwaXRhbGl6ZSAoc2lkZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmRlclsnUHJpY2UnXSA9IHByaWNlO1xuICAgICAgICAgICAgb3JkZXJbJ1RvdGFsJ10gPSBhbW91bnQgKiBwcmljZTtcbiAgICAgICAgICAgIG9yZGVyWydJc0JpZCddID0gKHNpZGUgPT0gJ2J1eScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZF0gKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgdXJsICs9ICcuanNvbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5leHRlbmQgKHsgJ25vbmNlJzogbm9uY2UgfSwgcGFyYW1zKTtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgJ2tleSc6IHRoaXMuYXBpS2V5LFxuICAgICAgICAgICAgICAgICdzaWduJzogdGhpcy5obWFjIChib2R5LCB0aGlzLnNlY3JldCwgJ3NoYTUxMicsICdiYXNlNjQnKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBiaXRiYXkgPSB7XG5cbiAgICAnaWQnOiAnYml0YmF5JyxcbiAgICAnbmFtZSc6ICdCaXRCYXknLFxuICAgICdjb3VudHJpZXMnOiBbICdQTCcsICdFVScsIF0sIC8vIFBvbGFuZFxuICAgICdyYXRlTGltaXQnOiAxMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2MTMyLTk3OGE3YmQ4LTVlY2UtMTFlNy05NTQwLWJjOTZkMWU5YmJiOC5qcGcnLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vYml0YmF5Lm5ldCcsXG4gICAgICAgICdhcGknOiB7XG4gICAgICAgICAgICAncHVibGljJzogJ2h0dHBzOi8vYml0YmF5Lm5ldC9BUEkvUHVibGljJyxcbiAgICAgICAgICAgICdwcml2YXRlJzogJ2h0dHBzOi8vYml0YmF5Lm5ldC9BUEkvVHJhZGluZy90cmFkaW5nQXBpLnBocCcsXG4gICAgICAgIH0sXG4gICAgICAgICdkb2MnOiBbXG4gICAgICAgICAgICAnaHR0cHM6Ly9iaXRiYXkubmV0L3B1YmxpYy1hcGknLFxuICAgICAgICAgICAgJ2h0dHBzOi8vYml0YmF5Lm5ldC9hY2NvdW50L3RhYi1hcGknLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9CaXRCYXlOZXQvQVBJJyxcbiAgICAgICAgXSwgXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAne2lkfS9hbGwnLFxuICAgICAgICAgICAgICAgICd7aWR9L21hcmtldCcsXG4gICAgICAgICAgICAgICAgJ3tpZH0vb3JkZXJib29rJyxcbiAgICAgICAgICAgICAgICAne2lkfS90aWNrZXInLFxuICAgICAgICAgICAgICAgICd7aWR9L3RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdpbmZvJyxcbiAgICAgICAgICAgICAgICAndHJhZGUnLFxuICAgICAgICAgICAgICAgICdjYW5jZWwnLFxuICAgICAgICAgICAgICAgICdvcmRlcmJvb2snLFxuICAgICAgICAgICAgICAgICdvcmRlcnMnLFxuICAgICAgICAgICAgICAgICd0cmFuc2ZlcicsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgICAgICAnaGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgJ3Byb2R1Y3RzJzogeyAgXG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnQlRDVVNEJywgJ3N5bWJvbCc6ICdCVEMvVVNEJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1VTRCcgfSxcbiAgICAgICAgJ0JUQy9FVVInOiB7ICdpZCc6ICdCVENFVVInLCAnc3ltYm9sJzogJ0JUQy9FVVInLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnRVVSJyB9LFxuICAgICAgICAnQlRDL1BMTic6IHsgJ2lkJzogJ0JUQ1BMTicsICdzeW1ib2wnOiAnQlRDL1BMTicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdQTE4nIH0sXG4gICAgICAgICdMVEMvVVNEJzogeyAnaWQnOiAnTFRDVVNEJywgJ3N5bWJvbCc6ICdMVEMvVVNEJywgJ2Jhc2UnOiAnTFRDJywgJ3F1b3RlJzogJ1VTRCcgfSxcbiAgICAgICAgJ0xUQy9FVVInOiB7ICdpZCc6ICdMVENFVVInLCAnc3ltYm9sJzogJ0xUQy9FVVInLCAnYmFzZSc6ICdMVEMnLCAncXVvdGUnOiAnRVVSJyB9LFxuICAgICAgICAnTFRDL1BMTic6IHsgJ2lkJzogJ0xUQ1BMTicsICdzeW1ib2wnOiAnTFRDL1BMTicsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdQTE4nIH0sXG4gICAgICAgICdMVEMvQlRDJzogeyAnaWQnOiAnTFRDQlRDJywgJ3N5bWJvbCc6ICdMVEMvQlRDJywgJ2Jhc2UnOiAnTFRDJywgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ0VUSC9VU0QnOiB7ICdpZCc6ICdFVEhVU0QnLCAnc3ltYm9sJzogJ0VUSC9VU0QnLCAnYmFzZSc6ICdFVEgnLCAncXVvdGUnOiAnVVNEJyB9LFxuICAgICAgICAnRVRIL0VVUic6IHsgJ2lkJzogJ0VUSEVVUicsICdzeW1ib2wnOiAnRVRIL0VVUicsICdiYXNlJzogJ0VUSCcsICdxdW90ZSc6ICdFVVInIH0sXG4gICAgICAgICdFVEgvUExOJzogeyAnaWQnOiAnRVRIUExOJywgJ3N5bWJvbCc6ICdFVEgvUExOJywgJ2Jhc2UnOiAnRVRIJywgJ3F1b3RlJzogJ1BMTicgfSxcbiAgICAgICAgJ0VUSC9CVEMnOiB7ICdpZCc6ICdFVEhCVEMnLCAnc3ltYm9sJzogJ0VUSC9CVEMnLCAnYmFzZSc6ICdFVEgnLCAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnTFNLL1VTRCc6IHsgJ2lkJzogJ0xTS1VTRCcsICdzeW1ib2wnOiAnTFNLL1VTRCcsICdiYXNlJzogJ0xTSycsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgICAgICdMU0svRVVSJzogeyAnaWQnOiAnTFNLRVVSJywgJ3N5bWJvbCc6ICdMU0svRVVSJywgJ2Jhc2UnOiAnTFNLJywgJ3F1b3RlJzogJ0VVUicgfSxcbiAgICAgICAgJ0xTSy9QTE4nOiB7ICdpZCc6ICdMU0tQTE4nLCAnc3ltYm9sJzogJ0xTSy9QTE4nLCAnYmFzZSc6ICdMU0snLCAncXVvdGUnOiAnUExOJyB9LFxuICAgICAgICAnTFNLL0JUQyc6IHsgJ2lkJzogJ0xTS0JUQycsICdzeW1ib2wnOiAnTFNLL0JUQycsICdiYXNlJzogJ0xTSycsICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldElkT3JkZXJib29rICh7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRJZFRpY2tlciAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydtYXgnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydtaW4nXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHBhcnNlRmxvYXQgKHRpY2tlclsndndhcCddKSxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXZlcmFnZSddKSxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldElkVHJhZGVzICh7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdFRyYWRlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgJ3R5cGUnOiBzaWRlLFxuICAgICAgICAgICAgJ2N1cnJlbmN5JzogcFsnYmFzZSddLFxuICAgICAgICAgICAgJ2Ftb3VudCc6IGFtb3VudCxcbiAgICAgICAgICAgICdwYXltZW50X2N1cnJlbmN5JzogcFsncXVvdGUnXSxcbiAgICAgICAgICAgICdyYXRlJzogcHJpY2UsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXVt0eXBlXTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcykgKyAnLmpzb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdtZXRob2QnOiBwYXRoLFxuICAgICAgICAgICAgICAgICdtb21lbnQnOiB0aGlzLm5vbmNlICgpLFxuICAgICAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAnQVBJLUtleSc6IHRoaXMuYXBpS2V5LFxuICAgICAgICAgICAgICAgICdBUEktSGFzaCc6IHRoaXMuaG1hYyAoYm9keSwgdGhpcy5zZWNyZXQsICdzaGE1MTInKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBiaXRjb2luY29pZCA9IHtcblxuICAgICdpZCc6ICdiaXRjb2luY29pZCcsXG4gICAgJ25hbWUnOiAnQml0Y29pbi5jby5pZCcsXG4gICAgJ2NvdW50cmllcyc6ICdJRCcsIC8vIEluZG9uZXNpYVxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2MTM4LTA0M2M3Nzg2LTVlY2YtMTFlNy04ODJiLTgwOWMxNGYzOGI1My5qcGcnLFxuICAgICAgICAnYXBpJzoge1xuICAgICAgICAgICAgJ3B1YmxpYyc6ICdodHRwczovL3ZpcC5iaXRjb2luLmNvLmlkL2FwaScsXG4gICAgICAgICAgICAncHJpdmF0ZSc6ICdodHRwczovL3ZpcC5iaXRjb2luLmNvLmlkL3RhcGknLFxuICAgICAgICB9LFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LmJpdGNvaW4uY28uaWQnLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vdmlwLmJpdGNvaW4uY28uaWQvdHJhZGVfYXBpJyxcbiAgICAgICAgICAgICdodHRwczovL3ZpcC5iaXRjb2luLmNvLmlkL2Rvd25sb2Fkcy9CSVRDT0lOQ09JRC1BUEktRE9DVU1FTlRBVElPTi5wZGYnLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ3twYWlyfS90aWNrZXInLFxuICAgICAgICAgICAgICAgICd7cGFpcn0vdHJhZGVzJyxcbiAgICAgICAgICAgICAgICAne3BhaXJ9L2RlcHRoJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2dldEluZm8nLFxuICAgICAgICAgICAgICAgICd0cmFuc0hpc3RvcnknLFxuICAgICAgICAgICAgICAgICd0cmFkZScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlSGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ29wZW5PcmRlcnMnLFxuICAgICAgICAgICAgICAgICdjYW5jZWxPcmRlcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgJ3Byb2R1Y3RzJzoge1xuICAgICAgICAnQlRDL0lEUic6ICB7ICdpZCc6ICdidGNfaWRyJywgJ3N5bWJvbCc6ICdCVEMvSURSJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ0lEUicsICdiYXNlSWQnOiAnYnRjJywgJ3F1b3RlSWQnOiAnaWRyJyB9LFxuICAgICAgICAnQlRTL0JUQyc6ICB7ICdpZCc6ICdidHNfYnRjJywgJ3N5bWJvbCc6ICdCVFMvQlRDJywgJ2Jhc2UnOiAnQlRTJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnYnRzJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnREFTSC9CVEMnOiB7ICdpZCc6ICdkcmtfYnRjJywgJ3N5bWJvbCc6ICdEQVNIL0JUQycsICdiYXNlJzogJ0RBU0gnLCAncXVvdGUnOiAnQlRDJywgJ2Jhc2VJZCc6ICdkcmsnLCAncXVvdGVJZCc6ICdidGMnIH0sXG4gICAgICAgICdET0dFL0JUQyc6IHsgJ2lkJzogJ2RvZ2VfYnRjJywgJ3N5bWJvbCc6ICdET0dFL0JUQycsICdiYXNlJzogJ0RPR0UnLCAncXVvdGUnOiAnQlRDJywgJ2Jhc2VJZCc6ICdkb2dlJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnRVRIL0JUQyc6ICB7ICdpZCc6ICdldGhfYnRjJywgJ3N5bWJvbCc6ICdFVEgvQlRDJywgJ2Jhc2UnOiAnRVRIJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnZXRoJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnTFRDL0JUQyc6ICB7ICdpZCc6ICdsdGNfYnRjJywgJ3N5bWJvbCc6ICdMVEMvQlRDJywgJ2Jhc2UnOiAnTFRDJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnbHRjJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnTlhUL0JUQyc6ICB7ICdpZCc6ICdueHRfYnRjJywgJ3N5bWJvbCc6ICdOWFQvQlRDJywgJ2Jhc2UnOiAnTlhUJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnbnh0JywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnU1RSL0JUQyc6ICB7ICdpZCc6ICdzdHJfYnRjJywgJ3N5bWJvbCc6ICdTVFIvQlRDJywgJ2Jhc2UnOiAnU1RSJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnc3RyJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnTkVNL0JUQyc6ICB7ICdpZCc6ICduZW1fYnRjJywgJ3N5bWJvbCc6ICdORU0vQlRDJywgJ2Jhc2UnOiAnTkVNJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAnbmVtJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgICAgICAnWFJQL0JUQyc6ICB7ICdpZCc6ICd4cnBfYnRjJywgJ3N5bWJvbCc6ICdYUlAvQlRDJywgJ2Jhc2UnOiAnWFJQJywgJ3F1b3RlJzogJ0JUQycsICdiYXNlSWQnOiAneHJwJywgJ3F1b3RlSWQnOiAnYnRjJyB9LFxuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEdldEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFBhaXJEZXB0aCAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgcGFpciA9IHRoaXMucHJvZHVjdCAocHJvZHVjdCk7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHVibGljR2V0UGFpclRpY2tlciAoe1xuICAgICAgICAgICAgJ3BhaXInOiBwYWlyWydpZCddLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpY2tlciA9IHJlc3BvbnNlWyd0aWNrZXInXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHBhcnNlRmxvYXQgKHRpY2tlclsnc2VydmVyX3RpbWUnXSkgKiAxMDAwO1xuICAgICAgICBsZXQgYmFzZVZvbHVtZSA9ICd2b2xfJyArIHBhaXJbJ2Jhc2VJZCddLnRvTG93ZXJDYXNlICgpO1xuICAgICAgICBsZXQgcXVvdGVWb2x1bWUgPSAndm9sXycgKyBwYWlyWydxdW90ZUlkJ10udG9Mb3dlckNhc2UgKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydidXknXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydzZWxsJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3Z3YXAnXSksXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2F2ZXJhZ2UnXSksXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlcltiYXNlVm9sdW1lXSksXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbcXVvdGVWb2x1bWVdKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRQYWlyVHJhZGVzICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBsZXQgcCA9IHRoaXMucHJvZHVjdCAocHJvZHVjdCk7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdwYWlyJzogcFsnaWQnXSxcbiAgICAgICAgICAgICd0eXBlJzogc2lkZSxcbiAgICAgICAgICAgICdwcmljZSc6IHByaWNlLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgYmFzZSA9IHBbJ2Jhc2UnXS50b0xvd2VyQ2FzZSAoKTtcbiAgICAgICAgb3JkZXJbYmFzZV0gPSBhbW91bnQ7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0VHJhZGUgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddW3R5cGVdO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgdXJsICs9ICcvJyArIHRoaXMuaW1wbG9kZVBhcmFtcyAocGF0aCwgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLnVybGVuY29kZSAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICAgICAnbWV0aG9kJzogcGF0aCxcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiB0aGlzLm5vbmNlICgpLFxuICAgICAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAnS2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ1NpZ24nOiB0aGlzLmhtYWMgKGJvZHksIHRoaXMuc2VjcmV0LCAnc2hhNTEyJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYml0ZmluZXggPSB7XG5cbiAgICAnaWQnOiAnYml0ZmluZXgnLFxuICAgICduYW1lJzogJ0JpdGZpbmV4JyxcbiAgICAnY291bnRyaWVzJzogJ1VTJyxcbiAgICAndmVyc2lvbic6ICd2MScsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjYyNDQtZTMyOGE1MGMtNWVkMi0xMWU3LTk0N2ItMDQxNDE2NTc5YmIzLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9hcGkuYml0ZmluZXguY29tJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy5iaXRmaW5leC5jb20nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vYml0ZmluZXgucmVhZG1lLmlvL3YxL2RvY3MnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vYml0ZmluZXgucmVhZG1lLmlvL3YyL2RvY3MnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9iaXRmaW5leGNvbS9iaXRmaW5leC1hcGktbm9kZScsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYm9vay97c3ltYm9sfScsXG4gICAgICAgICAgICAgICAgJ2NhbmRsZXMve3N5bWJvbH0nLFxuICAgICAgICAgICAgICAgICdsZW5kYm9vay97Y3VycmVuY3l9JyxcbiAgICAgICAgICAgICAgICAnbGVuZHMve2N1cnJlbmN5fScsXG4gICAgICAgICAgICAgICAgJ3B1YnRpY2tlci97c3ltYm9sfScsXG4gICAgICAgICAgICAgICAgJ3N0YXRzL3tzeW1ib2x9JyxcbiAgICAgICAgICAgICAgICAnc3ltYm9scycsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbHNfZGV0YWlscycsXG4gICAgICAgICAgICAgICAgJ3RvZGF5JyxcbiAgICAgICAgICAgICAgICAndHJhZGVzL3tzeW1ib2x9JywgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdhY2NvdW50X2luZm9zJyxcbiAgICAgICAgICAgICAgICAnYmFsYW5jZXMnLFxuICAgICAgICAgICAgICAgICdiYXNrZXRfbWFuYWdlJyxcbiAgICAgICAgICAgICAgICAnY3JlZGl0cycsXG4gICAgICAgICAgICAgICAgJ2RlcG9zaXQvbmV3JyxcbiAgICAgICAgICAgICAgICAnZnVuZGluZy9jbG9zZScsXG4gICAgICAgICAgICAgICAgJ2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICdoaXN0b3J5L21vdmVtZW50cycsXG4gICAgICAgICAgICAgICAgJ2tleV9pbmZvJyxcbiAgICAgICAgICAgICAgICAnbWFyZ2luX2luZm9zJyxcbiAgICAgICAgICAgICAgICAnbXl0cmFkZXMnLFxuICAgICAgICAgICAgICAgICdvZmZlci9jYW5jZWwnLFxuICAgICAgICAgICAgICAgICdvZmZlci9uZXcnLFxuICAgICAgICAgICAgICAgICdvZmZlci9zdGF0dXMnLFxuICAgICAgICAgICAgICAgICdvZmZlcnMnLFxuICAgICAgICAgICAgICAgICdvcmRlci9jYW5jZWwnLFxuICAgICAgICAgICAgICAgICdvcmRlci9jYW5jZWwvYWxsJyxcbiAgICAgICAgICAgICAgICAnb3JkZXIvY2FuY2VsL211bHRpJyxcbiAgICAgICAgICAgICAgICAnb3JkZXIvY2FuY2VsL3JlcGxhY2UnLFxuICAgICAgICAgICAgICAgICdvcmRlci9uZXcnLFxuICAgICAgICAgICAgICAgICdvcmRlci9uZXcvbXVsdGknLFxuICAgICAgICAgICAgICAgICdvcmRlci9zdGF0dXMnLFxuICAgICAgICAgICAgICAgICdvcmRlcnMnLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbi9jbGFpbScsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9ucycsXG4gICAgICAgICAgICAgICAgJ3N1bW1hcnknLFxuICAgICAgICAgICAgICAgICd0YWtlbl9mdW5kcycsXG4gICAgICAgICAgICAgICAgJ3RvdGFsX3Rha2VuX2Z1bmRzJyxcbiAgICAgICAgICAgICAgICAndHJhbnNmZXInLFxuICAgICAgICAgICAgICAgICd1bnVzZWRfdGFrZW5fZnVuZHMnLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhdycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRTeW1ib2xzRGV0YWlscyAoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb2R1Y3RzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzW3BdO1xuICAgICAgICAgICAgbGV0IGlkID0gcHJvZHVjdFsncGFpciddLnRvVXBwZXJDYXNlICgpO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSBpZC5zbGljZSAoMCwgMyk7XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBpZC5zbGljZSAoMywgNik7XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gYmFzZSArICcvJyArIHF1b3RlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEJhbGFuY2VzICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRCb29rU3ltYm9sICh7IFxuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCB0aWNrZXIgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFB1YnRpY2tlclN5bWJvbCAoe1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSBwYXJzZUZsb2F0ICh0aWNrZXJbJ3RpbWVzdGFtcCddKSAqIDEwMDA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3RfcHJpY2UnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbWlkJ10pLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZXNTeW1ib2wgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlck5ldyAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LnRvU3RyaW5nICgpLFxuICAgICAgICAgICAgJ3ByaWNlJzogcHJpY2UudG9TdHJpbmcgKCksXG4gICAgICAgICAgICAnc2lkZSc6IHNpZGUsXG4gICAgICAgICAgICAndHlwZSc6ICdleGNoYW5nZSAnICsgdHlwZSxcbiAgICAgICAgICAgICdvY29vcmRlcic6IGZhbHNlLFxuICAgICAgICAgICAgJ2J1eV9wcmljZV9vY28nOiAwLFxuICAgICAgICAgICAgJ3NlbGxfcHJpY2Vfb2NvJzogMCxcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgcmVxdWVzdDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ25vbmNlJzogbm9uY2UudG9TdHJpbmcgKCksXG4gICAgICAgICAgICAgICAgJ3JlcXVlc3QnOiByZXF1ZXN0LFxuICAgICAgICAgICAgfSwgcXVlcnkpO1xuICAgICAgICAgICAgbGV0IHBheWxvYWQgPSB0aGlzLnN0cmluZ1RvQmFzZTY0IChKU09OLnN0cmluZ2lmeSAocXVlcnkpKTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ1gtQkZYLUFQSUtFWSc6IHRoaXMuYXBpS2V5LFxuICAgICAgICAgICAgICAgICdYLUJGWC1QQVlMT0FEJzogcGF5bG9hZCxcbiAgICAgICAgICAgICAgICAnWC1CRlgtU0lHTkFUVVJFJzogdGhpcy5obWFjIChwYXlsb2FkLCB0aGlzLnNlY3JldCwgJ3NoYTM4NCcpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGJpdGxpc2ggPSB7XG5cbiAgICAnaWQnOiAnYml0bGlzaCcsXG4gICAgJ25hbWUnOiAnYml0bGlzaCcsXG4gICAgJ2NvdW50cmllcyc6IFsgJ1VLJywgJ0VVJywgJ1JVJywgXSxcbiAgICAncmF0ZUxpbWl0JzogMjAwMCwgICAgXG4gICAgJ3ZlcnNpb24nOiAndjEnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2Mjc1LWRjZmM2YzMwLTVlZDMtMTFlNy04MzlkLTAwYTg0NjM4NWQwYi5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vYml0bGlzaC5jb20vYXBpJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL2JpdGxpc2guY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2JpdGxpc2guY29tL2FwaScsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnaW5zdHJ1bWVudHMnLFxuICAgICAgICAgICAgICAgICdvaGxjdicsXG4gICAgICAgICAgICAgICAgJ3BhaXJzJyxcbiAgICAgICAgICAgICAgICAndGlja2VycycsXG4gICAgICAgICAgICAgICAgJ3RyYWRlc19kZXB0aCcsXG4gICAgICAgICAgICAgICAgJ3RyYWRlc19oaXN0b3J5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2FjY291bnRzX29wZXJhdGlvbnMnLFxuICAgICAgICAgICAgICAgICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX3RyYWRlJyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX3RyYWRlc19ieV9pZHMnLFxuICAgICAgICAgICAgICAgICdjYW5jZWxfYWxsX3RyYWRlcycsXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZV9iY29kZScsXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZV90ZW1wbGF0ZV93YWxsZXQnLFxuICAgICAgICAgICAgICAgICdjcmVhdGVfdHJhZGUnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0JyxcbiAgICAgICAgICAgICAgICAnbGlzdF9hY2NvdW50c19vcGVyYXRpb25zX2Zyb21fdHMnLFxuICAgICAgICAgICAgICAgICdsaXN0X2FjdGl2ZV90cmFkZXMnLFxuICAgICAgICAgICAgICAgICdsaXN0X2Jjb2RlcycsXG4gICAgICAgICAgICAgICAgJ2xpc3RfbXlfbWF0Y2hlc19mcm9tX3RzJyxcbiAgICAgICAgICAgICAgICAnbGlzdF9teV90cmFkZXMnLFxuICAgICAgICAgICAgICAgICdsaXN0X215X3RyYWRzX2Zyb21fdHMnLFxuICAgICAgICAgICAgICAgICdsaXN0X3BheW1lbnRfbWV0aG9kcycsXG4gICAgICAgICAgICAgICAgJ2xpc3RfcGF5bWVudHMnLFxuICAgICAgICAgICAgICAgICdyZWRlZW1fY29kZScsXG4gICAgICAgICAgICAgICAgJ3Jlc2lnbicsXG4gICAgICAgICAgICAgICAgJ3NpZ25pbicsXG4gICAgICAgICAgICAgICAgJ3NpZ25vdXQnLFxuICAgICAgICAgICAgICAgICd0cmFkZV9kZXRhaWxzJyxcbiAgICAgICAgICAgICAgICAndHJhZGVfb3B0aW9ucycsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdfYnlfaWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hQcm9kdWN0cyAoKSB7XG4gICAgICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IHRoaXMucHVibGljR2V0UGFpcnMgKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyAocHJvZHVjdHMpO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IGtleXMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNba2V5c1twXV07XG4gICAgICAgICAgICBsZXQgaWQgPSBwcm9kdWN0WydpZCddO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IHByb2R1Y3RbJ25hbWUnXTtcbiAgICAgICAgICAgIGxldCBbIGJhc2UsIHF1b3RlIF0gPSBzeW1ib2wuc3BsaXQgKCcvJyk7XG4gICAgICAgICAgICByZXN1bHQucHVzaCAoe1xuICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgJ2Jhc2UnOiBiYXNlLFxuICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IHRpY2tlcnMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRpY2tlcnMgKCk7XG4gICAgICAgIGxldCB0aWNrZXIgPSB0aWNrZXJzW3BbJ2lkJ11dO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5taWxsaXNlY29uZHMgKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ21heCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ21pbiddKSxcbiAgICAgICAgICAgICdiaWQnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXNrJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnZmlyc3QnXSksXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdCddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzRGVwdGggKHtcbiAgICAgICAgICAgICdwYWlyX2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzSGlzdG9yeSAoe1xuICAgICAgICAgICAgJ3BhaXJfaWQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEJhbGFuY2UgKCk7XG4gICAgfSxcblxuICAgIHNpZ25JbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0U2lnbmluICh7XG4gICAgICAgICAgICAnbG9naW4nOiB0aGlzLmxvZ2luLFxuICAgICAgICAgICAgJ3Bhc3N3ZCc6IHRoaXMucGFzc3dvcmQsXG4gICAgICAgIH0pO1xuICAgIH0sICAgIFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdwYWlyX2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ2Rpcic6IChzaWRlID09ICdidXknKSA/ICdiaWQnIDogJ2FzaycsXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RDcmVhdGVUcmFkZSAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLycgKyB0aGlzLnZlcnNpb24gKyAnLycgKyBwYXRoO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgKHRoaXMuZXh0ZW5kICh7ICd0b2tlbic6IHRoaXMuYXBpS2V5IH0sIHBhcmFtcykpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYml0bWFya2V0ID0ge1xuXG4gICAgJ2lkJzogJ2JpdG1hcmtldCcsXG4gICAgJ25hbWUnOiAnQml0TWFya2V0JyxcbiAgICAnY291bnRyaWVzJzogWyAnUEwnLCAnRVUnLCBdLFxuICAgICdyYXRlTGltaXQnOiAzMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY3MjU2LWE4NTU1MjAwLTVlZjktMTFlNy05NmZkLTQ2OWE2NWUyYjBiZC5qcGcnLFxuICAgICAgICAnYXBpJzoge1xuICAgICAgICAgICAgJ3B1YmxpYyc6ICdodHRwczovL3d3dy5iaXRtYXJrZXQubmV0JyxcbiAgICAgICAgICAgICdwcml2YXRlJzogJ2h0dHBzOi8vd3d3LmJpdG1hcmtldC5wbC9hcGkyLycsIC8vIGxhc3Qgc2xhc2ggaXMgY3JpdGljYWxcbiAgICAgICAgfSxcbiAgICAgICAgJ3d3dyc6IFtcbiAgICAgICAgICAgICdodHRwczovL3d3dy5iaXRtYXJrZXQucGwnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmJpdG1hcmtldC5uZXQnLFxuICAgICAgICBdLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmJpdG1hcmtldC5uZXQvZG9jcy5waHA/ZmlsZT1hcGlfcHVibGljLmh0bWwnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmJpdG1hcmtldC5uZXQvZG9jcy5waHA/ZmlsZT1hcGlfcHJpdmF0ZS5odG1sJyxcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vYml0bWFya2V0LW5ldC9hcGknLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2pzb24ve21hcmtldH0vdGlja2VyJyxcbiAgICAgICAgICAgICAgICAnanNvbi97bWFya2V0fS9vcmRlcmJvb2snLFxuICAgICAgICAgICAgICAgICdqc29uL3ttYXJrZXR9L3RyYWRlcycsXG4gICAgICAgICAgICAgICAgJ2pzb24vY3RyYW5zZmVyJyxcbiAgICAgICAgICAgICAgICAnZ3JhcGhzL3ttYXJrZXR9LzkwbScsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS82aCcsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS8xZCcsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS83ZCcsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS8xbScsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS8zbScsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS82bScsXG4gICAgICAgICAgICAgICAgJ2dyYXBocy97bWFya2V0fS8xeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdpbmZvJyxcbiAgICAgICAgICAgICAgICAndHJhZGUnLFxuICAgICAgICAgICAgICAgICdjYW5jZWwnLFxuICAgICAgICAgICAgICAgICdvcmRlcnMnLFxuICAgICAgICAgICAgICAgICd0cmFkZXMnLFxuICAgICAgICAgICAgICAgICdoaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMnLFxuICAgICAgICAgICAgICAgICd0cmFkaW5nZGVzaycsXG4gICAgICAgICAgICAgICAgJ3RyYWRpbmdkZXNrU3RhdHVzJyxcbiAgICAgICAgICAgICAgICAndHJhZGluZ2Rlc2tDb25maXJtJyxcbiAgICAgICAgICAgICAgICAnY3J5cHRvdHJhZGluZ2Rlc2snLFxuICAgICAgICAgICAgICAgICdjcnlwdG90cmFkaW5nZGVza1N0YXR1cycsXG4gICAgICAgICAgICAgICAgJ2NyeXB0b3RyYWRpbmdkZXNrQ29uZmlybScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdGaWF0JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdQTE5QUCcsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3RmlhdEZhc3QnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0JyxcbiAgICAgICAgICAgICAgICAndHJhbnNmZXInLFxuICAgICAgICAgICAgICAgICd0cmFuc2ZlcnMnLFxuICAgICAgICAgICAgICAgICdtYXJnaW5MaXN0JyxcbiAgICAgICAgICAgICAgICAnbWFyZ2luT3BlbicsXG4gICAgICAgICAgICAgICAgJ21hcmdpbkNsb3NlJyxcbiAgICAgICAgICAgICAgICAnbWFyZ2luQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICAnbWFyZ2luTW9kaWZ5JyxcbiAgICAgICAgICAgICAgICAnbWFyZ2luQmFsYW5jZUFkZCcsXG4gICAgICAgICAgICAgICAgJ21hcmdpbkJhbGFuY2VSZW1vdmUnLFxuICAgICAgICAgICAgICAgICdzd2FwTGlzdCcsXG4gICAgICAgICAgICAgICAgJ3N3YXBPcGVuJyxcbiAgICAgICAgICAgICAgICAnc3dhcENsb3NlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvUExOJzogeyAnaWQnOiAnQlRDUExOJywgJ3N5bWJvbCc6ICdCVEMvUExOJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1BMTicgfSxcbiAgICAgICAgJ0JUQy9FVVInOiB7ICdpZCc6ICdCVENFVVInLCAnc3ltYm9sJzogJ0JUQy9FVVInLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnRVVSJyB9LFxuICAgICAgICAnTFRDL1BMTic6IHsgJ2lkJzogJ0xUQ1BMTicsICdzeW1ib2wnOiAnTFRDL1BMTicsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdQTE4nIH0sXG4gICAgICAgICdMVEMvQlRDJzogeyAnaWQnOiAnTFRDQlRDJywgJ3N5bWJvbCc6ICdMVEMvQlRDJywgJ2Jhc2UnOiAnTFRDJywgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ0xNWC9CVEMnOiB7ICdpZCc6ICdMaXRlTWluZVhCVEMnLCAnc3ltYm9sJzogJ0xNWC9CVEMnLCAnYmFzZSc6ICdMTVgnLCAncXVvdGUnOiAnQlRDJyB9LFxuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRKc29uTWFya2V0T3JkZXJib29rICh7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHRpY2tlciA9IGF3YWl0IHRoaXMucHVibGljR2V0SnNvbk1hcmtldFRpY2tlciAoe1xuICAgICAgICAgICAgJ21hcmtldCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogcGFyc2VGbG9hdCAodGlja2VyWyd2d2FwJ10pLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdCddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRKc29uTWFya2V0VHJhZGVzICh7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0VHJhZGUgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3R5cGUnOiBzaWRlLFxuICAgICAgICAgICAgJ2Ftb3VudCc6IGFtb3VudCxcbiAgICAgICAgICAgICdyYXRlJzogcHJpY2UsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXVt0eXBlXTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGggKyAnLmpzb24nLCBwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ3RvbmNlJzogbm9uY2UsXG4gICAgICAgICAgICAgICAgJ21ldGhvZCc6IHBhdGgsXG4gICAgICAgICAgICB9LCBwYXJhbXMpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdBUEktS2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ0FQSS1IYXNoJzogdGhpcy5obWFjIChib2R5LCB0aGlzLnNlY3JldCwgJ3NoYTUxMicpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGJpdG1leCA9IHtcblxuICAgICdpZCc6ICdiaXRtZXgnLFxuICAgICduYW1lJzogJ0JpdE1FWCcsXG4gICAgJ2NvdW50cmllcyc6ICdTQycsIC8vIFNleWNoZWxsZXNcbiAgICAndmVyc2lvbic6ICd2MScsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjYzMTktZjY1M2M2ZTYtNWVkNC0xMWU3LTkzM2QtZjBiYzM2OTlhZThmLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cuYml0bWV4LmNvbScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cuYml0bWV4LmNvbScsXG4gICAgICAgICdkb2MnOiBbXG4gICAgICAgICAgICAnaHR0cHM6Ly93d3cuYml0bWV4LmNvbS9hcHAvYXBpT3ZlcnZpZXcnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9CaXRNRVgvYXBpLWNvbm5lY3RvcnMvdHJlZS9tYXN0ZXIvb2ZmaWNpYWwtaHR0cCcsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYW5ub3VuY2VtZW50JyxcbiAgICAgICAgICAgICAgICAnYW5ub3VuY2VtZW50L3VyZ2VudCcsXG4gICAgICAgICAgICAgICAgJ2Z1bmRpbmcnLFxuICAgICAgICAgICAgICAgICdpbnN0cnVtZW50JyxcbiAgICAgICAgICAgICAgICAnaW5zdHJ1bWVudC9hY3RpdmUnLFxuICAgICAgICAgICAgICAgICdpbnN0cnVtZW50L2FjdGl2ZUFuZEluZGljZXMnLFxuICAgICAgICAgICAgICAgICdpbnN0cnVtZW50L2FjdGl2ZUludGVydmFscycsXG4gICAgICAgICAgICAgICAgJ2luc3RydW1lbnQvY29tcG9zaXRlSW5kZXgnLFxuICAgICAgICAgICAgICAgICdpbnN0cnVtZW50L2luZGljZXMnLFxuICAgICAgICAgICAgICAgICdpbnN1cmFuY2UnLFxuICAgICAgICAgICAgICAgICdsZWFkZXJib2FyZCcsXG4gICAgICAgICAgICAgICAgJ2xpcXVpZGF0aW9uJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJCb29rJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJCb29rL0wyJyxcbiAgICAgICAgICAgICAgICAncXVvdGUnLFxuICAgICAgICAgICAgICAgICdxdW90ZS9idWNrZXRlZCcsXG4gICAgICAgICAgICAgICAgJ3NjaGVtYScsXG4gICAgICAgICAgICAgICAgJ3NjaGVtYS93ZWJzb2NrZXRIZWxwJyxcbiAgICAgICAgICAgICAgICAnc2V0dGxlbWVudCcsXG4gICAgICAgICAgICAgICAgJ3N0YXRzJyxcbiAgICAgICAgICAgICAgICAnc3RhdHMvaGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlJyxcbiAgICAgICAgICAgICAgICAndHJhZGUvYnVja2V0ZWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdhcGlLZXknLFxuICAgICAgICAgICAgICAgICdjaGF0JyxcbiAgICAgICAgICAgICAgICAnY2hhdC9jaGFubmVscycsXG4gICAgICAgICAgICAgICAgJ2NoYXQvY29ubmVjdGVkJyxcbiAgICAgICAgICAgICAgICAnZXhlY3V0aW9uJyxcbiAgICAgICAgICAgICAgICAnZXhlY3V0aW9uL3RyYWRlSGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ25vdGlmaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgJ29yZGVyJyxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24nLFxuICAgICAgICAgICAgICAgICd1c2VyJyxcbiAgICAgICAgICAgICAgICAndXNlci9hZmZpbGlhdGVTdGF0dXMnLFxuICAgICAgICAgICAgICAgICd1c2VyL2NoZWNrUmVmZXJyYWxDb2RlJyxcbiAgICAgICAgICAgICAgICAndXNlci9jb21taXNzaW9uJyxcbiAgICAgICAgICAgICAgICAndXNlci9kZXBvc2l0QWRkcmVzcycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbWFyZ2luJyxcbiAgICAgICAgICAgICAgICAndXNlci9taW5XaXRoZHJhd2FsRmVlJyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQnLFxuICAgICAgICAgICAgICAgICd1c2VyL3dhbGxldEhpc3RvcnknLFxuICAgICAgICAgICAgICAgICd1c2VyL3dhbGxldFN1bW1hcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdhcGlLZXknLFxuICAgICAgICAgICAgICAgICdhcGlLZXkvZGlzYWJsZScsXG4gICAgICAgICAgICAgICAgJ2FwaUtleS9lbmFibGUnLFxuICAgICAgICAgICAgICAgICdjaGF0JyxcbiAgICAgICAgICAgICAgICAnb3JkZXInLFxuICAgICAgICAgICAgICAgICdvcmRlci9idWxrJyxcbiAgICAgICAgICAgICAgICAnb3JkZXIvY2FuY2VsQWxsQWZ0ZXInLFxuICAgICAgICAgICAgICAgICdvcmRlci9jbG9zZVBvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24vaXNvbGF0ZScsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uL2xldmVyYWdlJyxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24vcmlza0xpbWl0JyxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24vdHJhbnNmZXJNYXJnaW4nLFxuICAgICAgICAgICAgICAgICd1c2VyL2NhbmNlbFdpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICd1c2VyL2NvbmZpcm1FbWFpbCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvY29uZmlybUVuYWJsZVRGQScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvY29uZmlybVdpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICd1c2VyL2Rpc2FibGVURkEnLFxuICAgICAgICAgICAgICAgICd1c2VyL2xvZ291dCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbG9nb3V0QWxsJyxcbiAgICAgICAgICAgICAgICAndXNlci9wcmVmZXJlbmNlcycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvcmVxdWVzdEVuYWJsZVRGQScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvcmVxdWVzdFdpdGhkcmF3YWwnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwdXQnOiBbXG4gICAgICAgICAgICAgICAgJ29yZGVyJyxcbiAgICAgICAgICAgICAgICAnb3JkZXIvYnVsaycsXG4gICAgICAgICAgICAgICAgJ3VzZXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdkZWxldGUnOiBbXG4gICAgICAgICAgICAgICAgJ2FwaUtleScsXG4gICAgICAgICAgICAgICAgJ29yZGVyJyxcbiAgICAgICAgICAgICAgICAnb3JkZXIvYWxsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH1cbiAgICB9LCBcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldEluc3RydW1lbnRBY3RpdmUgKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9kdWN0cy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1twXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ3N5bWJvbCddO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSBwcm9kdWN0Wyd1bmRlcmx5aW5nJ107XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBwcm9kdWN0WydxdW90ZUN1cnJlbmN5J107XG4gICAgICAgICAgICBsZXQgaXNGdXR1cmVzQ29udHJhY3QgPSBpZCAhPSAoYmFzZSArIHF1b3RlKTtcbiAgICAgICAgICAgIGJhc2UgPSB0aGlzLmNvbW1vbkN1cnJlbmN5Q29kZSAoYmFzZSk7XG4gICAgICAgICAgICBxdW90ZSA9IHRoaXMuY29tbW9uQ3VycmVuY3lDb2RlIChxdW90ZSk7XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gaXNGdXR1cmVzQ29udHJhY3QgPyBpZCA6IChiYXNlICsgJy8nICsgcXVvdGUpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlR2V0VXNlck1hcmdpbiAoeyAnY3VycmVuY3knOiAnYWxsJyB9KTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJCb29rTDIgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnYmluU2l6ZSc6ICcxZCcsXG4gICAgICAgICAgICAncGFydGlhbCc6IHRydWUsXG4gICAgICAgICAgICAnY291bnQnOiAxLFxuICAgICAgICAgICAgJ3JldmVyc2UnOiB0cnVlLCAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgICAgICBsZXQgcXVvdGVzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRRdW90ZUJ1Y2tldGVkIChyZXF1ZXN0KTtcbiAgICAgICAgbGV0IHF1b3Rlc0xlbmd0aCA9IHF1b3Rlcy5sZW5ndGg7XG4gICAgICAgIGxldCBxdW90ZSA9IHF1b3Rlc1txdW90ZXNMZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IHRpY2tlcnMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRyYWRlQnVja2V0ZWQgKHJlcXVlc3QpO1xuICAgICAgICBsZXQgdGlja2VyID0gdGlja2Vyc1swXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93J10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHF1b3RlWydiaWRQcmljZSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0IChxdW90ZVsnYXNrUHJpY2UnXSksXG4gICAgICAgICAgICAndndhcCc6IHBhcnNlRmxvYXQgKHRpY2tlclsndndhcCddKSxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogcGFyc2VGbG9hdCAodGlja2VyWydjbG9zZSddKSxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaG9tZU5vdGlvbmFsJ10pLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWydmb3JlaWduTm90aW9uYWwnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGUgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IG9yZGVyID0ge1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdzaWRlJzogdGhpcy5jYXBpdGFsaXplIChzaWRlKSxcbiAgICAgICAgICAgICdvcmRlclF0eSc6IGFtb3VudCxcbiAgICAgICAgICAgICdvcmRUeXBlJzogdGhpcy5jYXBpdGFsaXplICh0eXBlKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2xpbWl0JylcbiAgICAgICAgICAgIG9yZGVyWydyYXRlJ10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlciAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gJy9hcGkvJyArIHRoaXMudmVyc2lvbiArICcvJyArIHBhdGg7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyAocGFyYW1zKS5sZW5ndGgpXG4gICAgICAgICAgICBxdWVyeSArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocGFyYW1zKTtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyBxdWVyeTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3ByaXZhdGUnKSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpLnRvU3RyaW5nICgpO1xuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PSAnUE9TVCcpXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IChwYXJhbXMpO1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBbIG1ldGhvZCwgcXVlcnksIG5vbmNlLCBib2R5IHx8ICcnXS5qb2luICgnJyk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ2FwaS1ub25jZSc6IG5vbmNlLFxuICAgICAgICAgICAgICAgICdhcGkta2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ2FwaS1zaWduYXR1cmUnOiB0aGlzLmhtYWMgKHJlcXVlc3QsIHRoaXMuc2VjcmV0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBiaXRzbyA9IHtcblxuICAgICdpZCc6ICdiaXRzbycsXG4gICAgJ25hbWUnOiAnQml0c28nLFxuICAgICdjb3VudHJpZXMnOiAnTVgnLCAvLyBNZXhpY29cbiAgICAncmF0ZUxpbWl0JzogMjAwMCwgLy8gMzAgcmVxdWVzdHMgcGVyIG1pbnV0ZVxuICAgICd2ZXJzaW9uJzogJ3YzJyxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjMzNS03MTVjZTdhYS01ZWQ1LTExZTctODhhOC0xNzNhMjdiYjMwZmUuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2FwaS5iaXRzby5jb20nLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vYml0c28uY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2JpdHNvLmNvbS9hcGlfaW5mbycsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYXZhaWxhYmxlX2Jvb2tzJyxcbiAgICAgICAgICAgICAgICAndGlja2VyJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJfYm9vaycsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2FjY291bnRfc3RhdHVzJyxcbiAgICAgICAgICAgICAgICAnYmFsYW5jZScsXG4gICAgICAgICAgICAgICAgJ2ZlZXMnLFxuICAgICAgICAgICAgICAgICdmdW5kaW5ncycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRpbmdzL3tmaWR9JyxcbiAgICAgICAgICAgICAgICAnZnVuZGluZ19kZXN0aW5hdGlvbicsXG4gICAgICAgICAgICAgICAgJ2t5Y19kb2N1bWVudHMnLFxuICAgICAgICAgICAgICAgICdsZWRnZXInLFxuICAgICAgICAgICAgICAgICdsZWRnZXIvdHJhZGVzJyxcbiAgICAgICAgICAgICAgICAnbGVkZ2VyL2ZlZXMnLFxuICAgICAgICAgICAgICAgICdsZWRnZXIvZnVuZGluZ3MnLFxuICAgICAgICAgICAgICAgICdsZWRnZXIvd2l0aGRyYXdhbHMnLFxuICAgICAgICAgICAgICAgICdteF9iYW5rX2NvZGVzJyxcbiAgICAgICAgICAgICAgICAnb3Blbl9vcmRlcnMnLFxuICAgICAgICAgICAgICAgICdvcmRlcl90cmFkZXMve29pZH0nLFxuICAgICAgICAgICAgICAgICdvcmRlcnMve29pZH0nLFxuICAgICAgICAgICAgICAgICd1c2VyX3RyYWRlcycsXG4gICAgICAgICAgICAgICAgJ3VzZXJfdHJhZGVzL3t0aWR9JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMvJyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMve3dpZH0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdiaXRjb2luX3dpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICdkZWJpdF9jYXJkX3dpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICdldGhlcl93aXRoZHJhd2FsJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAncGhvbmVfbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAncGhvbmVfdmVyaWZpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAncGhvbmVfd2l0aGRyYXdhbCcsXG4gICAgICAgICAgICAgICAgJ3NwZWlfd2l0aGRyYXdhbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6IFtcbiAgICAgICAgICAgICAgICAnb3JkZXJzL3tvaWR9JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL2FsbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldEF2YWlsYWJsZUJvb2tzICgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcHJvZHVjdHNbJ3BheWxvYWQnXS5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1sncGF5bG9hZCddW3BdO1xuICAgICAgICAgICAgbGV0IGlkID0gcHJvZHVjdFsnYm9vayddO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGlkLnRvVXBwZXJDYXNlICgpLnJlcGxhY2UgKCdfJywgJy8nKTtcbiAgICAgICAgICAgIGxldCBbIGJhc2UsIHF1b3RlIF0gPSBzeW1ib2wuc3BsaXQgKCcvJyk7XG4gICAgICAgICAgICByZXN1bHQucHVzaCAoe1xuICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgJ2Jhc2UnOiBiYXNlLFxuICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVHZXRCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJCb29rICh7XG4gICAgICAgICAgICAnYm9vayc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VyICh7XG4gICAgICAgICAgICAnYm9vayc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsncGF5bG9hZCddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5wYXJzZTg2MDEgKHRpY2tlclsnY3JlYXRlZF9hdCddKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogcGFyc2VGbG9hdCAodGlja2VyWyd2d2FwJ10pLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZXMgKHtcbiAgICAgICAgICAgICdib29rJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdib29rJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3NpZGUnOiBzaWRlLFxuICAgICAgICAgICAgJ3R5cGUnOiB0eXBlLFxuICAgICAgICAgICAgJ21ham9yJzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlcnMgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBxdWVyeSA9ICcvJyArIHRoaXMudmVyc2lvbiArICcvJyArIHRoaXMuaW1wbG9kZVBhcmFtcyAocGF0aCwgcGFyYW1zKTtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyBxdWVyeTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocGFyYW1zKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgKHBhcmFtcyk7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpLnRvU3RyaW5nICgpO1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBbIG5vbmNlLCBtZXRob2QsIHF1ZXJ5LCBib2R5IHx8ICcnIF0uam9pbiAoJycpO1xuICAgICAgICAgICAgbGV0IHNpZ25hdHVyZSA9IHRoaXMuaG1hYyAocmVxdWVzdCwgdGhpcy5zZWNyZXQpO1xuICAgICAgICAgICAgbGV0IGF1dGggPSB0aGlzLmFwaUtleSArICc6JyArIG5vbmNlICsgJzonICsgc2lnbmF0dXJlO1xuICAgICAgICAgICAgaGVhZGVycyA9IHsgJ0F1dGhvcml6YXRpb24nOiBcIkJpdHNvIFwiICsgYXV0aCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYml0c3RhbXAgPSB7XG5cbiAgICAnaWQnOiAnYml0c3RhbXAnLFxuICAgICduYW1lJzogJ0JpdHN0YW1wJyxcbiAgICAnY291bnRyaWVzJzogJ1VLJyxcbiAgICAncmF0ZUxpbWl0JzogMTAwMCxcbiAgICAndmVyc2lvbic6ICd2MicsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3ODYzNzctOGM4YWI1N2UtNWZlOS0xMWU3LThlYTQtMmIwNWI2YmNjZWVjLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cuYml0c3RhbXAubmV0L2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cuYml0c3RhbXAubmV0JyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL3d3dy5iaXRzdGFtcC5uZXQvYXBpJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdvcmRlcl9ib29rL3tpZH0vJyxcbiAgICAgICAgICAgICAgICAndGlja2VyX2hvdXIve2lkfS8nLFxuICAgICAgICAgICAgICAgICd0aWNrZXIve2lkfS8nLFxuICAgICAgICAgICAgICAgICd0cmFuc2FjdGlvbnMve2lkfS8nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnYmFsYW5jZS8nLFxuICAgICAgICAgICAgICAgICdiYWxhbmNlL3tpZH0vJyxcbiAgICAgICAgICAgICAgICAnYnV5L3tpZH0vJyxcbiAgICAgICAgICAgICAgICAnYnV5L21hcmtldC97aWR9LycsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbF9vcmRlci8nLFxuICAgICAgICAgICAgICAgICdsaXF1aWRhdGlvbl9hZGRyZXNzL2luZm8vJyxcbiAgICAgICAgICAgICAgICAnbGlxdWlkYXRpb25fYWRkcmVzcy9uZXcvJyxcbiAgICAgICAgICAgICAgICAnb3Blbl9vcmRlcnMvYWxsLycsXG4gICAgICAgICAgICAgICAgJ29wZW5fb3JkZXJzL3tpZH0vJyxcbiAgICAgICAgICAgICAgICAnc2VsbC97aWR9LycsXG4gICAgICAgICAgICAgICAgJ3NlbGwvbWFya2V0L3tpZH0vJyxcbiAgICAgICAgICAgICAgICAndHJhbnNmZXItZnJvbS1tYWluLycsXG4gICAgICAgICAgICAgICAgJ3RyYW5zZmVyLXRvLW1haW4vJyxcbiAgICAgICAgICAgICAgICAndXNlcl90cmFuc2FjdGlvbnMvJyxcbiAgICAgICAgICAgICAgICAndXNlcl90cmFuc2FjdGlvbnMve2lkfS8nLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2FsL2NhbmNlbC8nLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2FsL29wZW4vJyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbC9zdGF0dXMvJyxcbiAgICAgICAgICAgICAgICAneHJwX2FkZHJlc3MvJyxcbiAgICAgICAgICAgICAgICAneHJwX3dpdGhkcmF3YWwvJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnYnRjdXNkJywgJ3N5bWJvbCc6ICdCVEMvVVNEJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1VTRCcgfSxcbiAgICAgICAgJ0JUQy9FVVInOiB7ICdpZCc6ICdidGNldXInLCAnc3ltYm9sJzogJ0JUQy9FVVInLCAnYmFzZSc6ICdCVEMnLCAncXVvdGUnOiAnRVVSJyB9LFxuICAgICAgICAnRVVSL1VTRCc6IHsgJ2lkJzogJ2V1cnVzZCcsICdzeW1ib2wnOiAnRVVSL1VTRCcsICdiYXNlJzogJ0VVUicsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgICAgICdYUlAvVVNEJzogeyAnaWQnOiAneHJwdXNkJywgJ3N5bWJvbCc6ICdYUlAvVVNEJywgJ2Jhc2UnOiAnWFJQJywgJ3F1b3RlJzogJ1VTRCcgfSxcbiAgICAgICAgJ1hSUC9FVVInOiB7ICdpZCc6ICd4cnBldXInLCAnc3ltYm9sJzogJ1hSUC9FVVInLCAnYmFzZSc6ICdYUlAnLCAncXVvdGUnOiAnRVVSJyB9LFxuICAgICAgICAnWFJQL0JUQyc6IHsgJ2lkJzogJ3hycGJ0YycsICdzeW1ib2wnOiAnWFJQL0JUQycsICdiYXNlJzogJ1hSUCcsICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgfSxcbiAgICBcbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlckJvb2tJZCAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHRpY2tlciA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VySWQgKHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSBwYXJzZUludCAodGlja2VyWyd0aW1lc3RhbXAnXSkgKiAxMDAwO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93J10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYmlkJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXNrJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3Z3YXAnXSksXG4gICAgICAgICAgICAnb3Blbic6IHBhcnNlRmxvYXQgKHRpY2tlclsnb3BlbiddKSxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBcbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFuc2FjdGlvbnNJZCAoeyBcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEJhbGFuY2UgKCk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBsZXQgbWV0aG9kID0gJ3ByaXZhdGVQb3N0JyArIHRoaXMuY2FwaXRhbGl6ZSAoc2lkZSk7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdtYXJrZXQnKVxuICAgICAgICAgICAgbWV0aG9kICs9ICdNYXJrZXQnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvcmRlclsncHJpY2UnXSA9IHByaWNlO1xuICAgICAgICBtZXRob2QgKz0gJ0lkJztcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kXSAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLycgKyB0aGlzLnZlcnNpb24gKyAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcyk7XG4gICAgICAgIGxldCBxdWVyeSA9IHRoaXMub21pdCAocGFyYW1zLCB0aGlzLmV4dHJhY3RQYXJhbXMgKHBhdGgpKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCkudG9TdHJpbmcgKCk7XG4gICAgICAgICAgICBsZXQgYXV0aCA9IG5vbmNlICsgdGhpcy51aWQgKyB0aGlzLmFwaUtleTtcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSB0aGlzLmhtYWMgKGF1dGgsIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIHF1ZXJ5ID0gdGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICAgICAna2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ3NpZ25hdHVyZSc6IHNpZ25hdHVyZS50b1VwcGVyQ2FzZSAoKSxcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSxcbiAgICAgICAgICAgIH0sIHF1ZXJ5KTtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYml0dHJleCA9IHtcblxuICAgICdpZCc6ICdiaXR0cmV4JyxcbiAgICAnbmFtZSc6ICdCaXR0cmV4JyxcbiAgICAnY291bnRyaWVzJzogJ1VTJyxcbiAgICAndmVyc2lvbic6ICd2MS4xJyxcbiAgICAncmF0ZUxpbWl0JzogMjAwMCxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjM1Mi1jZjBiM2MyNi01ZWQ1LTExZTctODJiNy1mMzgyNmI3YTk3ZDguanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2JpdHRyZXguY29tL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9iaXR0cmV4LmNvbScsXG4gICAgICAgICdkb2MnOiBbIFxuICAgICAgICAgICAgJ2h0dHBzOi8vYml0dHJleC5jb20vSG9tZS9BcGknLFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3Lm5wbWpzLm9yZy9wYWNrYWdlL25vZGUuYml0dHJleC5hcGknLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2N1cnJlbmNpZXMnLFxuICAgICAgICAgICAgICAgICdtYXJrZXRoaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnbWFya2V0cycsXG4gICAgICAgICAgICAgICAgJ21hcmtldHN1bW1hcmllcycsXG4gICAgICAgICAgICAgICAgJ21hcmtldHN1bW1hcnknLFxuICAgICAgICAgICAgICAgICdvcmRlcmJvb2snLFxuICAgICAgICAgICAgICAgICd0aWNrZXInLCAgICAgICAgICAgIFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2FjY291bnQnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnYmFsYW5jZXMnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0YWRkcmVzcycsXG4gICAgICAgICAgICAgICAgJ2RlcG9zaXRoaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnb3JkZXInLFxuICAgICAgICAgICAgICAgICdvcmRlcmhpc3RvcnknLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2FsaGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdtYXJrZXQnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdidXlsaW1pdCcsXG4gICAgICAgICAgICAgICAgJ2J1eW1hcmtldCcsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ29wZW5vcmRlcnMnLFxuICAgICAgICAgICAgICAgICdzZWxsbGltaXQnLFxuICAgICAgICAgICAgICAgICdzZWxsbWFya2V0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldE1hcmtldHMgKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9kdWN0c1sncmVzdWx0J10ubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ3Jlc3VsdCddW3BdO1xuICAgICAgICAgICAgbGV0IGlkID0gcHJvZHVjdFsnTWFya2V0TmFtZSddO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSBwcm9kdWN0WydCYXNlQ3VycmVuY3knXTtcbiAgICAgICAgICAgIGxldCBxdW90ZSA9IHByb2R1Y3RbJ01hcmtldEN1cnJlbmN5J107XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gYmFzZSArICcvJyArIHF1b3RlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NvdW50R2V0QmFsYW5jZXMgKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldE9yZGVyYm9vayAoe1xuICAgICAgICAgICAgJ21hcmtldCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICd0eXBlJzogJ2JvdGgnLFxuICAgICAgICAgICAgJ2RlcHRoJzogNTAsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnB1YmxpY0dldE1hcmtldHN1bW1hcnkgKHtcbiAgICAgICAgICAgICdtYXJrZXQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGlja2VyID0gcmVzcG9uc2VbJ3Jlc3VsdCddWzBdO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5wYXJzZTg2MDEgKHRpY2tlclsnVGltZVN0YW1wJ10pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydIaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnTG93J10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnQmlkJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnQXNrJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydMYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnVm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldE1hcmtldGhpc3RvcnkgKHsgXG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2QgPSAnbWFya2V0R2V0JyArIHRoaXMuY2FwaXRhbGl6ZSAoc2lkZSkgKyB0eXBlO1xuICAgICAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3F1YW50aXR5JzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3JhdGUnXSA9IHByaWNlO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArICcvJyArIHRoaXMudmVyc2lvbiArICcvJztcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSB0eXBlICsgJy8nICsgbWV0aG9kLnRvTG93ZXJDYXNlICgpICsgcGF0aDtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocGFyYW1zKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKTtcbiAgICAgICAgICAgIHVybCArPSB0eXBlICsgJy8nO1xuICAgICAgICAgICAgaWYgKCgodHlwZSA9PSAnYWNjb3VudCcpICYmIChwYXRoICE9ICd3aXRoZHJhdycpKSB8fCAocGF0aCA9PSAnb3Blbm9yZGVycycpKVxuICAgICAgICAgICAgICAgIHVybCArPSBtZXRob2QudG9Mb3dlckNhc2UgKCk7XG4gICAgICAgICAgICB1cmwgKz0gcGF0aCArICc/JyArIHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdub25jZSc6IG5vbmNlLFxuICAgICAgICAgICAgICAgICdhcGlrZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgIH0sIHBhcmFtcykpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHsgJ2FwaXNpZ24nOiB0aGlzLmhtYWMgKHVybCwgdGhpcy5zZWNyZXQsICdzaGE1MTInKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYnRjY2hpbmEgPSB7XG5cbiAgICAnaWQnOiAnYnRjY2hpbmEnLFxuICAgICduYW1lJzogJ0JUQ0NoaW5hJyxcbiAgICAnY291bnRyaWVzJzogJ0NOJyxcbiAgICAncmF0ZUxpbWl0JzogMzAwMCxcbiAgICAndmVyc2lvbic6ICd2MScsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjYzNjgtNDY1YjMyODYtNWVkNi0xMWU3LTlhMTEtMGY2NDY3ZTFkODJiLmpwZycsXG4gICAgICAgICdhcGknOiB7XG4gICAgICAgICAgICAncHVibGljJzogJ2h0dHBzOi8vZGF0YS5idGNjaGluYS5jb20vZGF0YScsXG4gICAgICAgICAgICAncHJpdmF0ZSc6ICdodHRwczovL2FwaS5idGNjaGluYS5jb20vYXBpX3RyYWRlX3YxLnBocCcsXG4gICAgICAgIH0sXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cuYnRjY2hpbmEuY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL3d3dy5idGNjaGluYS5jb20vYXBpZG9jcydcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdoaXN0b3J5ZGF0YScsXG4gICAgICAgICAgICAgICAgJ29yZGVyYm9vaycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdCdXlJY2ViZXJnT3JkZXInLFxuICAgICAgICAgICAgICAgICdCdXlPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0J1eU9yZGVyMicsXG4gICAgICAgICAgICAgICAgJ0J1eVN0b3BPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0NhbmNlbEljZWJlcmdPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0NhbmNlbE9yZGVyJyxcbiAgICAgICAgICAgICAgICAnQ2FuY2VsU3RvcE9yZGVyJyxcbiAgICAgICAgICAgICAgICAnR2V0QWNjb3VudEluZm8nLFxuICAgICAgICAgICAgICAgICdnZXRBcmNoaXZlZE9yZGVyJyxcbiAgICAgICAgICAgICAgICAnZ2V0QXJjaGl2ZWRPcmRlcnMnLFxuICAgICAgICAgICAgICAgICdHZXREZXBvc2l0cycsXG4gICAgICAgICAgICAgICAgJ0dldEljZWJlcmdPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0dldEljZWJlcmdPcmRlcnMnLFxuICAgICAgICAgICAgICAgICdHZXRNYXJrZXREZXB0aCcsXG4gICAgICAgICAgICAgICAgJ0dldE1hcmtldERlcHRoMicsXG4gICAgICAgICAgICAgICAgJ0dldE9yZGVyJyxcbiAgICAgICAgICAgICAgICAnR2V0T3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnR2V0U3RvcE9yZGVyJyxcbiAgICAgICAgICAgICAgICAnR2V0U3RvcE9yZGVycycsXG4gICAgICAgICAgICAgICAgJ0dldFRyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgJ0dldFdpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICdHZXRXaXRoZHJhd2FscycsXG4gICAgICAgICAgICAgICAgJ1JlcXVlc3RXaXRoZHJhd2FsJyxcbiAgICAgICAgICAgICAgICAnU2VsbEljZWJlcmdPcmRlcicsXG4gICAgICAgICAgICAgICAgJ1NlbGxPcmRlcicsXG4gICAgICAgICAgICAgICAgJ1NlbGxPcmRlcjInLFxuICAgICAgICAgICAgICAgICdTZWxsU3RvcE9yZGVyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRpY2tlciAoe1xuICAgICAgICAgICAgJ21hcmtldCc6ICdhbGwnLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzIChwcm9kdWN0cyk7XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwga2V5cy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbcF07XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzW2tleV07XG4gICAgICAgICAgICBsZXQgcGFydHMgPSBrZXkuc3BsaXQgKCdfJyk7XG4gICAgICAgICAgICBsZXQgaWQgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gaWQuc2xpY2UgKDAsIDMpO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gaWQuc2xpY2UgKDMsIDYpO1xuICAgICAgICAgICAgYmFzZSA9IGJhc2UudG9VcHBlckNhc2UgKCk7XG4gICAgICAgICAgICBxdW90ZSA9IHF1b3RlLnRvVXBwZXJDYXNlICgpO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RHZXRBY2NvdW50SW5mbyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJib29rICh7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgdGlja2VycyA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VyICh7XG4gICAgICAgICAgICAnbWFya2V0JzogcFsnaWQnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aWNrZXIgPSB0aWNrZXJzWyd0aWNrZXInXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRpY2tlclsnZGF0ZSddICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGwnXSksXG4gICAgICAgICAgICAndndhcCc6IHBhcnNlRmxvYXQgKHRpY2tlclsndndhcCddKSxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAodGlja2VyWydvcGVuJ10pLFxuICAgICAgICAgICAgJ2Nsb3NlJzogcGFyc2VGbG9hdCAodGlja2VyWydwcmV2X2Nsb3NlJ10pLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2wnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzICh7XG4gICAgICAgICAgICAnbWFya2V0JzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IG1ldGhvZCA9ICdwcml2YXRlUG9zdCcgKyB0aGlzLmNhcGl0YWxpemUgKHNpZGUpICsgJ09yZGVyMic7XG4gICAgICAgIGxldCBvcmRlciA9IHt9O1xuICAgICAgICBsZXQgaWQgPSBwWydpZCddLnRvVXBwZXJDYXNlICgpO1xuICAgICAgICBpZiAodHlwZSA9PSAnbWFya2V0Jykge1xuICAgICAgICAgICAgb3JkZXJbJ3BhcmFtcyddID0gWyB1bmRlZmluZWQsIGFtb3VudCwgaWQgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9yZGVyWydwYXJhbXMnXSA9IFsgcHJpY2UsIGFtb3VudCwgaWQgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICBub25jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pY3Jvc2Vjb25kcyAoKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ11bdHlwZV0gKyAnLycgKyBwYXRoO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcCA9IFtdO1xuICAgICAgICAgICAgaWYgKCdwYXJhbXMnIGluIHBhcmFtcylcbiAgICAgICAgICAgICAgICBwID0gcGFyYW1zWydwYXJhbXMnXTtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAnbWV0aG9kJzogcGF0aCxcbiAgICAgICAgICAgICAgICAnaWQnOiBub25jZSxcbiAgICAgICAgICAgICAgICAncGFyYW1zJzogcCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwID0gcC5qb2luICgnLCcpO1xuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IChcbiAgICAgICAgICAgICAgICAndG9uY2U9JyArIG5vbmNlICtcbiAgICAgICAgICAgICAgICAnJmFjY2Vzc2tleT0nICsgdGhpcy5hcGlLZXkgK1xuICAgICAgICAgICAgICAgICcmcmVxdWVzdG1ldGhvZD0nICsgbWV0aG9kLnRvTG93ZXJDYXNlICgpICtcbiAgICAgICAgICAgICAgICAnJmlkPScgKyBub25jZSArXG4gICAgICAgICAgICAgICAgJyZtZXRob2Q9JyArIHBhdGggK1xuICAgICAgICAgICAgICAgICcmcGFyYW1zPScgKyBwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHNpZ25hdHVyZSA9IHRoaXMuaG1hYyAocXVlcnksIHRoaXMuc2VjcmV0LCAnc2hhMScpO1xuICAgICAgICAgICAgbGV0IGF1dGggPSB0aGlzLmFwaUtleSArICc6JyArIHNpZ25hdHVyZTsgXG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGJvZHkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0Jhc2ljICcgKyB0aGlzLnN0cmluZ1RvQmFzZTY0IChxdWVyeSksXG4gICAgICAgICAgICAgICAgJ0pzb24tUnBjLVRvbmNlJzogbm9uY2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYnRjeCA9IHtcblxuICAgICdpZCc6ICdidGN4JyxcbiAgICAnbmFtZSc6ICdCVENYJyxcbiAgICAnY291bnRyaWVzJzogWyAnSVMnLCAnVVMnLCAnRVUnLCBdLFxuICAgICdyYXRlTGltaXQnOiAzMDAwLCAvLyBzdXBwb3J0IGluIGVuZ2xpc2ggaXMgdmVyeSBwb29yLCB1bmFibGUgdG8gdGVsbCByYXRlIGxpbWl0c1xuICAgICd2ZXJzaW9uJzogJ3YxJyxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjM4NS05ZmRjYzk4Yy01ZWQ2LTExZTctOGYxNC02NmQ1ZTVjZDQ3ZTYuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2J0Yy14LmlzL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9idGMteC5pcycsXG4gICAgICAgICdkb2MnOiAnaHR0cHM6Ly9idGMteC5pcy9jdXN0b20vYXBpLWRvY3VtZW50Lmh0bWwnLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2RlcHRoL3tpZH0ve2xpbWl0fScsXG4gICAgICAgICAgICAgICAgJ3RpY2tlci97aWR9JywgICAgICAgICBcbiAgICAgICAgICAgICAgICAndHJhZGUve2lkfS97bGltaXR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2JhbGFuY2UnLFxuICAgICAgICAgICAgICAgICdjYW5jZWwnLFxuICAgICAgICAgICAgICAgICdoaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnb3JkZXInLFxuICAgICAgICAgICAgICAgICdyZWRlZW0nLFxuICAgICAgICAgICAgICAgICd0cmFkZScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnYnRjL3VzZCcsICdzeW1ib2wnOiAnQlRDL1VTRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgICAgICdCVEMvRVVSJzogeyAnaWQnOiAnYnRjL2V1cicsICdzeW1ib2wnOiAnQlRDL0VVUicsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdFVVInIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0QmFsYW5jZSAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHsgXG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0RGVwdGhJZExpbWl0ICh7IFxuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ2xpbWl0JzogMTAwMCxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7IFxuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXJJZCAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRpY2tlclsndGltZSddICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGwnXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVJZExpbWl0ICh7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnbGltaXQnOiAxMDAsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RUcmFkZSAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICd0eXBlJzogc2lkZS50b1VwcGVyQ2FzZSAoKSxcbiAgICAgICAgICAgICdtYXJrZXQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LFxuICAgICAgICAgICAgJ3ByaWNlJzogcHJpY2UsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArICcvJyArIHRoaXMudmVyc2lvbiArICcvJztcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICAgICAgdXJsICs9IHR5cGU7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ01ldGhvZCc6IHBhdGgudG9VcHBlckNhc2UgKCksXG4gICAgICAgICAgICAgICAgJ05vbmNlJzogbm9uY2UsXG4gICAgICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICdLZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnU2lnbmF0dXJlJzogdGhpcy5obWFjIChib2R5LCB0aGlzLnNlY3JldCwgJ3NoYTUxMicpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGJ4aW50aCA9IHtcblxuICAgICdpZCc6ICdieGludGgnLFxuICAgICduYW1lJzogJ0JYLmluLnRoJyxcbiAgICAnY291bnRyaWVzJzogJ1RIJywgLy8gVGhhaWxhbmRcbiAgICAncmF0ZUxpbWl0JzogMjAwMCxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjQxMi01NjdiMWViNC01ZWQ3LTExZTctOTRhOC1mZjZhMzg4NGY2YzUuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2J4LmluLnRoL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9ieC5pbi50aCcsXG4gICAgICAgICdkb2MnOiAnaHR0cHM6Ly9ieC5pbi50aC9pbmZvL2FwaScsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnJywgLy8gdGlja2VyXG4gICAgICAgICAgICAgICAgJ29wdGlvbnMnLFxuICAgICAgICAgICAgICAgICdvcHRpb25ib29rJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJib29rJyxcbiAgICAgICAgICAgICAgICAncGFpcmluZycsXG4gICAgICAgICAgICAgICAgJ3RyYWRlJyxcbiAgICAgICAgICAgICAgICAndHJhZGVoaXN0b3J5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2JhbGFuY2UnLFxuICAgICAgICAgICAgICAgICdiaWxsZXInLFxuICAgICAgICAgICAgICAgICdiaWxsZ3JvdXAnLFxuICAgICAgICAgICAgICAgICdiaWxscGF5JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsJyxcbiAgICAgICAgICAgICAgICAnZGVwb3NpdCcsXG4gICAgICAgICAgICAgICAgJ2dldG9yZGVycycsXG4gICAgICAgICAgICAgICAgJ2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICdvcHRpb24taXNzdWUnLFxuICAgICAgICAgICAgICAgICdvcHRpb24tYmlkJyxcbiAgICAgICAgICAgICAgICAnb3B0aW9uLXNlbGwnLFxuICAgICAgICAgICAgICAgICdvcHRpb24tbXlpc3N1ZScsXG4gICAgICAgICAgICAgICAgJ29wdGlvbi1teWJpZCcsXG4gICAgICAgICAgICAgICAgJ29wdGlvbi1teW9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICdvcHRpb24tZXhlcmNpc2UnLFxuICAgICAgICAgICAgICAgICdvcHRpb24tY2FuY2VsJyxcbiAgICAgICAgICAgICAgICAnb3B0aW9uLWhpc3RvcnknLFxuICAgICAgICAgICAgICAgICdvcmRlcicsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3YWwnLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2FsLWhpc3RvcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hQcm9kdWN0cyAoKSB7XG4gICAgICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IHRoaXMucHVibGljR2V0UGFpcmluZyAoKTtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyAocHJvZHVjdHMpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwga2V5cy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1trZXlzW3BdXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ3BhaXJpbmdfaWQnXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gcHJvZHVjdFsncHJpbWFyeV9jdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gcHJvZHVjdFsnc2Vjb25kYXJ5X2N1cnJlbmN5J107XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gYmFzZSArICcvJyArIHF1b3RlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEJhbGFuY2UgKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldE9yZGVyYm9vayAoe1xuICAgICAgICAgICAgJ3BhaXJpbmcnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgcCA9IHRoaXMucHJvZHVjdCAocHJvZHVjdCk7XG4gICAgICAgIGxldCB0aWNrZXJzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXQgKHsgJ3BhaXJpbmcnOiBwWydpZCddIH0pO1xuICAgICAgICBsZXQgdGlja2VyID0gdGlja2Vyc1twWydpZCddXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xvdyc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ29yZGVyYm9vayddWydiaWRzJ11bJ2hpZ2hiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydvcmRlcmJvb2snXVsnYXNrcyddWydoaWdoYmlkJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0X3ByaWNlJ10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnY2hhbmdlJ10pLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWVfMjRob3VycyddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZSAoe1xuICAgICAgICAgICAgJ3BhaXJpbmcnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlciAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICdwYWlyaW5nJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3R5cGUnOiBzaWRlLFxuICAgICAgICAgICAgJ2Ftb3VudCc6IGFtb3VudCxcbiAgICAgICAgICAgICdyYXRlJzogcHJpY2UsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArICcvJyArIHBhdGggKyAnLyc7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyAocGFyYW1zKS5sZW5ndGgpXG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIGlmICh0eXBlID09ICdwcml2YXRlJykge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKTtcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSB0aGlzLmhhc2ggKHRoaXMuYXBpS2V5ICsgbm9uY2UgKyB0aGlzLnNlY3JldCwgJ3NoYTI1NicpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdrZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSxcbiAgICAgICAgICAgICAgICAnc2lnbmF0dXJlJzogc2lnbmF0dXJlLFxuICAgICAgICAgICAgICAgIC8vIHR3b2ZhOiB0aGlzLnR3b2ZhLFxuICAgICAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjY2V4ID0ge1xuXG4gICAgJ2lkJzogJ2NjZXgnLFxuICAgICduYW1lJzogJ0MtQ0VYJyxcbiAgICAnY291bnRyaWVzJzogWyAnREUnLCAnRVUnLCBdLFxuICAgICdyYXRlTGltaXQnOiAyMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NDMzLTE2ODgxZjkwLTVlZDgtMTFlNy05MmY4LTNkOTJjYzc0N2E2Yy5qcGcnLFxuICAgICAgICAnYXBpJzoge1xuICAgICAgICAgICAgJ3RpY2tlcnMnOiAnaHR0cHM6Ly9jLWNleC5jb20vdCcsXG4gICAgICAgICAgICAncHVibGljJzogJ2h0dHBzOi8vYy1jZXguY29tL3QvYXBpX3B1Yi5odG1sJyxcbiAgICAgICAgICAgICdwcml2YXRlJzogJ2h0dHBzOi8vYy1jZXguY29tL3QvYXBpLmh0bWwnLFxuICAgICAgICB9LFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vYy1jZXguY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2MtY2V4LmNvbS8/aWQ9YXBpJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICd0aWNrZXJzJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnY29pbm5hbWVzJyxcbiAgICAgICAgICAgICAgICAne21hcmtldH0nLFxuICAgICAgICAgICAgICAgICdwYWlycycsXG4gICAgICAgICAgICAgICAgJ3ByaWNlcycsXG4gICAgICAgICAgICAgICAgJ3ZvbHVtZV97Y29pbn0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICdiYWxhbmNlZGlzdHJpYnV0aW9uJyxcbiAgICAgICAgICAgICAgICAnbWFya2V0aGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ21hcmtldHMnLFxuICAgICAgICAgICAgICAgICdtYXJrZXRzdW1tYXJpZXMnLFxuICAgICAgICAgICAgICAgICdvcmRlcmJvb2snLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7ICAgICAgICAgICAgXG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdidXlsaW1pdCcsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ2dldGJhbGFuY2UnLFxuICAgICAgICAgICAgICAgICdnZXRiYWxhbmNlcycsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICdnZXRvcGVub3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnZ2V0b3JkZXInLFxuICAgICAgICAgICAgICAgICdnZXRvcmRlcmhpc3RvcnknLFxuICAgICAgICAgICAgICAgICdteXRyYWRlcycsXG4gICAgICAgICAgICAgICAgJ3NlbGxsaW1pdCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRNYXJrZXRzICgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcHJvZHVjdHNbJ3Jlc3VsdCddLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzWydyZXN1bHQnXVtwXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ01hcmtldE5hbWUnXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gcHJvZHVjdFsnTWFya2V0Q3VycmVuY3knXTtcbiAgICAgICAgICAgIGxldCBxdW90ZSA9IHByb2R1Y3RbJ0Jhc2VDdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUdldEJhbGFuY2VzICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlcmJvb2sgKHtcbiAgICAgICAgICAgICdtYXJrZXQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAndHlwZSc6ICdib3RoJyxcbiAgICAgICAgICAgICdkZXB0aCc6IDEwMCxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMudGlja2Vyc0dldE1hcmtldCAoe1xuICAgICAgICAgICAgJ21hcmtldCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KS50b0xvd2VyQ2FzZSAoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsndGlja2VyJ107XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aWNrZXJbJ3VwZGF0ZWQnXSAqIDEwMDA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydidXknXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydzZWxsJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0cHJpY2UnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXZnJ10pLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eXN1cHBvcnQnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0TWFya2V0aGlzdG9yeSAoe1xuICAgICAgICAgICAgJ21hcmtldCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICd0eXBlJzogJ2JvdGgnLFxuICAgICAgICAgICAgJ2RlcHRoJzogMTAwLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2QgPSAncHJpdmF0ZUdldCcgKyB0aGlzLmNhcGl0YWxpemUgKHNpZGUpICsgdHlwZTtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kXSAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICdtYXJrZXQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAncXVhbnRpdHknOiBhbW91bnQsXG4gICAgICAgICAgICAncmF0ZSc6IHByaWNlLFxuICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ11bdHlwZV07XG4gICAgICAgIGlmICh0eXBlID09ICdwcml2YXRlJykge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKS50b1N0cmluZyAoKTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHRoaXMua2V5c29ydCAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICAgICAnYSc6IHBhdGgsXG4gICAgICAgICAgICAgICAgJ2FwaWtleSc6IHRoaXMuYXBpS2V5LFxuICAgICAgICAgICAgICAgICdub25jZSc6IG5vbmNlLFxuICAgICAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7ICdhcGlzaWduJzogdGhpcy5obWFjICh1cmwsIHRoaXMuc2VjcmV0LCAnc2hhNTEyJykgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ2EnOiAnZ2V0JyArIHBhdGgsXG4gICAgICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCArPSAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcykgKyAnLmpzb24nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY2V4ID0ge1xuXG4gICAgJ2lkJzogJ2NleCcsXG4gICAgJ25hbWUnOiAnQ0VYLklPJyxcbiAgICAnY291bnRyaWVzJzogWyAnVUsnLCAnRVUnLCAnQ1knLCAnUlUnLCBdLFxuICAgICdyYXRlTGltaXQnOiAyMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NDQyLThkZGMzM2IwLTVlZDgtMTFlNy04Yjk4LWY3ODZhZWYwZjNjOS5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vY2V4LmlvL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9jZXguaW8nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vY2V4LmlvL2NleC1hcGknLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2N1cnJlbmN5X2xpbWl0cycsXG4gICAgICAgICAgICAgICAgJ2xhc3RfcHJpY2Uve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnbGFzdF9wcmljZXMve2N1cnJlbmNpZXN9JyxcbiAgICAgICAgICAgICAgICAnb2hsY3YvaGQve3l5eXltbWRkfS97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdvcmRlcl9ib29rL3twYWlyfScsXG4gICAgICAgICAgICAgICAgJ3RpY2tlci97cGFpcn0nLFxuICAgICAgICAgICAgICAgICd0aWNrZXJzL3tjdXJyZW5jaWVzfScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlX2hpc3Rvcnkve3BhaXJ9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnY29udmVydC97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdwcmljZV9zdGF0cy97cGFpcn0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnYWN0aXZlX29yZGVyc19zdGF0dXMvJyxcbiAgICAgICAgICAgICAgICAnYXJjaGl2ZWRfb3JkZXJzL3twYWlyfScsXG4gICAgICAgICAgICAgICAgJ2JhbGFuY2UvJyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX29yZGVyLycsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbF9vcmRlcnMve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX3JlcGxhY2Vfb3JkZXIve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnY2xvc2VfcG9zaXRpb24ve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnZ2V0X2FkZHJlc3MvJyxcbiAgICAgICAgICAgICAgICAnZ2V0X215ZmVlLycsXG4gICAgICAgICAgICAgICAgJ2dldF9vcmRlci8nLFxuICAgICAgICAgICAgICAgICdnZXRfb3JkZXJfdHgvJyxcbiAgICAgICAgICAgICAgICAnb3Blbl9vcmRlcnMve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnb3Blbl9vcmRlcnMvJyxcbiAgICAgICAgICAgICAgICAnb3Blbl9wb3NpdGlvbi97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdvcGVuX3Bvc2l0aW9ucy97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdwbGFjZV9vcmRlci97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdwbGFjZV9vcmRlci97cGFpcn0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRDdXJyZW5jeUxpbWl0cyAoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb2R1Y3RzWydkYXRhJ11bJ3BhaXJzJ10ubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ2RhdGEnXVsncGFpcnMnXVtwXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ3N5bWJvbDEnXSArICcvJyArIHByb2R1Y3RbJ3N5bWJvbDInXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBpZDtcbiAgICAgICAgICAgIGxldCBbIGJhc2UsIHF1b3RlIF0gPSBzeW1ib2wuc3BsaXQgKCcvJyk7XG4gICAgICAgICAgICByZXN1bHQucHVzaCAoe1xuICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgJ2Jhc2UnOiBiYXNlLFxuICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0QmFsYW5jZSAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJCb29rUGFpciAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXJQYWlyICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSBwYXJzZUludCAodGlja2VyWyd0aW1lc3RhbXAnXSkgKiAxMDAwO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93J10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYmlkJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXNrJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnY2hhbmdlJ10pLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVIaXN0b3J5UGFpciAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IG9yZGVyID0ge1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAndHlwZSc6IHNpZGUsXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LCAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb3JkZXJbJ29yZGVyX3R5cGUnXSA9IHR5cGU7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0UGxhY2VPcmRlclBhaXIgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGlmICh0eXBlID09ICdwdWJsaWMnKSB7ICAgXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMgKHF1ZXJ5KS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpLnRvU3RyaW5nICgpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdrZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnc2lnbmF0dXJlJzogdGhpcy5obWFjIChub25jZSArIHRoaXMudWlkICsgdGhpcy5hcGlLZXksIHRoaXMuc2VjcmV0KS50b1VwcGVyQ2FzZSAoKSxcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSxcbiAgICAgICAgICAgIH0sIHF1ZXJ5KSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb2luY2hlY2sgPSB7XG5cbiAgICAnaWQnOiAnY29pbmNoZWNrJyxcbiAgICAnbmFtZSc6ICdjb2luY2hlY2snLFxuICAgICdjb3VudHJpZXMnOiBbICdKUCcsICdJRCcsIF0sXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY0NjQtM2I1YzNjNzQtNWVkOS0xMWU3LTg0MGUtMzFiMzI5NjhlMWRhLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9jb2luY2hlY2suY29tL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9jb2luY2hlY2suY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2NvaW5jaGVjay5jb20vZG9jdW1lbnRzL2V4Y2hhbmdlL2FwaScsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2Uvb3JkZXJzL3JhdGUnLFxuICAgICAgICAgICAgICAgICdvcmRlcl9ib29rcycsXG4gICAgICAgICAgICAgICAgJ3JhdGUve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAndGlja2VyJyxcbiAgICAgICAgICAgICAgICAndHJhZGVzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYWNjb3VudHMnLFxuICAgICAgICAgICAgICAgICdhY2NvdW50cy9iYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnYWNjb3VudHMvbGV2ZXJhZ2VfYmFsYW5jZScsXG4gICAgICAgICAgICAgICAgJ2JhbmtfYWNjb3VudHMnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0X21vbmV5JyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2Uvb3JkZXJzL29wZW5zJyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2Uvb3JkZXJzL3RyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL29yZGVycy90cmFuc2FjdGlvbnNfcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL2xldmVyYWdlL3Bvc2l0aW9ucycsXG4gICAgICAgICAgICAgICAgJ2xlbmRpbmcvYm9ycm93cy9tYXRjaGVzJyxcbiAgICAgICAgICAgICAgICAnc2VuZF9tb25leScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3cycsXG4gICAgICAgICAgICBdLCAgICAgICAgICAgIFxuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2JhbmtfYWNjb3VudHMnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0X21vbmV5L3tpZH0vZmFzdCcsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL29yZGVycycsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL3RyYW5zZmVycy90b19sZXZlcmFnZScsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL3RyYW5zZmVycy9mcm9tX2xldmVyYWdlJyxcbiAgICAgICAgICAgICAgICAnbGVuZGluZy9ib3Jyb3dzJyxcbiAgICAgICAgICAgICAgICAnbGVuZGluZy9ib3Jyb3dzL3tpZH0vcmVwYXknLFxuICAgICAgICAgICAgICAgICdzZW5kX21vbmV5JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnZGVsZXRlJzogW1xuICAgICAgICAgICAgICAgICdiYW5rX2FjY291bnRzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdleGNoYW5nZS9vcmRlcnMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3cy97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvSlBZJzogIHsgJ2lkJzogJ2J0Y19qcHknLCAgJ3N5bWJvbCc6ICdCVEMvSlBZJywgICdiYXNlJzogJ0JUQycsICAncXVvdGUnOiAnSlBZJyB9LCAvLyB0aGUgb25seSByZWFsIHBhaXJcbiAgICAgICAgJ0VUSC9KUFknOiAgeyAnaWQnOiAnZXRoX2pweScsICAnc3ltYm9sJzogJ0VUSC9KUFknLCAgJ2Jhc2UnOiAnRVRIJywgICdxdW90ZSc6ICdKUFknIH0sXG4gICAgICAgICdFVEMvSlBZJzogIHsgJ2lkJzogJ2V0Y19qcHknLCAgJ3N5bWJvbCc6ICdFVEMvSlBZJywgICdiYXNlJzogJ0VUQycsICAncXVvdGUnOiAnSlBZJyB9LFxuICAgICAgICAnREFPL0pQWSc6ICB7ICdpZCc6ICdkYW9fanB5JywgICdzeW1ib2wnOiAnREFPL0pQWScsICAnYmFzZSc6ICdEQU8nLCAgJ3F1b3RlJzogJ0pQWScgfSxcbiAgICAgICAgJ0xTSy9KUFknOiAgeyAnaWQnOiAnbHNrX2pweScsICAnc3ltYm9sJzogJ0xTSy9KUFknLCAgJ2Jhc2UnOiAnTFNLJywgICdxdW90ZSc6ICdKUFknIH0sXG4gICAgICAgICdGQ1QvSlBZJzogIHsgJ2lkJzogJ2ZjdF9qcHknLCAgJ3N5bWJvbCc6ICdGQ1QvSlBZJywgICdiYXNlJzogJ0ZDVCcsICAncXVvdGUnOiAnSlBZJyB9LFxuICAgICAgICAnWE1SL0pQWSc6ICB7ICdpZCc6ICd4bXJfanB5JywgICdzeW1ib2wnOiAnWE1SL0pQWScsICAnYmFzZSc6ICdYTVInLCAgJ3F1b3RlJzogJ0pQWScgfSxcbiAgICAgICAgJ1JFUC9KUFknOiAgeyAnaWQnOiAncmVwX2pweScsICAnc3ltYm9sJzogJ1JFUC9KUFknLCAgJ2Jhc2UnOiAnUkVQJywgICdxdW90ZSc6ICdKUFknIH0sXG4gICAgICAgICdYUlAvSlBZJzogIHsgJ2lkJzogJ3hycF9qcHknLCAgJ3N5bWJvbCc6ICdYUlAvSlBZJywgICdiYXNlJzogJ1hSUCcsICAncXVvdGUnOiAnSlBZJyB9LFxuICAgICAgICAnWkVDL0pQWSc6ICB7ICdpZCc6ICd6ZWNfanB5JywgICdzeW1ib2wnOiAnWkVDL0pQWScsICAnYmFzZSc6ICdaRUMnLCAgJ3F1b3RlJzogJ0pQWScgfSxcbiAgICAgICAgJ1hFTS9KUFknOiAgeyAnaWQnOiAneGVtX2pweScsICAnc3ltYm9sJzogJ1hFTS9KUFknLCAgJ2Jhc2UnOiAnWEVNJywgICdxdW90ZSc6ICdKUFknIH0sXG4gICAgICAgICdMVEMvSlBZJzogIHsgJ2lkJzogJ2x0Y19qcHknLCAgJ3N5bWJvbCc6ICdMVEMvSlBZJywgICdiYXNlJzogJ0xUQycsICAncXVvdGUnOiAnSlBZJyB9LFxuICAgICAgICAnREFTSC9KUFknOiB7ICdpZCc6ICdkYXNoX2pweScsICdzeW1ib2wnOiAnREFTSC9KUFknLCAnYmFzZSc6ICdEQVNIJywgJ3F1b3RlJzogJ0pQWScgfSxcbiAgICAgICAgJ0VUSC9CVEMnOiAgeyAnaWQnOiAnZXRoX2J0YycsICAnc3ltYm9sJzogJ0VUSC9CVEMnLCAgJ2Jhc2UnOiAnRVRIJywgICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgICAgICdFVEMvQlRDJzogIHsgJ2lkJzogJ2V0Y19idGMnLCAgJ3N5bWJvbCc6ICdFVEMvQlRDJywgICdiYXNlJzogJ0VUQycsICAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnTFNLL0JUQyc6ICB7ICdpZCc6ICdsc2tfYnRjJywgICdzeW1ib2wnOiAnTFNLL0JUQycsICAnYmFzZSc6ICdMU0snLCAgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ0ZDVC9CVEMnOiAgeyAnaWQnOiAnZmN0X2J0YycsICAnc3ltYm9sJzogJ0ZDVC9CVEMnLCAgJ2Jhc2UnOiAnRkNUJywgICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgICAgICdYTVIvQlRDJzogIHsgJ2lkJzogJ3htcl9idGMnLCAgJ3N5bWJvbCc6ICdYTVIvQlRDJywgICdiYXNlJzogJ1hNUicsICAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnUkVQL0JUQyc6ICB7ICdpZCc6ICdyZXBfYnRjJywgICdzeW1ib2wnOiAnUkVQL0JUQycsICAnYmFzZSc6ICdSRVAnLCAgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ1hSUC9CVEMnOiAgeyAnaWQnOiAneHJwX2J0YycsICAnc3ltYm9sJzogJ1hSUC9CVEMnLCAgJ2Jhc2UnOiAnWFJQJywgICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgICAgICdaRUMvQlRDJzogIHsgJ2lkJzogJ3plY19idGMnLCAgJ3N5bWJvbCc6ICdaRUMvQlRDJywgICdiYXNlJzogJ1pFQycsICAncXVvdGUnOiAnQlRDJyB9LFxuICAgICAgICAnWEVNL0JUQyc6ICB7ICdpZCc6ICd4ZW1fYnRjJywgICdzeW1ib2wnOiAnWEVNL0JUQycsICAnYmFzZSc6ICdYRU0nLCAgJ3F1b3RlJzogJ0JUQycgfSxcbiAgICAgICAgJ0xUQy9CVEMnOiAgeyAnaWQnOiAnbHRjX2J0YycsICAnc3ltYm9sJzogJ0xUQy9CVEMnLCAgJ2Jhc2UnOiAnTFRDJywgICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgICAgICdEQVNIL0JUQyc6IHsgJ2lkJzogJ2Rhc2hfYnRjJywgJ3N5bWJvbCc6ICdEQVNIL0JUQycsICdiYXNlJzogJ0RBU0gnLCAncXVvdGUnOiAnQlRDJyB9LFxuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlR2V0QWNjb3VudHNCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlckJvb2tzICgpO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXIgKCk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aWNrZXJbJ3RpbWVzdGFtcCddICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdCddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZXMgKCk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBsZXQgcHJlZml4ID0gJyc7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbWFya2V0Jykge1xuICAgICAgICAgICAgbGV0IG9yZGVyX3R5cGUgPSB0eXBlICsgJ18nICsgc2lkZTtcbiAgICAgICAgICAgIG9yZGVyWydvcmRlcl90eXBlJ10gPSBvcmRlcl90eXBlO1xuICAgICAgICAgICAgbGV0IHByZWZpeCA9IChzaWRlID09IGJ1eSkgPyAob3JkZXJfdHlwZSArICdfJykgOiAnJztcbiAgICAgICAgICAgIG9yZGVyW3ByZWZpeCArICdhbW91bnQnXSA9IGFtb3VudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9yZGVyWydvcmRlcl90eXBlJ10gPSBzaWRlO1xuICAgICAgICAgICAgb3JkZXJbJ3JhdGUnXSA9IHByaWNlO1xuICAgICAgICAgICAgb3JkZXJbJ2Ftb3VudCddID0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0RXhjaGFuZ2VPcmRlcnMgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGlmICh0eXBlID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMgKHF1ZXJ5KS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpLnRvU3RyaW5nICgpO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChxdWVyeSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGJvZHkgPSB0aGlzLnVybGVuY29kZSAodGhpcy5rZXlzb3J0IChxdWVyeSkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgJ0FDQ0VTUy1LRVknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnQUNDRVNTLU5PTkNFJzogbm9uY2UsXG4gICAgICAgICAgICAgICAgJ0FDQ0VTUy1TSUdOQVRVUkUnOiB0aGlzLmhtYWMgKG5vbmNlICsgdXJsICsgKGJvZHkgfHwgJycpLCB0aGlzLnNlY3JldClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb2luc2VjdXJlID0ge1xuXG4gICAgJ2lkJzogJ2NvaW5zZWN1cmUnLFxuICAgICduYW1lJzogJ0NvaW5zZWN1cmUnLFxuICAgICdjb3VudHJpZXMnOiAnSU4nLCAvLyBJbmRpYVxuICAgICdyYXRlTGltaXQnOiAxMDAwLFxuICAgICd2ZXJzaW9uJzogJ3YxJyxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjQ3Mi05Y2JkMjAwYS01ZWQ5LTExZTctOTU1MS0yMjY3YWQ3YmFjMDguanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2FwaS5jb2luc2VjdXJlLmluJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL2NvaW5zZWN1cmUuaW4nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vYXBpLmNvaW5zZWN1cmUuaW4nLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9jb2luc2VjdXJlL3BsdWdpbnMnLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2JpdGNvaW4vc2VhcmNoL2NvbmZpcm1hdGlvbi97dHhpZH0nLFxuICAgICAgICAgICAgICAgICdleGNoYW5nZS9hc2svbG93JyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2UvYXNrL29yZGVycycsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL2JpZC9oaWdoJyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2UvYmlkL29yZGVycycsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL2xhc3RUcmFkZScsXG4gICAgICAgICAgICAgICAgJ2V4Y2hhbmdlL21heDI0SHInLFxuICAgICAgICAgICAgICAgICdleGNoYW5nZS9taW4yNEhyJyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2UvdGlja2VyJyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2UvdHJhZGVzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnbWZhL2F1dGh5L2NhbGwnLFxuICAgICAgICAgICAgICAgICdtZmEvYXV0aHkvc21zJywgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAnbmV0a2kvc2VhcmNoL3tuZXRraU5hbWV9JyxcbiAgICAgICAgICAgICAgICAndXNlci9iYW5rL290cC97bnVtYmVyfScsXG4gICAgICAgICAgICAgICAgJ3VzZXIva3ljL290cC97bnVtYmVyfScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvcHJvZmlsZS9waG9uZS9vdHAve251bWJlcn0nLFxuICAgICAgICAgICAgICAgICd1c2VyL3dhbGxldC9jb2luL2FkZHJlc3Mve2lkfScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvd2FsbGV0L2NvaW4vZGVwb3NpdC9jb25maXJtZWQvYWxsJyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQvY29pbi9kZXBvc2l0L2NvbmZpcm1lZC97aWR9JyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQvY29pbi9kZXBvc2l0L3VuY29uZmlybWVkL2FsbCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvd2FsbGV0L2NvaW4vZGVwb3NpdC91bmNvbmZpcm1lZC97aWR9JyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQvY29pbi93YWxsZXRzJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2ZpYXQvYWNjb3VudHMnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC9iYWxhbmNlL2F2YWlsYWJsZScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9maWF0L2JhbGFuY2UvcGVuZGluZycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9maWF0L2JhbGFuY2UvdG90YWwnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC9kZXBvc2l0L2NhbmNlbGxlZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9maWF0L2RlcG9zaXQvdW52ZXJpZmllZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9maWF0L2RlcG9zaXQvdmVyaWZpZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC93aXRoZHJhdy9jYW5jZWxsZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC93aXRoZHJhdy9jb21wbGV0ZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC93aXRoZHJhdy91bnZlcmlmaWVkJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2ZpYXQvd2l0aGRyYXcvdmVyaWZpZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2Fzay9jYW5jZWxsZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2Fzay9jb21wbGV0ZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2Fzay9wZW5kaW5nJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iaWQvY2FuY2VsbGVkJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iaWQvY29tcGxldGVkJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iaWQvcGVuZGluZycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL2FkZHJlc3NlcycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL2JhbGFuY2UvYXZhaWxhYmxlJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2NvaW4vYmFsYW5jZS9wZW5kaW5nJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2NvaW4vYmFsYW5jZS90b3RhbCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL2RlcG9zaXQvY2FuY2VsbGVkJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2NvaW4vZGVwb3NpdC91bnZlcmlmaWVkJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2NvaW4vZGVwb3NpdC92ZXJpZmllZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL3dpdGhkcmF3L2NhbmNlbGxlZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL3dpdGhkcmF3L2NvbXBsZXRlZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9jb2luL3dpdGhkcmF3L3VudmVyaWZpZWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvY29pbi93aXRoZHJhdy92ZXJpZmllZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9zdW1tYXJ5JyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9jb2luL2ZlZScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvZmlhdC9mZWUnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2t5Y3MnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL3JlZmVycmFsL2NvaW4vcGFpZCcsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvcmVmZXJyYWwvY29pbi9zdWNjZXNzZnVsJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9yZWZlcnJhbC9maWF0L3BhaWQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL3JlZmVycmFscycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvdHJhZGUvc3VtbWFyeScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbG9naW4vdG9rZW4ve3Rva2VufScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvc3VtbWFyeScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvd2FsbGV0L3N1bW1hcnknLFxuICAgICAgICAgICAgICAgICd3YWxsZXQvY29pbi93aXRoZHJhdy9jYW5jZWxsZWQnLFxuICAgICAgICAgICAgICAgICd3YWxsZXQvY29pbi93aXRoZHJhdy9jb21wbGV0ZWQnLFxuICAgICAgICAgICAgICAgICd3YWxsZXQvY29pbi93aXRoZHJhdy91bnZlcmlmaWVkJyxcbiAgICAgICAgICAgICAgICAnd2FsbGV0L2NvaW4vd2l0aGRyYXcvdmVyaWZpZWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdsb2dpbicsXG4gICAgICAgICAgICAgICAgJ2xvZ2luL2luaXRpYXRlJyxcbiAgICAgICAgICAgICAgICAnbG9naW4vcGFzc3dvcmQvZm9yZ290JyxcbiAgICAgICAgICAgICAgICAnbWZhL2F1dGh5L2luaXRpYXRlJyxcbiAgICAgICAgICAgICAgICAnbWZhL2dhL2luaXRpYXRlJyxcbiAgICAgICAgICAgICAgICAnc2lnbnVwJyxcbiAgICAgICAgICAgICAgICAndXNlci9uZXRraS91cGRhdGUnLFxuICAgICAgICAgICAgICAgICd1c2VyL3Byb2ZpbGUvaW1hZ2UvdXBkYXRlJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2NvaW4vd2l0aGRyYXcvaW5pdGlhdGUnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvY29pbi93aXRoZHJhdy9uZXdWZXJpZnljb2RlJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2ZpYXQvd2l0aGRyYXcvaW5pdGlhdGUnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC93aXRoZHJhdy9uZXdWZXJpZnljb2RlJyxcbiAgICAgICAgICAgICAgICAndXNlci9wYXNzd29yZC9jaGFuZ2UnLFxuICAgICAgICAgICAgICAgICd1c2VyL3Bhc3N3b3JkL3Jlc2V0JyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQvY29pbi93aXRoZHJhdy9pbml0aWF0ZScsXG4gICAgICAgICAgICAgICAgJ3dhbGxldC9jb2luL3dpdGhkcmF3L25ld1ZlcmlmeWNvZGUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwdXQnOiBbXG4gICAgICAgICAgICAgICAgJ3NpZ251cC92ZXJpZnkve3Rva2VufScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2Uva3ljJyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2ZpYXQvZGVwb3NpdC9uZXcnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2Fzay9uZXcnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JpZC9uZXcnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2luc3RhbnQvYnV5JyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9pbnN0YW50L3NlbGwnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvY29pbi93aXRoZHJhdy92ZXJpZnknLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC9hY2NvdW50L25ldycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYmFuay9maWF0L3dpdGhkcmF3L3ZlcmlmeScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbWZhL2F1dGh5L2luaXRpYXRlL2VuYWJsZScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbWZhL2dhL2luaXRpYXRlL2VuYWJsZScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvbmV0a2kvY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAndXNlci9wcm9maWxlL3Bob25lL25ldycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvd2FsbGV0L2NvaW4vYWRkcmVzcy9uZXcnLFxuICAgICAgICAgICAgICAgICd1c2VyL3dhbGxldC9jb2luL25ldycsXG4gICAgICAgICAgICAgICAgJ3VzZXIvd2FsbGV0L2NvaW4vd2l0aGRyYXcvc2VuZFRvRXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgICd1c2VyL3dhbGxldC9jb2luL3dpdGhkcmF3L3ZlcmlmeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6IFtcbiAgICAgICAgICAgICAgICAndXNlci9nY20ve2NvZGV9JyxcbiAgICAgICAgICAgICAgICAndXNlci9sb2dvdXQnLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvY29pbi93aXRoZHJhdy91bnZlcmlmaWVkL2NhbmNlbC97d2l0aGRyYXdJRH0nLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JhbmsvZmlhdC9kZXBvc2l0L2NhbmNlbC97ZGVwb3NpdElEfScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvZXhjaGFuZ2UvYXNrL2NhbmNlbC97b3JkZXJJRH0nLFxuICAgICAgICAgICAgICAgICd1c2VyL2V4Y2hhbmdlL2JpZC9jYW5jZWwve29yZGVySUR9JyxcbiAgICAgICAgICAgICAgICAndXNlci9leGNoYW5nZS9iYW5rL2ZpYXQvd2l0aGRyYXcvdW52ZXJpZmllZC9jYW5jZWwve3dpdGhkcmF3SUR9JyxcbiAgICAgICAgICAgICAgICAndXNlci9tZmEvYXV0aHkvZGlzYWJsZS97Y29kZX0nLFxuICAgICAgICAgICAgICAgICd1c2VyL21mYS9nYS9kaXNhYmxlL3tjb2RlfScsXG4gICAgICAgICAgICAgICAgJ3VzZXIvcHJvZmlsZS9waG9uZS9kZWxldGUnLFxuICAgICAgICAgICAgICAgICd1c2VyL3Byb2ZpbGUvaW1hZ2UvZGVsZXRlL3tuZXRraU5hbWV9JyxcbiAgICAgICAgICAgICAgICAndXNlci93YWxsZXQvY29pbi93aXRoZHJhdy91bnZlcmlmaWVkL2NhbmNlbC97d2l0aGRyYXdJRH0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgICdwcm9kdWN0cyc6IHtcbiAgICAgICAgJ0JUQy9JTlInOiB7ICdpZCc6ICdCVEMvSU5SJywgJ3N5bWJvbCc6ICdCVEMvSU5SJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ0lOUicgfSxcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUdldFVzZXJFeGNoYW5nZUJhbmtTdW1tYXJ5ICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0RXhjaGFuZ2VBc2tPcmRlcnMgKCk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHVibGljR2V0RXhjaGFuZ2VUaWNrZXIgKCk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsnbWVzc2FnZSddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGlja2VyWyd0aW1lc3RhbXAnXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ29wZW4nXSksXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdFByaWNlJ10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnY29pbnZvbHVtZSddKSxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnZmlhdHZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRFeGNoYW5nZVRyYWRlcyAoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2QgPSAncHJpdmF0ZVB1dFVzZXJFeGNoYW5nZSc7XG4gICAgICAgIGxldCBvcmRlciA9IHt9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbWFya2V0JykgeyAgICAgICBcbiAgICAgICAgICAgIG1ldGhvZCArPSAnSW5zdGFudCcgKyB0aGlzLmNhcGl0YWxpemUgKHNpZGUpO1xuICAgICAgICAgICAgaWYgKHNpZGUgPT0gJ2J1eScpXG4gICAgICAgICAgICAgICAgb3JkZXJbJ21heEZpYXQnXSA9IGFtb3VudDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvcmRlclsnbWF4Vm9sJ10gPSBhbW91bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gKHNpZGUgPT0gJ2J1eScpID8gJ0JpZCcgOiAnQXNrJztcbiAgICAgICAgICAgIG1ldGhvZCArPSBkaXJlY3Rpb24gKyAnTmV3JztcbiAgICAgICAgICAgIG9yZGVyWydyYXRlJ10gPSBwcmljZTtcbiAgICAgICAgICAgIG9yZGVyWyd2b2wnXSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdIChzZWxmLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArICcvJyArIHRoaXMudmVyc2lvbiArICcvJyArIHRoaXMuaW1wbG9kZVBhcmFtcyAocGF0aCwgcGFyYW1zKTtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5vbWl0IChwYXJhbXMsIHRoaXMuZXh0cmFjdFBhcmFtcyAocGF0aCkpO1xuICAgICAgICBpZiAodHlwZSA9PSAncHJpdmF0ZScpIHtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7ICdBdXRob3JpemF0aW9uJzogdGhpcy5hcGlLZXkgfTtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSAocXVlcnkpO1xuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXhtbyA9IHtcblxuICAgICdpZCc6ICdleG1vJyxcbiAgICAnbmFtZSc6ICdFWE1PJyxcbiAgICAnY291bnRyaWVzJzogWyAnRVMnLCAnUlUnLCBdLCAvLyBTcGFpbiwgUnVzc2lhXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsIC8vIG9uY2UgZXZlcnkgMzUwIG1zIOKJiCAxODAgcmVxdWVzdHMgcGVyIG1pbnV0ZSDiiYggMyByZXF1ZXN0cyBwZXIgc2Vjb25kXG4gICAgJ3ZlcnNpb24nOiAndjEnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NDkxLTFiMGVhOTU2LTVlZGEtMTFlNy05MjI1LTQwZDY3YjQ4MWI4ZC5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vYXBpLmV4bW8uY29tJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL2V4bW8ubWUnLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vZXhtby5tZS9ydS9hcGlfZG9jJyxcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZXhtby1kZXYvZXhtb19hcGlfbGliL3RyZWUvbWFzdGVyL25vZGVqcycsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnY3VycmVuY3knLFxuICAgICAgICAgICAgICAgICdvcmRlcl9ib29rJyxcbiAgICAgICAgICAgICAgICAncGFpcl9zZXR0aW5ncycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICd1c2VyX2luZm8nLFxuICAgICAgICAgICAgICAgICdvcmRlcl9jcmVhdGUnLFxuICAgICAgICAgICAgICAgICdvcmRlcl9jYW5jZWwnLFxuICAgICAgICAgICAgICAgICd1c2VyX29wZW5fb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAndXNlcl90cmFkZXMnLFxuICAgICAgICAgICAgICAgICd1c2VyX2NhbmNlbGxlZF9vcmRlcnMnLFxuICAgICAgICAgICAgICAgICdvcmRlcl90cmFkZXMnLFxuICAgICAgICAgICAgICAgICdyZXF1aXJlZF9hbW91bnQnLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0X2FkZHJlc3MnLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd19jcnlwdCcsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3X2dldF90eGlkJyxcbiAgICAgICAgICAgICAgICAnZXhjb2RlX2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgJ2V4Y29kZV9sb2FkJyxcbiAgICAgICAgICAgICAgICAnd2FsbGV0X2hpc3RvcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hQcm9kdWN0cyAoKSB7XG4gICAgICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IHRoaXMucHVibGljR2V0UGFpclNldHRpbmdzICgpO1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzIChwcm9kdWN0cyk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBrZXlzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSBrZXlzW3BdO1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1tpZF07XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gaWQucmVwbGFjZSAoJ18nLCAnLycpO1xuICAgICAgICAgICAgbGV0IFsgYmFzZSwgcXVvdGUgXSA9IHN5bWJvbC5zcGxpdCAoJy8nKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RVc2VySW5mbyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJCb29rICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VyICgpO1xuICAgICAgICBsZXQgcCA9IHRoaXMucHJvZHVjdCAocHJvZHVjdCk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVtwWydpZCddXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRpY2tlclsndXBkYXRlZCddICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eV9wcmljZSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGxfcHJpY2UnXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAodGlja2VyWydvcGVuJ10pLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3RfdHJhZGUnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXZnJ10pLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbCddKSxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sX2N1cnInXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBsZXQgcHJlZml4ID0gJyc7XG4gICAgICAgIGlmICh0eXBlID09J21hcmtldCcpXG4gICAgICAgICAgICBwcmVmaXggPSAnbWFya2V0Xyc7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3F1YW50aXR5JzogYW1vdW50LFxuICAgICAgICAgICAgJ3ByaWNlJzogcHJpY2UgfHwgMCxcbiAgICAgICAgICAgICd0eXBlJzogcHJlZml4ICsgc2lkZSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlckNyZWF0ZSAodGhpcy5leHRlbmQgKG9yZGVyLCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLycgKyB0aGlzLnZlcnNpb24gKyAnLycgKyBwYXRoO1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoeyAnbm9uY2UnOiBub25jZSB9LCBwYXJhbXMpKTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGJvZHkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICdLZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnU2lnbic6IHRoaXMuaG1hYyAoYm9keSwgdGhpcy5zZWNyZXQsICdzaGE1MTInKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBmeWIgPSB7XG5cbiAgICAncmF0ZUxpbWl0JzogMjAwMCxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAndGlja2VyJyxcbiAgICAgICAgICAgICAgICAndGlja2VyZGV0YWlsZWQnLFxuICAgICAgICAgICAgICAgICdvcmRlcmJvb2snLFxuICAgICAgICAgICAgICAgICd0cmFkZXMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAndGVzdCcsXG4gICAgICAgICAgICAgICAgJ2dldGFjY2luZm8nLFxuICAgICAgICAgICAgICAgICdnZXRwZW5kaW5nb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnZ2V0b3JkZXJoaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VscGVuZGluZ29yZGVyJyxcbiAgICAgICAgICAgICAgICAncGxhY2VvcmRlcicsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0R2V0YWNjaW5mbyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJib29rICgpO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXJkZXRhaWxlZCAoKTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xvdyc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdCddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbCddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZXMgKCk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdFBsYWNlb3JkZXIgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAncXR5JzogYW1vdW50LFxuICAgICAgICAgICAgJ3ByaWNlJzogcHJpY2UsXG4gICAgICAgICAgICAndHlwZSc6IHNpZGVbMF0udG9VcHBlckNhc2UgKClcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgcGF0aDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHsgICAgICAgICAgIFxuICAgICAgICAgICAgdXJsICs9ICcuanNvbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlICh0aGlzLmV4dGVuZCAoeyAndGltZXN0YW1wJzogbm9uY2UgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAna2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ3NpZyc6IHRoaXMuaG1hYyAoYm9keSwgdGhpcy5zZWNyZXQsICdzaGExJylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBmeWJzZSA9IGV4dGVuZCAoZnliLCB7XG4gICAgJ2lkJzogJ2Z5YnNlJyxcbiAgICAnbmFtZSc6ICdGWUItU0UnLFxuICAgICdjb3VudHJpZXMnOiAnU0UnLCAvLyBTd2VkZW5cbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjUxMi0zMTAxOTc3Mi01ZWRiLTExZTctODI0MS0yZTY3NWU2Nzk3ZjEuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL3d3dy5meWJzZS5zZS9hcGkvU0VLJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy5meWJzZS5zZScsXG4gICAgICAgICdkb2MnOiAnaHR0cDovL2RvY3MuZnliLmFwaWFyeS5pbycsXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvU0VLJzogeyAnaWQnOiAnU0VLJywgJ3N5bWJvbCc6ICdCVEMvU0VLJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1NFSycgfSxcbiAgICB9LFxufSlcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZnlic2cgPSBleHRlbmQgKGZ5Yiwge1xuICAgICdpZCc6ICdmeWJzZycsXG4gICAgJ25hbWUnOiAnRllCLVNHJyxcbiAgICAnY291bnRyaWVzJzogJ1NHJywgLy8gU2luZ2Fwb3JlXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY1MTMtMzM2NGQ1NmEtNWVkYi0xMWU3LTllNmItZDU4OThiYjg5YzgxLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cuZnlic2cuY29tL2FwaS9TR0QnLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LmZ5YnNnLmNvbScsXG4gICAgICAgICdkb2MnOiAnaHR0cDovL2RvY3MuZnliLmFwaWFyeS5pbycsXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvU0dEJzogeyAnaWQnOiAnU0dEJywgJ3N5bWJvbCc6ICdCVEMvU0dEJywgJ2Jhc2UnOiAnQlRDJywgJ3F1b3RlJzogJ1NHRCcgfSxcbiAgICB9LFxufSlcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZ2RheCA9IHtcbiAgICAnaWQnOiAnZ2RheCcsXG4gICAgJ25hbWUnOiAnR0RBWCcsXG4gICAgJ2NvdW50cmllcyc6ICdVUycsXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY1MjctYjFiZTQxYzYtNWVkYi0xMWU3LTk1ZjYtNWI0OTZjNDY5ZTJjLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9hcGkuZ2RheC5jb20nLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LmdkYXguY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL2RvY3MuZ2RheC5jb20nLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2N1cnJlbmNpZXMnLFxuICAgICAgICAgICAgICAgICdwcm9kdWN0cycsXG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3RzL3tpZH0vYm9vaycsXG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3RzL3tpZH0vY2FuZGxlcycsXG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3RzL3tpZH0vc3RhdHMnLFxuICAgICAgICAgICAgICAgICdwcm9kdWN0cy97aWR9L3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3RzL3tpZH0vdHJhZGVzJyxcbiAgICAgICAgICAgICAgICAndGltZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2FjY291bnRzJyxcbiAgICAgICAgICAgICAgICAnYWNjb3VudHMve2lkfScsXG4gICAgICAgICAgICAgICAgJ2FjY291bnRzL3tpZH0vaG9sZHMnLFxuICAgICAgICAgICAgICAgICdhY2NvdW50cy97aWR9L2xlZGdlcicsXG4gICAgICAgICAgICAgICAgJ2NvaW5iYXNlLWFjY291bnRzJyxcbiAgICAgICAgICAgICAgICAnZmlsbHMnLFxuICAgICAgICAgICAgICAgICdmdW5kaW5nJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdwYXltZW50LW1ldGhvZHMnLFxuICAgICAgICAgICAgICAgICdwb3NpdGlvbicsXG4gICAgICAgICAgICAgICAgJ3JlcG9ydHMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3VzZXJzL3NlbGYvdHJhaWxpbmctdm9sdW1lJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnZGVwb3NpdHMvY29pbmJhc2UtYWNjb3VudCcsXG4gICAgICAgICAgICAgICAgJ2RlcG9zaXRzL3BheW1lbnQtbWV0aG9kJyxcbiAgICAgICAgICAgICAgICAnZnVuZGluZy9yZXBheScsXG4gICAgICAgICAgICAgICAgJ29yZGVycycsXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uL2Nsb3NlJyxcbiAgICAgICAgICAgICAgICAncHJvZmlsZXMvbWFyZ2luLXRyYW5zZmVyJyxcbiAgICAgICAgICAgICAgICAncmVwb3J0cycsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3YWxzL2NvaW5iYXNlJyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMvY3J5cHRvJyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMvcGF5bWVudC1tZXRob2QnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdkZWxldGUnOiBbXG4gICAgICAgICAgICAgICAgJ29yZGVycycsXG4gICAgICAgICAgICAgICAgJ29yZGVycy97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFByb2R1Y3RzICgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcHJvZHVjdHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbcF07XG4gICAgICAgICAgICBsZXQgaWQgPSBwcm9kdWN0WydpZCddO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSBwcm9kdWN0WydiYXNlX2N1cnJlbmN5J107XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBwcm9kdWN0WydxdW90ZV9jdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZUdldEFjY291bnRzICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRQcm9kdWN0c0lkQm9vayAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRQcm9kdWN0c0lkVGlja2VyICh7XG4gICAgICAgICAgICAnaWQnOiBwWydpZCddLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHF1b3RlID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRQcm9kdWN0c0lkU3RhdHMgKHtcbiAgICAgICAgICAgICdpZCc6IHBbJ2lkJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5wYXJzZTg2MDEgKHRpY2tlclsndGltZSddKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHF1b3RlWydoaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHF1b3RlWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAocXVvdGVbJ29wZW4nXSksXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHF1b3RlWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFByb2R1Y3RzSWRUcmFkZXMgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IG9yZGVyID0ge1xuICAgICAgICAgICAgJ2NsaWVudF9vaWQnOiB0aGlzLm5vbmNlICgpLFxuICAgICAgICAgICAgJ3Byb2R1Y3RfaWQnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnc2lkZSc6IHNpZGUsXG4gICAgICAgICAgICAnc2l6ZSc6IGFtb3VudCxcbiAgICAgICAgICAgICd0eXBlJzogdHlwZSwgICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2xpbWl0JylcbiAgICAgICAgICAgIG9yZGVyWydwcmljZSddID0gcHJpY2U7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0T3JkZXIgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArIHJlcXVlc3Q7XG4gICAgICAgIGxldCBxdWVyeSA9IHRoaXMub21pdCAocGFyYW1zLCB0aGlzLmV4dHJhY3RQYXJhbXMgKHBhdGgpKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCkudG9TdHJpbmcgKCk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMgKHF1ZXJ5KS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IChxdWVyeSk7XG4gICAgICAgICAgICBsZXQgd2hhdCA9IG5vbmNlICsgbWV0aG9kICsgcmVxdWVzdCArIChib2R5IHx8ICcnKTtcbiAgICAgICAgICAgIGxldCBzZWNyZXQgPSB0aGlzLmJhc2U2NFRvQmluYXJ5ICh0aGlzLnNlY3JldCk7XG4gICAgICAgICAgICBsZXQgc2lnbmF0dXJlID0gdGhpcy5oYXNoICh3aGF0LCBzZWNyZXQsICdzaGEyNTYnLCAnYmluYXJ5Jyk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDQi1BQ0NFU1MtS0VZJzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ0NCLUFDQ0VTUy1TSUdOJzogdGhpcy5zdHJpbmdUb0Jhc2U2NCAoc2lnbmF0dXJlKSxcbiAgICAgICAgICAgICAgICAnQ0ItQUNDRVNTLVRJTUVTVEFNUCc6IG5vbmNlLFxuICAgICAgICAgICAgICAgICdDQi1BQ0NFU1MtUEFTU1BIUkFTRSc6IHRoaXMucGFzc3dvcmQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgaGl0YnRjID0ge1xuXG4gICAgJ2lkJzogJ2hpdGJ0YycsXG4gICAgJ25hbWUnOiAnSGl0QlRDJyxcbiAgICAnY291bnRyaWVzJzogJ0hLJywgLy8gSG9uZyBLb25nXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3ZlcnNpb24nOiAnMScsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY1NTUtOGVhZWMyMGUtNWVkYy0xMWU3LTljNWItNmRjNjlmYzQyZjVlLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cDovL2FwaS5oaXRidGMuY29tJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL2hpdGJ0Yy5jb20nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vaGl0YnRjLmNvbS9hcGknLFxuICAgICAgICAgICAgJ2h0dHA6Ly9oaXRidGMtY29tLmdpdGh1Yi5pby9oaXRidGMtYXBpJyxcbiAgICAgICAgICAgICdodHRwOi8vanNmaWRkbGUubmV0L2Jta25pZ2h0L1JxYllCJyxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICd7c3ltYm9sfS9vcmRlcmJvb2snLFxuICAgICAgICAgICAgICAgICd7c3ltYm9sfS90aWNrZXInLFxuICAgICAgICAgICAgICAgICd7c3ltYm9sfS90cmFkZXMnLFxuICAgICAgICAgICAgICAgICd7c3ltYm9sfS90cmFkZXMvcmVjZW50JyxcbiAgICAgICAgICAgICAgICAnc3ltYm9scycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3RpbWUsJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3RyYWRpbmcnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL2FjdGl2ZScsXG4gICAgICAgICAgICAgICAgJ29yZGVycy9yZWNlbnQnLFxuICAgICAgICAgICAgICAgICdvcmRlcicsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcy9ieS9vcmRlcicsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ25ld19vcmRlcicsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbF9vcmRlcicsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbF9vcmRlcnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3BheW1lbnQnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnYWRkcmVzcy97Y3VycmVuY3l9JyxcbiAgICAgICAgICAgICAgICAndHJhbnNhY3Rpb25zJyxcbiAgICAgICAgICAgICAgICAndHJhbnNhY3Rpb25zL3t0cmFuc2FjdGlvbn0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICd0cmFuc2Zlcl90b190cmFkaW5nJyxcbiAgICAgICAgICAgICAgICAndHJhbnNmZXJfdG9fbWFpbicsXG4gICAgICAgICAgICAgICAgJ2FkZHJlc3Mve2N1cnJlbmN5fScsXG4gICAgICAgICAgICAgICAgJ3BheW91dCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFN5bWJvbHMgKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9kdWN0c1snc3ltYm9scyddLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzWydzeW1ib2xzJ11bcF07XG4gICAgICAgICAgICBsZXQgaWQgPSBwcm9kdWN0WydzeW1ib2wnXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gcHJvZHVjdFsnY29tbW9kaXR5J107XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBwcm9kdWN0WydjdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhZGluZ0dldEJhbGFuY2UgKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFN5bWJvbE9yZGVyYm9vayAoe1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCB0aWNrZXIgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFN5bWJvbFRpY2tlciAoe1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aWNrZXJbJ3RpbWVzdGFtcCddO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoaWdoJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93J10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYmlkJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnYXNrJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHBhcnNlRmxvYXQgKHRpY2tlclsnb3BlbiddKSxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sdW1lJ10pLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWVfcXVvdGUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0U3ltYm9sVHJhZGVzICh7XG4gICAgICAgICAgICAnc3ltYm9sJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdjbGllbnRPcmRlcklkJzogdGhpcy5ub25jZSAoKSxcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnc2lkZSc6IHNpZGUsXG4gICAgICAgICAgICAncXVhbnRpdHknOiBhbW91bnQsXG4gICAgICAgICAgICAndHlwZSc6IHR5cGUsICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdsaW1pdCcpXG4gICAgICAgICAgICBvcmRlclsncHJpY2UnXSA9IHByaWNlO1xuICAgICAgICByZXR1cm4gdGhpcy50cmFkaW5nUG9zdE5ld09yZGVyICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gJy9hcGkvJyArIHRoaXMudmVyc2lvbiArICcvJyArIHR5cGUgKyAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcyk7XG4gICAgICAgIGxldCBxdWVyeSA9IHRoaXMub21pdCAocGFyYW1zLCB0aGlzLmV4dHJhY3RQYXJhbXMgKHBhdGgpKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7ICdub25jZSc6IG5vbmNlLCAnYXBpa2V5JzogdGhpcy5hcGlLZXkgfSwgcXVlcnkpO1xuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PSAnUE9TVCcpXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChxdWVyeSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICdYLVNpZ25hdHVyZSc6IHRoaXMuaG1hYyAodXJsICsgKGJvZHkgfHwgJycpLCB0aGlzLnNlY3JldCwgJ3NoYTUxMicpLnRvTG93ZXJDYXNlICgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgdXJsO1xuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGh1b2JpID0ge1xuXG4gICAgJ2lkJzogJ2h1b2JpJyxcbiAgICAnbmFtZSc6ICdIdW9iaScsXG4gICAgJ2NvdW50cmllcyc6ICdDTicsXG4gICAgJ3JhdGVMaW1pdCc6IDUwMDAsXG4gICAgJ3ZlcnNpb24nOiAndjMnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NTY5LTE1YWE3YjlhLTVlZGQtMTFlNy05ZTdmLTQ0NzkxZjRlZTQ5Yy5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHA6Ly9hcGkuaHVvYmkuY29tJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy5odW9iaS5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9odW9iaWFwaS9BUElfRG9jc19lbi93aWtpJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdzdGF0aWNtYXJrZXQnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICd7aWR9X2tsaW5lX3twZXJpb2R9JyxcbiAgICAgICAgICAgICAgICAndGlja2VyX3tpZH0nLFxuICAgICAgICAgICAgICAgICdkZXB0aF97aWR9JyxcbiAgICAgICAgICAgICAgICAnZGVwdGhfe2lkfV97bGVuZ3RofScsXG4gICAgICAgICAgICAgICAgJ2RldGFpbF97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICd1c2RtYXJrZXQnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICd7aWR9X2tsaW5lX3twZXJpb2R9JyxcbiAgICAgICAgICAgICAgICAndGlja2VyX3tpZH0nLFxuICAgICAgICAgICAgICAgICdkZXB0aF97aWR9JyxcbiAgICAgICAgICAgICAgICAnZGVwdGhfe2lkfV97bGVuZ3RofScsXG4gICAgICAgICAgICAgICAgJ2RldGFpbF97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICd0cmFkZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdnZXRfYWNjb3VudF9pbmZvJyxcbiAgICAgICAgICAgICAgICAnZ2V0X29yZGVycycsXG4gICAgICAgICAgICAgICAgJ29yZGVyX2luZm8nLFxuICAgICAgICAgICAgICAgICdidXknLFxuICAgICAgICAgICAgICAgICdzZWxsJyxcbiAgICAgICAgICAgICAgICAnYnV5X21hcmtldCcsXG4gICAgICAgICAgICAgICAgJ3NlbGxfbWFya2V0JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX29yZGVyJyxcbiAgICAgICAgICAgICAgICAnZ2V0X25ld19kZWFsX29yZGVycycsXG4gICAgICAgICAgICAgICAgJ2dldF9vcmRlcl9pZF9ieV90cmFkZV9pZCcsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3X2NvaW4nLFxuICAgICAgICAgICAgICAgICdjYW5jZWxfd2l0aGRyYXdfY29pbicsXG4gICAgICAgICAgICAgICAgJ2dldF93aXRoZHJhd19jb2luX3Jlc3VsdCcsXG4gICAgICAgICAgICAgICAgJ3RyYW5zZmVyJyxcbiAgICAgICAgICAgICAgICAnbG9hbicsXG4gICAgICAgICAgICAgICAgJ3JlcGF5bWVudCcsXG4gICAgICAgICAgICAgICAgJ2dldF9sb2FuX2F2YWlsYWJsZScsXG4gICAgICAgICAgICAgICAgJ2dldF9sb2FucycsXG4gICAgICAgICAgICBdLCAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgJ3Byb2R1Y3RzJzoge1xuICAgICAgICAnQlRDL0NOWSc6IHsgJ2lkJzogJ2J0YycsICdzeW1ib2wnOiAnQlRDL0NOWScsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDTlknLCAndHlwZSc6ICdzdGF0aWNtYXJrZXQnLCAnY29pblR5cGUnOiAxLCB9LFxuICAgICAgICAnTFRDL0NOWSc6IHsgJ2lkJzogJ2x0YycsICdzeW1ib2wnOiAnTFRDL0NOWScsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdDTlknLCAndHlwZSc6ICdzdGF0aWNtYXJrZXQnLCAnY29pblR5cGUnOiAyLCB9LFxuICAgICAgICAnQlRDL1VTRCc6IHsgJ2lkJzogJ2J0YycsICdzeW1ib2wnOiAnQlRDL1VTRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdVU0QnLCAndHlwZSc6ICd1c2RtYXJrZXQnLCAgICAnY29pblR5cGUnOiAxLCB9LFxuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFkZVBvc3RHZXRBY2NvdW50SW5mbyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgbWV0aG9kID0gcFsndHlwZSddICsgJ0dldERlcHRoSWQnO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdICh7ICdpZCc6IHBbJ2lkJ10gfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IG1ldGhvZCA9IHBbJ3R5cGUnXSArICdHZXRUaWNrZXJJZCc7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXNbbWV0aG9kXSAoeyAnaWQnOiBwWydpZCddIH0pO1xuICAgICAgICBsZXQgdGlja2VyID0gcmVzcG9uc2VbJ3RpY2tlciddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyc2VJbnQgKHJlc3BvbnNlWyd0aW1lJ10pICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGwnXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAodGlja2VyWydvcGVuJ10pLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2wnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgbWV0aG9kID0gcFsndHlwZSddICsgJ0dldERldGFpbElkJztcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kXSAoeyAnaWQnOiBwWydpZCddIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgbWV0aG9kID0gJ3RyYWRlUG9zdCcgKyB0aGlzLmNhcGl0YWxpemUgKHNpZGUpO1xuICAgICAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgICAgICAnY29pbl90eXBlJzogcFsnY29pblR5cGUnXSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgICAgICAnbWFya2V0JzogcFsncXVvdGUnXS50b0xvd2VyQ2FzZSAoKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2xpbWl0JylcbiAgICAgICAgICAgIG9yZGVyWydwcmljZSddID0gcHJpY2U7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1ldGhvZCArPSB0aGlzLmNhcGl0YWxpemUgKHR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3RyYWRlJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddO1xuICAgICAgICBpZiAodHlwZSA9PSAndHJhZGUnKSB7XG4gICAgICAgICAgICB1cmwgKz0gJy9hcGknICsgdGhpcy52ZXJzaW9uO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5rZXlzb3J0ICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgICAgICdtZXRob2QnOiBwYXRoLFxuICAgICAgICAgICAgICAgICdhY2Nlc3Nfa2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZWQnOiB0aGlzLm5vbmNlICgpLFxuICAgICAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSB0aGlzLnVybGVuY29kZSAodGhpcy5vbWl0IChxdWVyeSwgJ21hcmtldCcpKTtcbiAgICAgICAgICAgIC8vIHNlY3JldCBrZXkgbXVzdCBiZSBhdCB0aGUgZW5kIG9mIHF1ZXJ5IHRvIGJlIHNpZ25lZFxuICAgICAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZzZWNyZXRfa2V5PScgKyB0aGlzLnNlY3JldDtcbiAgICAgICAgICAgIHF1ZXJ5WydzaWduJ10gPSB0aGlzLmhhc2ggKHF1ZXJ5U3RyaW5nKTtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsICs9ICcvJyArIHR5cGUgKyAnLycgKyB0aGlzLmltcGxvZGVQYXJhbXMgKHBhdGgsIHBhcmFtcykgKyAnX2pzb24uanMnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIganViaSA9IHtcblxuICAgICdpZCc6ICdqdWJpJyxcbiAgICAnbmFtZSc6ICdqdWJpLmNvbScsXG4gICAgJ2NvdW50cmllcyc6ICdDTicsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsXG4gICAgJ3ZlcnNpb24nOiAndjEnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NTgxLTlkMzk3ZDlhLTVlZGQtMTFlNy04ZmI5LTVkODIzNmMwZTY5Mi5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vd3d3Lmp1YmkuY29tL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cuanViaS5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vd3d3Lmp1YmkuY29tL2hlbHAvYXBpLmh0bWwnLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2RlcHRoJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAndGlja2VyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2JhbGFuY2UnLFxuICAgICAgICAgICAgICAgICd0cmFkZV9hZGQnLFxuICAgICAgICAgICAgICAgICd0cmFkZV9jYW5jZWwnLFxuICAgICAgICAgICAgICAgICd0cmFkZV9saXN0JyxcbiAgICAgICAgICAgICAgICAndHJhZGVfdmlldycsXG4gICAgICAgICAgICAgICAgJ3dhbGxldCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgJ3Byb2R1Y3RzJzoge1xuICAgICAgICAnQlRDL0NOWSc6ICB7ICdpZCc6ICdidGMnLCAgJ3N5bWJvbCc6ICdCVEMvQ05ZJywgICdiYXNlJzogJ0JUQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRVRIL0NOWSc6ICB7ICdpZCc6ICdldGgnLCAgJ3N5bWJvbCc6ICdFVEgvQ05ZJywgICdiYXNlJzogJ0VUSCcsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnQU5TL0NOWSc6ICB7ICdpZCc6ICdhbnMnLCAgJ3N5bWJvbCc6ICdBTlMvQ05ZJywgICdiYXNlJzogJ0FOUycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnQkxLL0NOWSc6ICB7ICdpZCc6ICdibGsnLCAgJ3N5bWJvbCc6ICdCTEsvQ05ZJywgICdiYXNlJzogJ0JMSycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRE5DL0NOWSc6ICB7ICdpZCc6ICdkbmMnLCAgJ3N5bWJvbCc6ICdETkMvQ05ZJywgICdiYXNlJzogJ0ROQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRE9HRS9DTlknOiB7ICdpZCc6ICdkb2dlJywgJ3N5bWJvbCc6ICdET0dFL0NOWScsICdiYXNlJzogJ0RPR0UnLCAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRUFDL0NOWSc6ICB7ICdpZCc6ICdlYWMnLCAgJ3N5bWJvbCc6ICdFQUMvQ05ZJywgICdiYXNlJzogJ0VBQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRVRDL0NOWSc6ICB7ICdpZCc6ICdldGMnLCAgJ3N5bWJvbCc6ICdFVEMvQ05ZJywgICdiYXNlJzogJ0VUQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnRlovQ05ZJzogICB7ICdpZCc6ICdmeicsICAgJ3N5bWJvbCc6ICdGWi9DTlknLCAgICdiYXNlJzogJ0ZaJywgICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnR09PQy9DTlknOiB7ICdpZCc6ICdnb29jJywgJ3N5bWJvbCc6ICdHT09DL0NOWScsICdiYXNlJzogJ0dPT0MnLCAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnR0FNRS9DTlknOiB7ICdpZCc6ICdnYW1lJywgJ3N5bWJvbCc6ICdHQU1FL0NOWScsICdiYXNlJzogJ0dBTUUnLCAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnSExCL0NOWSc6ICB7ICdpZCc6ICdobGInLCAgJ3N5bWJvbCc6ICdITEIvQ05ZJywgICdiYXNlJzogJ0hMQicsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnSUZDL0NOWSc6ICB7ICdpZCc6ICdpZmMnLCAgJ3N5bWJvbCc6ICdJRkMvQ05ZJywgICdiYXNlJzogJ0lGQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnSkJDL0NOWSc6ICB7ICdpZCc6ICdqYmMnLCAgJ3N5bWJvbCc6ICdKQkMvQ05ZJywgICdiYXNlJzogJ0pCQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnS1RDL0NOWSc6ICB7ICdpZCc6ICdrdGMnLCAgJ3N5bWJvbCc6ICdLVEMvQ05ZJywgICdiYXNlJzogJ0tUQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTEtDL0NOWSc6ICB7ICdpZCc6ICdsa2MnLCAgJ3N5bWJvbCc6ICdMS0MvQ05ZJywgICdiYXNlJzogJ0xLQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTFNLL0NOWSc6ICB7ICdpZCc6ICdsc2snLCAgJ3N5bWJvbCc6ICdMU0svQ05ZJywgICdiYXNlJzogJ0xTSycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTFRDL0NOWSc6ICB7ICdpZCc6ICdsdGMnLCAgJ3N5bWJvbCc6ICdMVEMvQ05ZJywgICdiYXNlJzogJ0xUQycsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTUFYL0NOWSc6ICB7ICdpZCc6ICdtYXgnLCAgJ3N5bWJvbCc6ICdNQVgvQ05ZJywgICdiYXNlJzogJ01BWCcsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTUVUL0NOWSc6ICB7ICdpZCc6ICdtZXQnLCAgJ3N5bWJvbCc6ICdNRVQvQ05ZJywgICdiYXNlJzogJ01FVCcsICAncXVvdGUnOiAnQ05ZJyB9LFxuICAgICAgICAnTVJZQy9DTlknOiB7ICdpZCc6ICdtcnljJywgJ3N5bWJvbCc6ICdNUllDL0NOWScsICdiYXNlJzogJ01SWUMnLCAncXVvdGUnOiAnQ05ZJyB9LCAgICAgICAgXG4gICAgICAgICdNVEMvQ05ZJzogIHsgJ2lkJzogJ210YycsICAnc3ltYm9sJzogJ01UQy9DTlknLCAgJ2Jhc2UnOiAnTVRDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdOWFQvQ05ZJzogIHsgJ2lkJzogJ254dCcsICAnc3ltYm9sJzogJ05YVC9DTlknLCAgJ2Jhc2UnOiAnTlhUJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdQRUIvQ05ZJzogIHsgJ2lkJzogJ3BlYicsICAnc3ltYm9sJzogJ1BFQi9DTlknLCAgJ2Jhc2UnOiAnUEVCJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdQR0MvQ05ZJzogIHsgJ2lkJzogJ3BnYycsICAnc3ltYm9sJzogJ1BHQy9DTlknLCAgJ2Jhc2UnOiAnUEdDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdQTEMvQ05ZJzogIHsgJ2lkJzogJ3BsYycsICAnc3ltYm9sJzogJ1BMQy9DTlknLCAgJ2Jhc2UnOiAnUExDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdQUEMvQ05ZJzogIHsgJ2lkJzogJ3BwYycsICAnc3ltYm9sJzogJ1BQQy9DTlknLCAgJ2Jhc2UnOiAnUFBDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdRRUMvQ05ZJzogIHsgJ2lkJzogJ3FlYycsICAnc3ltYm9sJzogJ1FFQy9DTlknLCAgJ2Jhc2UnOiAnUUVDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdSSU8vQ05ZJzogIHsgJ2lkJzogJ3JpbycsICAnc3ltYm9sJzogJ1JJTy9DTlknLCAgJ2Jhc2UnOiAnUklPJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdSU1MvQ05ZJzogIHsgJ2lkJzogJ3JzcycsICAnc3ltYm9sJzogJ1JTUy9DTlknLCAgJ2Jhc2UnOiAnUlNTJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdTS1QvQ05ZJzogIHsgJ2lkJzogJ3NrdCcsICAnc3ltYm9sJzogJ1NLVC9DTlknLCAgJ2Jhc2UnOiAnU0tUJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdURkMvQ05ZJzogIHsgJ2lkJzogJ3RmYycsICAnc3ltYm9sJzogJ1RGQy9DTlknLCAgJ2Jhc2UnOiAnVEZDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdWUkMvQ05ZJzogIHsgJ2lkJzogJ3ZyYycsICAnc3ltYm9sJzogJ1ZSQy9DTlknLCAgJ2Jhc2UnOiAnVlJDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdWVEMvQ05ZJzogIHsgJ2lkJzogJ3Z0YycsICAnc3ltYm9sJzogJ1ZUQy9DTlknLCAgJ2Jhc2UnOiAnVlRDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdXREMvQ05ZJzogIHsgJ2lkJzogJ3dkYycsICAnc3ltYm9sJzogJ1dEQy9DTlknLCAgJ2Jhc2UnOiAnV0RDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdYQVMvQ05ZJzogIHsgJ2lkJzogJ3hhcycsICAnc3ltYm9sJzogJ1hBUy9DTlknLCAgJ2Jhc2UnOiAnWEFTJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdYUE0vQ05ZJzogIHsgJ2lkJzogJ3hwbScsICAnc3ltYm9sJzogJ1hQTS9DTlknLCAgJ2Jhc2UnOiAnWFBNJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdYUlAvQ05ZJzogIHsgJ2lkJzogJ3hycCcsICAnc3ltYm9sJzogJ1hSUC9DTlknLCAgJ2Jhc2UnOiAnWFJQJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdYU0dTL0NOWSc6IHsgJ2lkJzogJ3hzZ3MnLCAnc3ltYm9sJzogJ1hTR1MvQ05ZJywgJ2Jhc2UnOiAnWFNHUycsICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdZVEMvQ05ZJzogIHsgJ2lkJzogJ3l0YycsICAnc3ltYm9sJzogJ1lUQy9DTlknLCAgJ2Jhc2UnOiAnWVRDJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdaRVQvQ05ZJzogIHsgJ2lkJzogJ3pldCcsICAnc3ltYm9sJzogJ1pFVC9DTlknLCAgJ2Jhc2UnOiAnWkVUJywgICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdaQ0MvQ05ZJzogIHsgJ2lkJzogJ3pjYycsICAnc3ltYm9sJzogJ1pDQy9DTlknLCAgJ2Jhc2UnOiAnWkNDJywgICdxdW90ZSc6ICdDTlknIH0sICAgICAgICBcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXREZXB0aCAoe1xuICAgICAgICAgICAgJ2NvaW4nOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgdGlja2VyID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXIgKHsgXG4gICAgICAgICAgICAnY29pbic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGwnXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2wnXSksXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlcnMgKHtcbiAgICAgICAgICAgICdjb2luJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0VHJhZGVBZGQgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LFxuICAgICAgICAgICAgJ3ByaWNlJzogcHJpY2UsXG4gICAgICAgICAgICAndHlwZSc6IHNpZGUsXG4gICAgICAgICAgICAnY29pbic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgcGF0aDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHsgIFxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpLnRvU3RyaW5nICgpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICAgICAna2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ25vbmNlJzogbm9uY2UsXG4gICAgICAgICAgICB9LCBwYXJhbXMpO1xuICAgICAgICAgICAgcXVlcnlbJ3NpZ25hdHVyZSddID0gdGhpcy5obWFjICh0aGlzLnVybGVuY29kZSAocXVlcnkpLCB0aGlzLmhhc2ggKHRoaXMuc2VjcmV0KSk7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGJvZHkubGVuZ3RoLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGtyYWtlbiBpcyBhbHNvIG93bmVyIG9mIGV4LiBDb2luc2V0dGVyIC8gQ2FWaXJ0RXggLyBDbGV2ZXJjb2luXG5cbnZhciBrcmFrZW4gPSB7XG5cbiAgICAnaWQnOiAna3Jha2VuJyxcbiAgICAnbmFtZSc6ICdLcmFrZW4nLFxuICAgICdjb3VudHJpZXMnOiAnVVMnLFxuICAgICd2ZXJzaW9uJzogJzAnLFxuICAgICdyYXRlTGltaXQnOiAzMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NTk5LTIyNzA5MzA0LTVlZGUtMTFlNy05ZGUxLTlmMzM3MzJlMTUwOS5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vYXBpLmtyYWtlbi5jb20nLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LmtyYWtlbi5jb20nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmtyYWtlbi5jb20vZW4tdXMvaGVscC9hcGknLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9ub3RoaW5naXNkZWFkL25wbS1rcmFrZW4tYXBpJyxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdBc3NldHMnLFxuICAgICAgICAgICAgICAgICdBc3NldFBhaXJzJyxcbiAgICAgICAgICAgICAgICAnRGVwdGgnLFxuICAgICAgICAgICAgICAgICdPSExDJyxcbiAgICAgICAgICAgICAgICAnU3ByZWFkJyxcbiAgICAgICAgICAgICAgICAnVGlja2VyJyxcbiAgICAgICAgICAgICAgICAnVGltZScsXG4gICAgICAgICAgICAgICAgJ1RyYWRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAncHJpdmF0ZSc6IHtcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdBZGRPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0JhbGFuY2UnLFxuICAgICAgICAgICAgICAgICdDYW5jZWxPcmRlcicsXG4gICAgICAgICAgICAgICAgJ0Nsb3NlZE9yZGVycycsXG4gICAgICAgICAgICAgICAgJ0RlcG9zaXRBZGRyZXNzZXMnLFxuICAgICAgICAgICAgICAgICdEZXBvc2l0TWV0aG9kcycsXG4gICAgICAgICAgICAgICAgJ0RlcG9zaXRTdGF0dXMnLFxuICAgICAgICAgICAgICAgICdMZWRnZXJzJyxcbiAgICAgICAgICAgICAgICAnT3Blbk9yZGVycycsXG4gICAgICAgICAgICAgICAgJ09wZW5Qb3NpdGlvbnMnLCBcbiAgICAgICAgICAgICAgICAnUXVlcnlMZWRnZXJzJywgXG4gICAgICAgICAgICAgICAgJ1F1ZXJ5T3JkZXJzJywgXG4gICAgICAgICAgICAgICAgJ1F1ZXJ5VHJhZGVzJyxcbiAgICAgICAgICAgICAgICAnVHJhZGVCYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnVHJhZGVzSGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ1RyYWRlVm9sdW1lJyxcbiAgICAgICAgICAgICAgICAnV2l0aGRyYXcnLFxuICAgICAgICAgICAgICAgICdXaXRoZHJhd0NhbmNlbCcsIFxuICAgICAgICAgICAgICAgICdXaXRoZHJhd0luZm8nLCAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJ1dpdGhkcmF3U3RhdHVzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldEFzc2V0UGFpcnMgKCk7XG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMgKHByb2R1Y3RzWydyZXN1bHQnXSk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBrZXlzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSBrZXlzW3BdO1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1sncmVzdWx0J11baWRdO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSBwcm9kdWN0WydiYXNlJ107XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBwcm9kdWN0WydxdW90ZSddO1xuICAgICAgICAgICAgaWYgKChiYXNlWzBdID09ICdYJykgfHwgKGJhc2VbMF0gPT0gJ1onKSlcbiAgICAgICAgICAgICAgICBiYXNlID0gYmFzZS5zbGljZSAoMSk7XG4gICAgICAgICAgICBpZiAoKHF1b3RlWzBdID09ICdYJykgfHwgKHF1b3RlWzBdID09ICdaJykpXG4gICAgICAgICAgICAgICAgcXVvdGUgPSBxdW90ZS5zbGljZSAoMSk7XG4gICAgICAgICAgICBiYXNlID0gdGhpcy5jb21tb25DdXJyZW5jeUNvZGUgKGJhc2UpO1xuICAgICAgICAgICAgcXVvdGUgPSB0aGlzLmNvbW1vbkN1cnJlbmN5Q29kZSAocXVvdGUpO1xuICAgICAgICAgICAgbGV0IGRhcmtwb29sID0gaWQuaW5kZXhPZiAoJy5kJykgPj0gMDtcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBkYXJrcG9vbCA/IHByb2R1Y3RbJ2FsdG5hbWUnXSA6IChiYXNlICsgJy8nICsgcXVvdGUpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXREZXB0aCAgKHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLnByb2R1Y3QgKHByb2R1Y3QpO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRpY2tlciAoe1xuICAgICAgICAgICAgJ3BhaXInOiBwWydpZCddLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpY2tlciA9IHJlc3BvbnNlWydyZXN1bHQnXVtwWydpZCddXTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubWlsbGlzZWNvbmRzICgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogcGFyc2VGbG9hdCAodGlja2VyWydoJ11bMV0pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbCddWzFdKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2InXVswXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhJ11bMF0pLFxuICAgICAgICAgICAgJ3Z3YXAnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3AnXVsxXSksXG4gICAgICAgICAgICAnb3Blbic6IHBhcnNlRmxvYXQgKHRpY2tlclsnbyddKSxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydjJ11bMF0pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndiddWzFdKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFkZXMgKHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgbGV0IG9yZGVyID0ge1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAndHlwZSc6IHNpZGUsXG4gICAgICAgICAgICAnb3JkZXJ0eXBlJzogdHlwZSxcbiAgICAgICAgICAgICd2b2x1bWUnOiBhbW91bnQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09ICdsaW1pdCcpXG4gICAgICAgICAgICBvcmRlclsncHJpY2UnXSA9IHByaWNlO1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEFkZE9yZGVyICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkgeyAgXG4gICAgICAgIGxldCB1cmwgPSAnLycgKyB0aGlzLnZlcnNpb24gKyAnLycgKyB0eXBlICsgJy8nICsgcGF0aDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocGFyYW1zKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKS50b1N0cmluZyAoKTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7ICdub25jZSc6IG5vbmNlIH0sIHBhcmFtcyk7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHF1ZXJ5KTtcbiAgICAgICAgICAgIHF1ZXJ5ID0gdGhpcy5zdHJpbmdUb0JpbmFyeSAodXJsICsgdGhpcy5oYXNoIChub25jZSArIGJvZHksICdzaGEyNTYnLCAnYmluYXJ5JykpO1xuICAgICAgICAgICAgbGV0IHNlY3JldCA9IHRoaXMuYmFzZTY0VG9CaW5hcnkgKHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0FQSS1LZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnQVBJLVNpZ24nOiB0aGlzLmhtYWMgKHF1ZXJ5LCBzZWNyZXQsICdzaGE1MTInLCAnYmFzZTY0JyksXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgdXJsO1xuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGx1bm8gPSB7XG5cbiAgICAnaWQnOiAnbHVubycsXG4gICAgJ25hbWUnOiAnbHVubycsXG4gICAgJ2NvdW50cmllcyc6IFsgJ1VLJywgJ1NHJywgJ1pBJywgXSxcbiAgICAncmF0ZUxpbWl0JzogNTAwMCxcbiAgICAndmVyc2lvbic6ICcxJyxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjYwNy04YzFhNjlkOC01ZWRlLTExZTctOTMwYy01NDBiNWViOWJlMjQuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2FwaS5teWJpdHguY29tL2FwaScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cubHVuby5jb20nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vbnBtanMub3JnL3BhY2thZ2UvYml0eCcsXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2JhdXNtZWllci9ub2RlLWJpdHgnLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ29yZGVyYm9vaycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcnMnLFxuICAgICAgICAgICAgICAgICd0cmFkZXMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdhY2NvdW50cy97aWR9L3BlbmRpbmcnLFxuICAgICAgICAgICAgICAgICdhY2NvdW50cy97aWR9L3RyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgJ2JhbGFuY2UnLFxuICAgICAgICAgICAgICAgICdmZWVfaW5mbycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRpbmdfYWRkcmVzcycsXG4gICAgICAgICAgICAgICAgJ2xpc3RvcmRlcnMnLFxuICAgICAgICAgICAgICAgICdsaXN0dHJhZGVzJyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdxdW90ZXMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3YWxzJyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdhbHMve2lkfScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2FjY291bnRzJyxcbiAgICAgICAgICAgICAgICAncG9zdG9yZGVyJyxcbiAgICAgICAgICAgICAgICAnbWFya2V0b3JkZXInLFxuICAgICAgICAgICAgICAgICdzdG9wb3JkZXInLFxuICAgICAgICAgICAgICAgICdmdW5kaW5nX2FkZHJlc3MnLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd2FscycsXG4gICAgICAgICAgICAgICAgJ3NlbmQnLFxuICAgICAgICAgICAgICAgICdxdW90ZXMnLFxuICAgICAgICAgICAgICAgICdvYXV0aDIvZ3JhbnQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwdXQnOiBbXG4gICAgICAgICAgICAgICAgJ3F1b3Rlcy97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnZGVsZXRlJzogW1xuICAgICAgICAgICAgICAgICdxdW90ZXMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3YWxzL3tpZH0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hQcm9kdWN0cyAoKSB7XG4gICAgICAgIGxldCBwcm9kdWN0cyA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VycyAoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb2R1Y3RzWyd0aWNrZXJzJ10ubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ3RpY2tlcnMnXVtwXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ3BhaXInXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gaWQuc2xpY2UgKDAsIDMpO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gaWQuc2xpY2UgKDMsIDYpO1xuICAgICAgICAgICAgYmFzZSA9IHRoaXMuY29tbW9uQ3VycmVuY3lDb2RlIChiYXNlKTtcbiAgICAgICAgICAgIHF1b3RlID0gdGhpcy5jb21tb25DdXJyZW5jeUNvZGUgKHF1b3RlKTtcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBiYXNlICsgJy8nICsgcXVvdGU7XG4gICAgICAgICAgICByZXN1bHQucHVzaCAoe1xuICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgJ2Jhc2UnOiBiYXNlLFxuICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVHZXRCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlcmJvb2sgKHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHRpY2tlciA9IGF3YWl0IHRoaXMucHVibGljR2V0VGlja2VyICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aWNrZXJbJ3RpbWVzdGFtcCddO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICdkYXRldGltZSc6IHRoaXMuaXNvODYwMSAodGltZXN0YW1wKSxcbiAgICAgICAgICAgICdoaWdoJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xvdyc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdF90cmFkZSddKSxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3JvbGxpbmdfMjRfaG91cl92b2x1bWUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2QgPSAncHJpdmF0ZVBvc3QnO1xuICAgICAgICBsZXQgb3JkZXIgPSB7ICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpIH07XG4gICAgICAgIGlmICh0eXBlID09ICdtYXJrZXQnKSB7XG4gICAgICAgICAgICBtZXRob2QgKz0gJ01hcmtldG9yZGVyJztcbiAgICAgICAgICAgIG9yZGVyWyd0eXBlJ10gPSBzaWRlLnRvVXBwZXJDYXNlICgpO1xuICAgICAgICAgICAgaWYgKHNpZGUgPT0gJ2J1eScpXG4gICAgICAgICAgICAgICAgb3JkZXJbJ2NvdW50ZXJfdm9sdW1lJ10gPSBhbW91bnQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3JkZXJbJ2Jhc2Vfdm9sdW1lJ10gPSBhbW91bnQ7ICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRob2QgKz0gJ09yZGVyJztcbiAgICAgICAgICAgIG9yZGVyWyd2b2x1bWUnXSA9IGFtb3VudDtcbiAgICAgICAgICAgIG9yZGVyWydwcmljZSddID0gcHJpY2U7XG4gICAgICAgICAgICBpZiAoc2lkZSA9PSAnYnV5JylcbiAgICAgICAgICAgICAgICBvcmRlclsndHlwZSddID0gJ0JJRCc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3JkZXJbJ3R5cGUnXSA9ICdBU0snO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZF0gKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICBpZiAodHlwZSA9PSAncHJpdmF0ZScpIHtcbiAgICAgICAgICAgIGxldCBhdXRoID0gdGhpcy5zdHJpbmdUb0Jhc2U2NCAodGhpcy5hcGlLZXkgKyAnOicgKyB0aGlzLnNlY3JldCk7XG4gICAgICAgICAgICBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6ICdCYXNpYyAnICsgYXV0aCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT0tDb2luIFxuLy8gQ2hpbmFcbi8vIGh0dHBzOi8vd3d3Lm9rY29pbi5jb20vXG4vLyBodHRwczovL3d3dy5va2NvaW4uY29tL3Jlc3RfZ2V0U3RhcnRlZC5odG1sXG4vLyBodHRwczovL2dpdGh1Yi5jb20vT0tDb2luL3dlYnNvY2tldFxuLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvb2tjb2luLmNvbVxuLy8gaHR0cHM6Ly93d3cub2tjb2luLmNuXG4vLyBodHRwczovL3d3dy5va2NvaW4uY24vcmVzdF9nZXRTdGFydGVkLmh0bWxcblxudmFyIG9rY29pbiA9IHtcblxuICAgICd2ZXJzaW9uJzogJ3YxJyxcbiAgICAncmF0ZUxpbWl0JzogMjAwMCwgLy8gdXAgdG8gMzAwMCByZXF1ZXN0cyBwZXIgNSBtaW51dGVzIOKJiCA2MDAgcmVxdWVzdHMgcGVyIG1pbnV0ZSDiiYggMTAgcmVxdWVzdHMgcGVyIHNlY29uZCDiiYggMTAwIG1zXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2RlcHRoJyxcbiAgICAgICAgICAgICAgICAnZXhjaGFuZ2VfcmF0ZScsXG4gICAgICAgICAgICAgICAgJ2Z1dHVyZV9kZXB0aCcsXG4gICAgICAgICAgICAgICAgJ2Z1dHVyZV9lc3RpbWF0ZWRfcHJpY2UnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfaG9sZF9hbW91bnQnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfaW5kZXgnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfa2xpbmUnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfcHJpY2VfbGltaXQnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfdGlja2VyJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX3RyYWRlcycsXG4gICAgICAgICAgICAgICAgJ2tsaW5lJyxcbiAgICAgICAgICAgICAgICAnb3RjcycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcycsICAgIFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9yZWNvcmRzJyxcbiAgICAgICAgICAgICAgICAnYmF0Y2hfdHJhZGUnLFxuICAgICAgICAgICAgICAgICdib3Jyb3dfbW9uZXknLFxuICAgICAgICAgICAgICAgICdib3Jyb3dfb3JkZXJfaW5mbycsXG4gICAgICAgICAgICAgICAgJ2JvcnJvd3NfaW5mbycsXG4gICAgICAgICAgICAgICAgJ2NhbmNlbF9ib3Jyb3cnLFxuICAgICAgICAgICAgICAgICdjYW5jZWxfb3JkZXInLFxuICAgICAgICAgICAgICAgICdjYW5jZWxfb3RjX29yZGVyJyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX3dpdGhkcmF3JyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX2JhdGNoX3RyYWRlJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgJ2Z1dHVyZV9kZXZvbHZlJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX2V4cGxvc2l2ZScsXG4gICAgICAgICAgICAgICAgJ2Z1dHVyZV9vcmRlcl9pbmZvJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX29yZGVyc19pbmZvJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAnZnV0dXJlX3Bvc2l0aW9uXzRmaXgnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfdHJhZGUnLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfdHJhZGVzX2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfdXNlcmluZm8nLFxuICAgICAgICAgICAgICAgICdmdXR1cmVfdXNlcmluZm9fNGZpeCcsXG4gICAgICAgICAgICAgICAgJ2xlbmRfZGVwdGgnLFxuICAgICAgICAgICAgICAgICdvcmRlcl9mZWUnLFxuICAgICAgICAgICAgICAgICdvcmRlcl9oaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJfaW5mbycsXG4gICAgICAgICAgICAgICAgJ29yZGVyc19pbmZvJyxcbiAgICAgICAgICAgICAgICAnb3RjX29yZGVyX2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICdvdGNfb3JkZXJfaW5mbycsXG4gICAgICAgICAgICAgICAgJ3JlcGF5bWVudCcsXG4gICAgICAgICAgICAgICAgJ3N1Ym1pdF9vdGNfb3JkZXInLFxuICAgICAgICAgICAgICAgICd0cmFkZScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlX2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICd0cmFkZV9vdGNfb3JkZXInLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhdycsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3X2luZm8nLFxuICAgICAgICAgICAgICAgICd1bnJlcGF5bWVudHNfaW5mbycsXG4gICAgICAgICAgICAgICAgJ3VzZXJpbmZvJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldERlcHRoICh7XG4gICAgICAgICAgICAnc3ltYm9sJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRUaWNrZXIgKHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGlja2VyID0gcmVzcG9uc2VbJ3RpY2tlciddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyc2VJbnQgKHJlc3BvbnNlWydkYXRlJ10pICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2J1eSddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3NlbGwnXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2wnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0VHJhZGVzICh7XG4gICAgICAgICAgICAnc3ltYm9sJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RVc2VyaW5mbyAoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdzeW1ib2wnOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAndHlwZSc6IHNpZGUsXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb3JkZXJbJ3R5cGUnXSArPSAnX21hcmtldCc7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0VHJhZGUgKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSAnL2FwaS8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgcGF0aCArICcuZG8nOyAgIFxuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChwYXJhbXMpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLmtleXNvcnQgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ2FwaV9rZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgIH0sIHBhcmFtcykpO1xuICAgICAgICAgICAgLy8gc2VjcmV0IGtleSBtdXN0IGJlIGF0IHRoZSBlbmQgb2YgcXVlcnlcbiAgICAgICAgICAgIGxldCBxdWVyeVN0cmluZyA9IHRoaXMudXJsZW5jb2RlIChxdWVyeSkgKyAnJnNlY3JldF9rZXk9JyArIHRoaXMuc2VjcmV0O1xuICAgICAgICAgICAgcXVlcnlbJ3NpZ24nXSA9IHRoaXMuaGFzaCAocXVlcnlTdHJpbmcpLnRvVXBwZXJDYXNlICgpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgICAgICBoZWFkZXJzID0geyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfTtcbiAgICAgICAgfVxuICAgICAgICB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgdXJsO1xuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG9rY29pbmNueSA9IGV4dGVuZCAob2tjb2luLCB7XG4gICAgJ2lkJzogJ29rY29pbmNueScsXG4gICAgJ25hbWUnOiAnT0tDb2luIENOWScsXG4gICAgJ2NvdW50cmllcyc6ICdDTicsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY3OTItOGJlOTE1N2EtNWVlNS0xMWU3LTkyNmMtNmQ2OWI4ZDMzNzhkLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cub2tjb2luLmNuJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy5va2NvaW4uY24nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vd3d3Lm9rY29pbi5jbi9yZXN0X2dldFN0YXJ0ZWQuaHRtbCcsXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvQ05ZJzogeyAnaWQnOiAnYnRjX2NueScsICdzeW1ib2wnOiAnQlRDL0NOWScsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDTlknIH0sXG4gICAgICAgICdMVEMvQ05ZJzogeyAnaWQnOiAnbHRjX2NueScsICdzeW1ib2wnOiAnTFRDL0NOWScsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdDTlknIH0sXG4gICAgfSxcbn0pXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG9rY29pbnVzZCA9IGV4dGVuZCAob2tjb2luLCB7XG4gICAgJ2lkJzogJ29rY29pbnVzZCcsXG4gICAgJ25hbWUnOiAnT0tDb2luIFVTRCcsXG4gICAgJ2NvdW50cmllcyc6IFsgJ0NOJywgJ1VTJyBdLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2NzkxLTg5ZmZiNTAyLTVlZTUtMTFlNy04YTViLWM1OTUwYjY4YWM2NS5qcGcnLCAgICAgICAgXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly93d3cub2tjb2luLmNvbScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly93d3cub2tjb2luLmNvbScsXG4gICAgICAgICdkb2MnOiBbXG4gICAgICAgICAgICAnaHR0cHM6Ly93d3cub2tjb2luLmNvbS9yZXN0X2dldFN0YXJ0ZWQuaHRtbCcsXG4gICAgICAgICAgICAnaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvb2tjb2luLmNvbScsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnYnRjX3VzZCcsICdzeW1ib2wnOiAnQlRDL1VTRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgICAgICdMVEMvVVNEJzogeyAnaWQnOiAnbHRjX3VzZCcsICdzeW1ib2wnOiAnTFRDL1VTRCcsICdiYXNlJzogJ0xUQycsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgfSxcbn0pXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBvbG9uaWV4ID0ge1xuXG4gICAgJ2lkJzogJ3BvbG9uaWV4JyxcbiAgICAnbmFtZSc6ICdQb2xvbmlleCcsXG4gICAgJ2NvdW50cmllcyc6ICdVUycsXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsIC8vIDYgY2FsbHMgcGVyIHNlY29uZFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2ODE3LWU5NDU2MzEyLTVlZTYtMTFlNy05YjNjLWI2MjhjYTU2MjZhNS5qcGcnLFxuICAgICAgICAnYXBpJzoge1xuICAgICAgICAgICAgJ3B1YmxpYyc6ICdodHRwczovL3BvbG9uaWV4LmNvbS9wdWJsaWMnLFxuICAgICAgICAgICAgJ3ByaXZhdGUnOiAnaHR0cHM6Ly9wb2xvbmlleC5jb20vdHJhZGluZ0FwaScsXG4gICAgICAgIH0sXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly9wb2xvbmlleC5jb20nLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vcG9sb25pZXguY29tL3N1cHBvcnQvYXBpLycsXG4gICAgICAgICAgICAnaHR0cDovL3Bhc3RlYmluLmNvbS9kTVg3bVpFMCcsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAncmV0dXJuMjRoVm9sdW1lJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuQ2hhcnREYXRhJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuQ3VycmVuY2llcycsXG4gICAgICAgICAgICAgICAgJ3JldHVybkxvYW5PcmRlcnMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5PcmRlckJvb2snLFxuICAgICAgICAgICAgICAgICdyZXR1cm5UaWNrZXInLFxuICAgICAgICAgICAgICAgICdyZXR1cm5UcmFkZUhpc3RvcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnYnV5JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsTG9hbk9mZmVyJyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsT3JkZXInLFxuICAgICAgICAgICAgICAgICdjbG9zZU1hcmdpblBvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAnY3JlYXRlTG9hbk9mZmVyJyxcbiAgICAgICAgICAgICAgICAnZ2VuZXJhdGVOZXdBZGRyZXNzJyxcbiAgICAgICAgICAgICAgICAnZ2V0TWFyZ2luUG9zaXRpb24nLFxuICAgICAgICAgICAgICAgICdtYXJnaW5CdXknLFxuICAgICAgICAgICAgICAgICdtYXJnaW5TZWxsJyxcbiAgICAgICAgICAgICAgICAnbW92ZU9yZGVyJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuQWN0aXZlTG9hbnMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5BdmFpbGFibGVBY2NvdW50QmFsYW5jZXMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5CYWxhbmNlcycsXG4gICAgICAgICAgICAgICAgJ3JldHVybkNvbXBsZXRlQmFsYW5jZXMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5EZXBvc2l0QWRkcmVzc2VzJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuRGVwb3NpdHNXaXRoZHJhd2FscycsXG4gICAgICAgICAgICAgICAgJ3JldHVybkZlZUluZm8nLFxuICAgICAgICAgICAgICAgICdyZXR1cm5MZW5kaW5nSGlzdG9yeScsXG4gICAgICAgICAgICAgICAgJ3JldHVybk1hcmdpbkFjY291bnRTdW1tYXJ5JyxcbiAgICAgICAgICAgICAgICAncmV0dXJuT3BlbkxvYW5PZmZlcnMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5PcGVuT3JkZXJzJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuT3JkZXJUcmFkZXMnLFxuICAgICAgICAgICAgICAgICdyZXR1cm5UcmFkYWJsZUJhbGFuY2VzJyxcbiAgICAgICAgICAgICAgICAncmV0dXJuVHJhZGVIaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAnc2VsbCcsXG4gICAgICAgICAgICAgICAgJ3RvZ2dsZUF1dG9SZW5ldycsXG4gICAgICAgICAgICAgICAgJ3RyYW5zZmVyQmFsYW5jZScsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFJldHVyblRpY2tlciAoKTtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyAocHJvZHVjdHMpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwga2V5cy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IGlkID0ga2V5c1twXTtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbaWRdO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGlkLnJlcGxhY2UgKCdfJywgJy8nKTtcbiAgICAgICAgICAgIGxldCBbIGJhc2UsIHF1b3RlIF0gPSBzeW1ib2wuc3BsaXQgKCcvJyk7XG4gICAgICAgICAgICByZXN1bHQucHVzaCAoe1xuICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICdzeW1ib2wnOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgJ2Jhc2UnOiBiYXNlLFxuICAgICAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0UmV0dXJuQ29tcGxldGVCYWxhbmNlcyAoe1xuICAgICAgICAgICAgJ2FjY291bnQnOiAnYWxsJyxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFJldHVybk9yZGVyQm9vayAoe1xuICAgICAgICAgICAgJ2N1cnJlbmN5UGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IHRpY2tlcnMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFJldHVyblRpY2tlciAoKTtcbiAgICAgICAgbGV0IHRpY2tlciA9IHRpY2tlcnNbcFsnaWQnXV07XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaDI0aHInXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cyNGhyJ10pLFxuICAgICAgICAgICAgJ2JpZCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaGVzdEJpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvd2VzdEFzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjaGFuZ2UnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3BlcmNlbnRDaGFuZ2UnXSksXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2Jhc2VWb2x1bWUnXSksXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3F1b3RlVm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFJldHVyblRyYWRlSGlzdG9yeSAoe1xuICAgICAgICAgICAgJ2N1cnJlbmN5UGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBsZXQgbWV0aG9kID0gJ3ByaXZhdGVQb3N0JyArIHRoaXMuY2FwaXRhbGl6ZSAoc2lkZSk7XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZF0gKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnY3VycmVuY3lQYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3JhdGUnOiBwcmljZSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICBjYW5jZWxPcmRlciAoaWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0Q2FuY2VsT3JkZXIgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnb3JkZXJOdW1iZXInOiBpZCxcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddW3R5cGVdO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLmV4dGVuZCAoeyAnY29tbWFuZCc6IHBhdGggfSwgcGFyYW1zKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnlbJ25vbmNlJ10gPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAnS2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ1NpZ24nOiB0aGlzLmhtYWMgKGJvZHksIHRoaXMuc2VjcmV0LCAnc2hhNTEyJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcXVhZHJpZ2FjeCA9IHtcblxuICAgICdpZCc6ICdxdWFkcmlnYWN4JyxcbiAgICAnbmFtZSc6ICdRdWFkcmlnYUNYJyxcbiAgICAnY291bnRyaWVzJzogJ0NBJyxcbiAgICAncmF0ZUxpbWl0JzogMjAwMCxcbiAgICAndmVyc2lvbic6ICd2MicsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY4MjUtOThhNmQwZGUtNWVlNy0xMWU3LTlmYTQtMzhlMTFhMmM2ZjUyLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9hcGkucXVhZHJpZ2FjeC5jb20nLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LnF1YWRyaWdhY3guY29tJyxcbiAgICAgICAgJ2RvYyc6ICdodHRwczovL3d3dy5xdWFkcmlnYWN4LmNvbS9hcGlfaW5mbycsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnb3JkZXJfYm9vaycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlcicsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICd0cmFuc2FjdGlvbnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnYmFsYW5jZScsXG4gICAgICAgICAgICAgICAgJ2JpdGNvaW5fZGVwb3NpdF9hZGRyZXNzJyxcbiAgICAgICAgICAgICAgICAnYml0Y29pbl93aXRoZHJhd2FsJyxcbiAgICAgICAgICAgICAgICAnYnV5JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsX29yZGVyJyxcbiAgICAgICAgICAgICAgICAnZXRoZXJfZGVwb3NpdF9hZGRyZXNzJyxcbiAgICAgICAgICAgICAgICAnZXRoZXJfd2l0aGRyYXdhbCcsXG4gICAgICAgICAgICAgICAgJ2xvb2t1cF9vcmRlcicsXG4gICAgICAgICAgICAgICAgJ29wZW5fb3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnc2VsbCcsXG4gICAgICAgICAgICAgICAgJ3VzZXJfdHJhbnNhY3Rpb25zJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAncHJvZHVjdHMnOiB7XG4gICAgICAgICdCVEMvQ0FEJzogeyAnaWQnOiAnYnRjX2NhZCcsICdzeW1ib2wnOiAnQlRDL0NBRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdDQUQnIH0sXG4gICAgICAgICdCVEMvVVNEJzogeyAnaWQnOiAnYnRjX3VzZCcsICdzeW1ib2wnOiAnQlRDL1VTRCcsICdiYXNlJzogJ0JUQycsICdxdW90ZSc6ICdVU0QnIH0sXG4gICAgICAgICdFVEgvQlRDJzogeyAnaWQnOiAnZXRoX2J0YycsICdzeW1ib2wnOiAnRVRIL0JUQycsICdiYXNlJzogJ0VUSCcsICdxdW90ZSc6ICdCVEMnIH0sXG4gICAgICAgICdFVEgvQ0FEJzogeyAnaWQnOiAnZXRoX2NhZCcsICdzeW1ib2wnOiAnRVRIL0NBRCcsICdiYXNlJzogJ0VUSCcsICdxdW90ZSc6ICdDQUQnIH0sXG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0QmFsYW5jZSAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0T3JkZXJCb29rICh7XG4gICAgICAgICAgICAnYm9vayc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCB0aWNrZXIgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRpY2tlciAoe1xuICAgICAgICAgICAgJ2Jvb2snOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyc2VJbnQgKHRpY2tlclsndGltZXN0YW1wJ10pICogMTAwMDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2JpZCddKSxcbiAgICAgICAgICAgICdhc2snOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogcGFyc2VGbG9hdCAodGlja2VyWyd2d2FwJ10pLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3ZvbHVtZSddKSxcbiAgICAgICAgICAgICdpbmZvJzogdGlja2VyLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmZXRjaFRyYWRlcyAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRUcmFuc2FjdGlvbnMgKHtcbiAgICAgICAgICAgICdib29rJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2QgPSAncHJpdmF0ZVBvc3QnICsgdGhpcy5jYXBpdGFsaXplIChzaWRlKTsgXG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgICAgICAnYm9vayc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2xpbWl0JylcbiAgICAgICAgICAgIG9yZGVyWydwcmljZSddID0gcHJpY2U7XG4gICAgICAgIHJldHVybiB0aGlzW21ldGhvZF0gKHRoaXMuZXh0ZW5kIChvcmRlciwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIGNhbmNlbE9yZGVyIChpZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RDYW5jZWxPcmRlciAodGhpcy5leHRlbmQgKHsgaWQgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgcGF0aDtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IFsgbm9uY2UsIHRoaXMudWlkLCB0aGlzLmFwaUtleSBdLmpvaW4gKCcnKTtcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSB0aGlzLmhtYWMgKHJlcXVlc3QsIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7IFxuICAgICAgICAgICAgICAgICdrZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSxcbiAgICAgICAgICAgICAgICAnc2lnbmF0dXJlJzogc2lnbmF0dXJlLFxuICAgICAgICAgICAgfSwgcGFyYW1zKTtcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSAocXVlcnkpO1xuICAgICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGJvZHkubGVuZ3RoLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHF1b2luZSA9IHtcblxuICAgICdpZCc6ICdxdW9pbmUnLFxuICAgICduYW1lJzogJ1FVT0lORScsXG4gICAgJ2NvdW50cmllcyc6IFsgJ0pQJywgJ1NHJywgJ1ZOJyBdLFxuICAgICd2ZXJzaW9uJzogJzInLFxuICAgICdyYXRlTGltaXQnOiAyMDAwLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2ODQ0LTk2MTVhNGU4LTVlZTgtMTFlNy04ODE0LWZjZDAwNGRiOGNkZC5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vYXBpLnF1b2luZS5jb20nLFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LnF1b2luZS5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vZGV2ZWxvcGVycy5xdW9pbmUuY29tJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdwcm9kdWN0cycsXG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3RzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdwcm9kdWN0cy97aWR9L3ByaWNlX2xldmVscycsXG4gICAgICAgICAgICAgICAgJ2V4ZWN1dGlvbnMnLFxuICAgICAgICAgICAgICAgICdpcl9sYWRkZXJzL3tjdXJyZW5jeX0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdhY2NvdW50cy9iYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnY3J5cHRvX2FjY291bnRzJyxcbiAgICAgICAgICAgICAgICAnZXhlY3V0aW9ucy9tZScsXG4gICAgICAgICAgICAgICAgJ2ZpYXRfYWNjb3VudHMnLFxuICAgICAgICAgICAgICAgICdsb2FuX2JpZHMnLFxuICAgICAgICAgICAgICAgICdsb2FucycsXG4gICAgICAgICAgICAgICAgJ29yZGVycycsXG4gICAgICAgICAgICAgICAgJ29yZGVycy97aWR9JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL3tpZH0vdHJhZGVzJyxcbiAgICAgICAgICAgICAgICAndHJhZGVzJyxcbiAgICAgICAgICAgICAgICAndHJhZGVzL3tpZH0vbG9hbnMnLFxuICAgICAgICAgICAgICAgICd0cmFkaW5nX2FjY291bnRzJyxcbiAgICAgICAgICAgICAgICAndHJhZGluZ19hY2NvdW50cy97aWR9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnZmlhdF9hY2NvdW50cycsXG4gICAgICAgICAgICAgICAgJ2xvYW5fYmlkcycsXG4gICAgICAgICAgICAgICAgJ29yZGVycycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3B1dCc6IFtcbiAgICAgICAgICAgICAgICAnbG9hbl9iaWRzL3tpZH0vY2xvc2UnLFxuICAgICAgICAgICAgICAgICdsb2Fucy97aWR9JyxcbiAgICAgICAgICAgICAgICAnb3JkZXJzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdvcmRlcnMve2lkfS9jYW5jZWwnLFxuICAgICAgICAgICAgICAgICd0cmFkZXMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlcy97aWR9L2Nsb3NlJyxcbiAgICAgICAgICAgICAgICAndHJhZGVzL2Nsb3NlX2FsbCcsXG4gICAgICAgICAgICAgICAgJ3RyYWRpbmdfYWNjb3VudHMve2lkfScsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRQcm9kdWN0cyAoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb2R1Y3RzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzW3BdO1xuICAgICAgICAgICAgbGV0IGlkID0gcHJvZHVjdFsnaWQnXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gcHJvZHVjdFsnYmFzZV9jdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gcHJvZHVjdFsncXVvdGVkX2N1cnJlbmN5J107XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gYmFzZSArICcvJyArIHF1b3RlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlR2V0QWNjb3VudHNCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRQcm9kdWN0c0lkUHJpY2VMZXZlbHMgKHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCB0aWNrZXIgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFByb2R1Y3RzSWQgKHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaF9tYXJrZXRfYXNrJ10pLFxuICAgICAgICAgICAgJ2xvdyc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbG93X21hcmtldF9iaWQnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydtYXJrZXRfYmlkJ10pLFxuICAgICAgICAgICAgJ2Fzayc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbWFya2V0X2FzayddKSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdF90cmFkZWRfcHJpY2UnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWVfMjRoJ10pLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldEV4ZWN1dGlvbnMgKHtcbiAgICAgICAgICAgICdwcm9kdWN0X2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdvcmRlcl90eXBlJzogdHlwZSxcbiAgICAgICAgICAgICdwcm9kdWN0X2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ3NpZGUnOiBzaWRlLFxuICAgICAgICAgICAgJ3F1YW50aXR5JzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RPcmRlcnMgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnb3JkZXInOiBvcmRlcixcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIGNhbmNlbE9yZGVyIChpZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVB1dE9yZGVyc0lkQ2FuY2VsICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnWC1RdW9pbmUtQVBJLVZlcnNpb24nOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChxdWVyeSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKTtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICdwYXRoJzogdXJsLCBcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSwgXG4gICAgICAgICAgICAgICAgJ3Rva2VuX2lkJzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ2lhdCc6IE1hdGguZmxvb3IgKG5vbmNlIC8gMTAwMCksIC8vIGlzc3VlZCBhdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyAocXVlcnkpLmxlbmd0aClcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgKHF1ZXJ5KTtcbiAgICAgICAgICAgIGhlYWRlcnNbJ1gtUXVvaW5lLUF1dGgnXSA9IHRoaXMuand0IChyZXF1ZXN0LCB0aGlzLnNlY3JldCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHRoaXMudXJsc1snYXBpJ10gKyB1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgdGhlcm9jayA9IHtcblxuICAgICdpZCc6ICd0aGVyb2NrJyxcbiAgICAnbmFtZSc6ICdUaGVSb2NrVHJhZGluZycsXG4gICAgJ2NvdW50cmllcyc6ICdNVCcsXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsXG4gICAgJ3ZlcnNpb24nOiAndjEnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2ODY5LTc1MDU3ZmEyLTVlZTktMTFlNy05YTZmLTEzZTY0MWZhNDcwNy5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8vYXBpLnRoZXJvY2t0cmFkaW5nLmNvbScsXG4gICAgICAgICd3d3cnOiAnaHR0cHM6Ly90aGVyb2NrdHJhZGluZy5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vYXBpLnRoZXJvY2t0cmFkaW5nLmNvbS9kb2MvJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdwdWJsaWMnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdmdW5kcy97aWR9L29yZGVyYm9vaycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRzL3tpZH0vdGlja2VyJyxcbiAgICAgICAgICAgICAgICAnZnVuZHMve2lkfS90cmFkZXMnLFxuICAgICAgICAgICAgICAgICdmdW5kcy90aWNrZXJzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYmFsYW5jZXMnLFxuICAgICAgICAgICAgICAgICdiYWxhbmNlcy97aWR9JyxcbiAgICAgICAgICAgICAgICAnZGlzY291bnRzJyxcbiAgICAgICAgICAgICAgICAnZGlzY291bnRzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdmdW5kcycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRzL3tpZH0nLFxuICAgICAgICAgICAgICAgICdmdW5kcy97aWR9L3RyYWRlcycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRzL3tmdW5kX2lkfS9vcmRlcnMnLFxuICAgICAgICAgICAgICAgICdmdW5kcy97ZnVuZF9pZH0vb3JkZXJzL3tpZH0nLCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAnZnVuZHMve2Z1bmRfaWR9L3Bvc2l0aW9uX2JhbGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnZnVuZHMve2Z1bmRfaWR9L3Bvc2l0aW9ucycsXG4gICAgICAgICAgICAgICAgJ2Z1bmRzL3tmdW5kX2lkfS9wb3NpdGlvbnMve2lkfScsXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucy97aWR9JyxcbiAgICAgICAgICAgICAgICAnd2l0aGRyYXdfbGltaXRzL3tpZH0nLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhd19saW1pdHMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdhdG1zL3dpdGhkcmF3JyxcbiAgICAgICAgICAgICAgICAnZnVuZHMve2Z1bmRfaWR9L29yZGVycycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6IFtcbiAgICAgICAgICAgICAgICAnZnVuZHMve2Z1bmRfaWR9L29yZGVycy97aWR9JyxcbiAgICAgICAgICAgICAgICAnZnVuZHMve2Z1bmRfaWR9L29yZGVycy9yZW1vdmVfYWxsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldEZ1bmRzVGlja2VycyAoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb2R1Y3RzWyd0aWNrZXJzJ10ubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ3RpY2tlcnMnXVtwXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ2Z1bmRfaWQnXTtcbiAgICAgICAgICAgIGxldCBiYXNlID0gaWQuc2xpY2UgKDAsIDMpO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gaWQuc2xpY2UgKDMsIDYpO1xuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoICh7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAnYmFzZSc6IGJhc2UsXG4gICAgICAgICAgICAgICAgJ3F1b3RlJzogcXVvdGUsXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBwcm9kdWN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZmV0Y2hCYWxhbmNlICgpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVHZXRCYWxhbmNlcyAoKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hPcmRlckJvb2sgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljR2V0RnVuZHNJZE9yZGVyYm9vayAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHRpY2tlciA9IGF3YWl0IHRoaXMucHVibGljR2V0RnVuZHNJZFRpY2tlciAoe1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMucGFyc2U4NjAxICh0aWNrZXJbJ2RhdGUnXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdvcGVuJzogcGFyc2VGbG9hdCAodGlja2VyWydvcGVuJ10pLFxuICAgICAgICAgICAgJ2Nsb3NlJzogcGFyc2VGbG9hdCAodGlja2VyWydjbG9zZSddKSxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sdW1lX3RyYWRlZCddKSxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsndm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldEZ1bmRzSWRUcmFkZXMgKHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBpZiAodHlwZSA9PSAnbWFya2V0JylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciAodGhpcy5pZCArICcgYWxsb3dzIGxpbWl0IG9yZGVycyBvbmx5Jyk7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVQb3N0RnVuZHNGdW5kSWRPcmRlcnMgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAnZnVuZF9pZCc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdzaWRlJzogc2lkZSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgICAgICAncHJpY2UnOiBwcmljZSxcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIHJlcXVlc3QgKHBhdGgsIHR5cGUgPSAncHVibGljJywgbWV0aG9kID0gJ0dFVCcsIHBhcmFtcyA9IHt9LCBoZWFkZXJzID0gdW5kZWZpbmVkLCBib2R5ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybHNbJ2FwaSddICsgJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSk7XG4gICAgICAgIGlmICh0eXBlID09ICdwcml2YXRlJykge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKS50b1N0cmluZyAoKTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ1gtVFJULUtFWSc6IHRoaXMuYXBpS2V5LFxuICAgICAgICAgICAgICAgICdYLVRSVC1OT05DRSc6IG5vbmNlLFxuICAgICAgICAgICAgICAgICdYLVRSVC1TSUdOJzogdGhpcy5obWFjIChub25jZSArIHVybCwgdGhpcy5zZWNyZXQsICdzaGE1MTInKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMgKHF1ZXJ5KS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHZhdWx0b3JvID0ge1xuXG4gICAgJ2lkJzogJ3ZhdWx0b3JvJyxcbiAgICAnbmFtZSc6ICdWYXVsdG9ybycsXG4gICAgJ2NvdW50cmllcyc6ICdDSCcsXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsXG4gICAgJ3ZlcnNpb24nOiAnMScsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY4ODAtZjIwNWU4NzAtNWVlOS0xMWU3LThmZTItMGQ1YjE1ODgwNzUyLmpwZycsXG4gICAgICAgICdhcGknOiAnaHR0cHM6Ly9hcGkudmF1bHRvcm8uY29tJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy52YXVsdG9yby5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vYXBpLnZhdWx0b3JvLmNvbScsXG4gICAgfSxcbiAgICAnYXBpJzoge1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnYmlkYW5kYXNrJyxcbiAgICAgICAgICAgICAgICAnYnV5b3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnbGF0ZXN0JyxcbiAgICAgICAgICAgICAgICAnbGF0ZXN0dHJhZGVzJyxcbiAgICAgICAgICAgICAgICAnbWFya2V0cycsXG4gICAgICAgICAgICAgICAgJ29yZGVyYm9vaycsXG4gICAgICAgICAgICAgICAgJ3NlbGxvcmRlcnMnLFxuICAgICAgICAgICAgICAgICd0cmFuc2FjdGlvbnMvZGF5JyxcbiAgICAgICAgICAgICAgICAndHJhbnNhY3Rpb25zL2hvdXInLFxuICAgICAgICAgICAgICAgICd0cmFuc2FjdGlvbnMvbW9udGgnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3ByaXZhdGUnOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnbXl0cmFkZXMnLFxuICAgICAgICAgICAgICAgICdvcmRlcnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdidXkve3N5bWJvbH0ve3R5cGV9JyxcbiAgICAgICAgICAgICAgICAnY2FuY2VsL3tvcmRlcmlkJyxcbiAgICAgICAgICAgICAgICAnc2VsbC97c3ltYm9sfS97dHlwZX0nLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhdycsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLnB1YmxpY0dldE1hcmtldHMgKCk7XG4gICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ2RhdGEnXTtcbiAgICAgICAgbGV0IGJhc2UgPSBwcm9kdWN0WydCYXNlQ3VycmVuY3knXTtcbiAgICAgICAgbGV0IHF1b3RlID0gcHJvZHVjdFsnTWFya2V0Q3VycmVuY3knXTtcbiAgICAgICAgbGV0IHN5bWJvbCA9IGJhc2UgKyAnLycgKyBxdW90ZTtcbiAgICAgICAgbGV0IGJhc2VJZCA9IGJhc2U7XG4gICAgICAgIGxldCBxdW90ZUlkID0gcXVvdGU7XG4gICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ01hcmtldE5hbWUnXTtcbiAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgJ3N5bWJvbCc6IHN5bWJvbCxcbiAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICdxdW90ZSc6IHF1b3RlLFxuICAgICAgICAgICAgJ2Jhc2VJZCc6IGJhc2VJZCxcbiAgICAgICAgICAgICdxdW90ZUlkJzogcXVvdGVJZCxcbiAgICAgICAgICAgICdpbmZvJzogcHJvZHVjdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGZldGNoQmFsYW5jZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVHZXRCYWxhbmNlICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNHZXRPcmRlcmJvb2sgKCk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCBxdW90ZSA9IGF3YWl0IHRoaXMucHVibGljR2V0QmlkYW5kYXNrICgpO1xuICAgICAgICBsZXQgYmlkc0xlbmd0aCA9IHF1b3RlWydiaWRzJ10ubGVuZ3RoO1xuICAgICAgICBsZXQgYmlkID0gcXVvdGVbJ2JpZHMnXVtiaWRzTGVuZ3RoIC0gMV07XG4gICAgICAgIGxldCBhc2sgPSBxdW90ZVsnYXNrcyddWzBdO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnB1YmxpY0dldE1hcmtldHMgKCk7XG4gICAgICAgIGxldCB0aWNrZXIgPSByZXNwb25zZVsnZGF0YSddO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5taWxsaXNlY29uZHMgKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJzI0aEhpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWycyNGhMb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogYmlkWzBdLFxuICAgICAgICAgICAgJ2Fzayc6IGFza1swXSxcbiAgICAgICAgICAgICd2d2FwJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ29wZW4nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnY2xvc2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnbGFzdFByaWNlJ10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYmFzZVZvbHVtZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdxdW90ZVZvbHVtZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnMjRoVm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFRyYW5zYWN0aW9uc0RheSAoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IG1ldGhvZCA9ICdwcml2YXRlUG9zdCcgKyB0aGlzLmNhcGl0YWxpemUgKHNpZGUpICsgJ1N5bWJvbFR5cGUnO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgJ3N5bWJvbCc6IHBbJ3F1b3RlSWQnXS50b0xvd2VyQ2FzZSAoKSxcbiAgICAgICAgICAgICd0eXBlJzogdHlwZSxcbiAgICAgICAgICAgICdnbGQnOiBhbW91bnQsXG4gICAgICAgICAgICAncHJpY2UnOiBwcmljZSB8fCAxLFxuICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdwdWJsaWMnLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLyc7XG4gICAgICAgIGlmICh0eXBlID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICB1cmwgKz0gcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICB1cmwgKz0gdGhpcy52ZXJzaW9uICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICAgICAnbm9uY2UnOiBub25jZSxcbiAgICAgICAgICAgICAgICAnYXBpa2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICB9LCB0aGlzLm9taXQgKHBhcmFtcywgdGhpcy5leHRyYWN0UGFyYW1zIChwYXRoKSkpO1xuICAgICAgICAgICAgdXJsICs9ICc/JyArIHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ1gtU2lnbmF0dXJlJzogdGhpcy5obWFjICh1cmwsIHRoaXMuc2VjcmV0KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHZpcndveCA9IHtcblxuICAgICdpZCc6ICd2aXJ3b3gnLFxuICAgICduYW1lJzogJ1ZpcldvWCcsXG4gICAgJ2NvdW50cmllcyc6ICdBVCcsXG4gICAgJ3JhdGVMaW1pdCc6IDEwMDAsXG4gICAgJ3VybHMnOiB7XG4gICAgICAgICdsb2dvJzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEyOTQ0NTQvMjc3NjY4OTQtNmRhOWQzNjAtNWVlYS0xMWU3LTkwYWEtNDFmMjcxMWI3NDA1LmpwZycsXG4gICAgICAgICdhcGknOiB7XG4gICAgICAgICAgICAncHVibGljJzogJ2h0dHA6Ly9hcGkudmlyd294LmNvbS9hcGkvanNvbi5waHAnLFxuICAgICAgICAgICAgJ3ByaXZhdGUnOiAnaHR0cHM6Ly93d3cudmlyd294LmNvbS9hcGkvdHJhZGluZy5waHAnLFxuICAgICAgICB9LFxuICAgICAgICAnd3d3JzogJ2h0dHBzOi8vd3d3LnZpcndveC5jb20nLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vd3d3LnZpcndveC5jb20vZGV2ZWxvcGVycy5waHAnLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2dldEluc3RydW1lbnRzJyxcbiAgICAgICAgICAgICAgICAnZ2V0QmVzdFByaWNlcycsXG4gICAgICAgICAgICAgICAgJ2dldE1hcmtldERlcHRoJyxcbiAgICAgICAgICAgICAgICAnZXN0aW1hdGVNYXJrZXRPcmRlcicsXG4gICAgICAgICAgICAgICAgJ2dldFRyYWRlZFByaWNlVm9sdW1lJyxcbiAgICAgICAgICAgICAgICAnZ2V0UmF3VHJhZGVEYXRhJyxcbiAgICAgICAgICAgICAgICAnZ2V0U3RhdGlzdGljcycsXG4gICAgICAgICAgICAgICAgJ2dldFRlcm1pbmFsTGlzdCcsXG4gICAgICAgICAgICAgICAgJ2dldEdyaWRMaXN0JyxcbiAgICAgICAgICAgICAgICAnZ2V0R3JpZFN0YXRpc3RpY3MnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdnZXRJbnN0cnVtZW50cycsXG4gICAgICAgICAgICAgICAgJ2dldEJlc3RQcmljZXMnLFxuICAgICAgICAgICAgICAgICdnZXRNYXJrZXREZXB0aCcsXG4gICAgICAgICAgICAgICAgJ2VzdGltYXRlTWFya2V0T3JkZXInLFxuICAgICAgICAgICAgICAgICdnZXRUcmFkZWRQcmljZVZvbHVtZScsXG4gICAgICAgICAgICAgICAgJ2dldFJhd1RyYWRlRGF0YScsXG4gICAgICAgICAgICAgICAgJ2dldFN0YXRpc3RpY3MnLFxuICAgICAgICAgICAgICAgICdnZXRUZXJtaW5hbExpc3QnLFxuICAgICAgICAgICAgICAgICdnZXRHcmlkTGlzdCcsXG4gICAgICAgICAgICAgICAgJ2dldEdyaWRTdGF0aXN0aWNzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdwcml2YXRlJzoge1xuICAgICAgICAgICAgJ2dldCc6IFtcbiAgICAgICAgICAgICAgICAnY2FuY2VsT3JkZXInLFxuICAgICAgICAgICAgICAgICdnZXRCYWxhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2dldENvbW1pc3Npb25EaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgJ2dldE9yZGVycycsXG4gICAgICAgICAgICAgICAgJ2dldFRyYW5zYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgJ3BsYWNlT3JkZXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwb3N0JzogW1xuICAgICAgICAgICAgICAgICdjYW5jZWxPcmRlcicsXG4gICAgICAgICAgICAgICAgJ2dldEJhbGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnZ2V0Q29tbWlzc2lvbkRpc2NvdW50JyxcbiAgICAgICAgICAgICAgICAnZ2V0T3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnZ2V0VHJhbnNhY3Rpb25zJyxcbiAgICAgICAgICAgICAgICAncGxhY2VPcmRlcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFByb2R1Y3RzICgpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gYXdhaXQgdGhpcy5wdWJsaWNHZXRJbnN0cnVtZW50cyAoKTtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyAocHJvZHVjdHNbJ3Jlc3VsdCddKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IGtleXMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gcHJvZHVjdHNbJ3Jlc3VsdCddW2tleXNbcF1dO1xuICAgICAgICAgICAgbGV0IGlkID0gcHJvZHVjdFsnaW5zdHJ1bWVudElEJ107XG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gcHJvZHVjdFsnc3ltYm9sJ107XG4gICAgICAgICAgICBsZXQgYmFzZSA9IHByb2R1Y3RbJ2xvbmdDdXJyZW5jeSddO1xuICAgICAgICAgICAgbGV0IHF1b3RlID0gcHJvZHVjdFsnc2hvcnRDdXJyZW5jeSddO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcml2YXRlUG9zdEdldEJhbGFuY2VzICgpO1xuICAgIH0sXG5cbiAgICBmZXRjaEJlc3RQcmljZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljUG9zdEdldEJlc3RQcmljZXMgKHtcbiAgICAgICAgICAgICdzeW1ib2xzJzogWyB0aGlzLnN5bWJvbCAocHJvZHVjdCkgXSxcbiAgICAgICAgfSk7XG4gICAgfSwgXG5cbiAgICBmZXRjaE9yZGVyQm9vayAocHJvZHVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNQb3N0R2V0TWFya2V0RGVwdGggKHtcbiAgICAgICAgICAgICdzeW1ib2xzJzogWyB0aGlzLnN5bWJvbCAocHJvZHVjdCkgXSxcbiAgICAgICAgICAgICdidXlEZXB0aCc6IDEwMCxcbiAgICAgICAgICAgICdzZWxsRGVwdGgnOiAxMDAsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhc3luYyBmZXRjaFRpY2tlciAocHJvZHVjdCkge1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5taWxsaXNlY29uZHMgKCk7XG4gICAgICAgIGxldCBzdGFydCA9IGVuZCAtIDg2NDAwMDAwO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnB1YmxpY0dldFRyYWRlZFByaWNlVm9sdW1lICh7XG4gICAgICAgICAgICAnaW5zdHJ1bWVudCc6IHRoaXMuc3ltYm9sIChwcm9kdWN0KSxcbiAgICAgICAgICAgICdlbmREYXRlJzogdGhpcy55eXl5bW1kZGhobW1zcyAoZW5kKSxcbiAgICAgICAgICAgICdzdGFydERhdGUnOiB0aGlzLnl5eXltbWRkaGhtbXNzIChzdGFydCksXG4gICAgICAgICAgICAnSExPQyc6IDEsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGlja2VycyA9IHJlc3BvbnNlWydyZXN1bHQnXVsncHJpY2VWb2x1bWVMaXN0J107XG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMgKHRpY2tlcnMpO1xuICAgICAgICBsZXQgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGxldCBsYXN0S2V5ID0ga2V5c1tsZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IHRpY2tlciA9IHRpY2tlcnNbbGFzdEtleV07XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1pbGxpc2Vjb25kcyAoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICd0aW1lc3RhbXAnOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAnZGF0ZXRpbWUnOiB0aGlzLmlzbzg2MDEgKHRpbWVzdGFtcCksXG4gICAgICAgICAgICAnaGlnaCc6IHBhcnNlRmxvYXQgKHRpY2tlclsnaGlnaCddKSxcbiAgICAgICAgICAgICdsb3cnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvdyddKSxcbiAgICAgICAgICAgICdiaWQnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXNrJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHBhcnNlRmxvYXQgKHRpY2tlclsnb3BlbiddKSxcbiAgICAgICAgICAgICdjbG9zZSc6IHBhcnNlRmxvYXQgKHRpY2tlclsnY2xvc2UnXSksXG4gICAgICAgICAgICAnZmlyc3QnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnbGFzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjaGFuZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAncGVyY2VudGFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdhdmVyYWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Jhc2VWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xvbmdWb2x1bWUnXSksXG4gICAgICAgICAgICAncXVvdGVWb2x1bWUnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ3Nob3J0Vm9sdW1lJ10pLFxuICAgICAgICAgICAgJ2luZm8nOiB0aWNrZXIsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZldGNoVHJhZGVzIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YmxpY0dldFJhd1RyYWRlRGF0YSAoe1xuICAgICAgICAgICAgJ2luc3RydW1lbnQnOiB0aGlzLnN5bWJvbCAocHJvZHVjdCksXG4gICAgICAgICAgICAndGltZXNwYW4nOiAzNjAwLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlT3JkZXIgKHByb2R1Y3QsIHR5cGUsIHNpZGUsIGFtb3VudCwgcHJpY2UgPSB1bmRlZmluZWQsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgICdpbnN0cnVtZW50JzogdGhpcy5zeW1ib2wgKHByb2R1Y3QpLFxuICAgICAgICAgICAgJ29yZGVyVHlwZSc6IHNpZGUudG9VcHBlckNhc2UgKCksXG4gICAgICAgICAgICAnYW1vdW50JzogYW1vdW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PSAnbGltaXQnKVxuICAgICAgICAgICAgb3JkZXJbJ3ByaWNlJ10gPSBwcmljZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmF0ZVBvc3RQbGFjZU9yZGVyICh0aGlzLmV4dGVuZCAob3JkZXIsIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ3B1YmxpYycsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXVt0eXBlXTtcbiAgICAgICAgbGV0IGF1dGggPSB7fTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3B1YmxpYycpIHtcbiAgICAgICAgICAgIGF1dGhbJ2tleSddID0gdGhpcy5hcGlLZXk7XG4gICAgICAgICAgICBhdXRoWyd1c2VyJ10gPSB0aGlzLmxvZ2luO1xuICAgICAgICAgICAgYXV0aFsncGFzcyddID0gdGhpcy5wYXNzd29yZDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbm9uY2UgPSB0aGlzLm5vbmNlICgpO1xuICAgICAgICBpZiAobWV0aG9kID09ICdHRVQnKSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgdGhpcy51cmxlbmNvZGUgKHRoaXMuZXh0ZW5kICh7IFxuICAgICAgICAgICAgICAgICdtZXRob2QnOiBwYXRoLCBcbiAgICAgICAgICAgICAgICAnaWQnOiBub25jZSxcbiAgICAgICAgICAgIH0sIGF1dGgsIHBhcmFtcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVycyA9IHsgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9O1xuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5ICh7IFxuICAgICAgICAgICAgICAgICdtZXRob2QnOiBwYXRoLCBcbiAgICAgICAgICAgICAgICAncGFyYW1zJzogdGhpcy5leHRlbmQgKGF1dGgsIHBhcmFtcyksXG4gICAgICAgICAgICAgICAgJ2lkJzogbm9uY2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCAodXJsLCBtZXRob2QsIGhlYWRlcnMsIGJvZHkpO1xuICAgIH0sXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHlvYml0ID0ge1xuXG4gICAgJ2lkJzogJ3lvYml0JyxcbiAgICAnbmFtZSc6ICdZb0JpdCcsXG4gICAgJ2NvdW50cmllcyc6ICdSVScsXG4gICAgJ3JhdGVMaW1pdCc6IDIwMDAsIC8vIHJlc3BvbnNlcyBhcmUgY2FjaGVkIGV2ZXJ5IDIgc2Vjb25kc1xuICAgICd2ZXJzaW9uJzogJzMnLFxuICAgICd1cmxzJzoge1xuICAgICAgICAnbG9nbyc6ICdodHRwczovL3VzZXItaW1hZ2VzLmdpdGh1YnVzZXJjb250ZW50LmNvbS8xMjk0NDU0LzI3NzY2OTEwLWNkY2JmZGFlLTVlZWEtMTFlNy05ODU5LTAzZmVhODczMjcyZC5qcGcnLFxuICAgICAgICAnYXBpJzogJ2h0dHBzOi8veW9iaXQubmV0JyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3d3dy55b2JpdC5uZXQnLFxuICAgICAgICAnZG9jJzogJ2h0dHBzOi8vd3d3LnlvYml0Lm5ldC9lbi9hcGkvJyxcbiAgICB9LFxuICAgICdhcGknOiB7XG4gICAgICAgICdhcGknOiB7XG4gICAgICAgICAgICAnZ2V0JzogW1xuICAgICAgICAgICAgICAgICdkZXB0aC97cGFpcnN9JyxcbiAgICAgICAgICAgICAgICAnaW5mbycsXG4gICAgICAgICAgICAgICAgJ3RpY2tlci97cGFpcnN9JyxcbiAgICAgICAgICAgICAgICAndHJhZGVzL3twYWlyc30nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3RhcGknOiB7XG4gICAgICAgICAgICAncG9zdCc6IFtcbiAgICAgICAgICAgICAgICAnQWN0aXZlT3JkZXJzJyxcbiAgICAgICAgICAgICAgICAnQ2FuY2VsT3JkZXInLFxuICAgICAgICAgICAgICAgICdHZXREZXBvc2l0QWRkcmVzcycsXG4gICAgICAgICAgICAgICAgJ2dldEluZm8nLFxuICAgICAgICAgICAgICAgICdPcmRlckluZm8nLFxuICAgICAgICAgICAgICAgICdUcmFkZScsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICdUcmFkZUhpc3RvcnknLFxuICAgICAgICAgICAgICAgICdXaXRoZHJhd0NvaW5zVG9BZGRyZXNzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLmFwaUdldEluZm8gKCk7XG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMgKHByb2R1Y3RzWydwYWlycyddKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IGtleXMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBpZCA9IGtleXNbcF07XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzWydwYWlycyddW2lkXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBpZC50b1VwcGVyQ2FzZSAoKS5yZXBsYWNlICgnXycsICcvJyk7XG4gICAgICAgICAgICBsZXQgWyBiYXNlLCBxdW90ZSBdID0gc3ltYm9sLnNwbGl0ICgnLycpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50YXBpUG9zdEdldEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldERlcHRoUGFpcnMgKHtcbiAgICAgICAgICAgICdwYWlycyc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoVGlja2VyIChwcm9kdWN0KSB7XG4gICAgICAgIGxldCBwID0gdGhpcy5wcm9kdWN0IChwcm9kdWN0KTtcbiAgICAgICAgbGV0IHRpY2tlcnMgPSBhd2FpdCB0aGlzLmFwaUdldFRpY2tlclBhaXJzICh7XG4gICAgICAgICAgICAncGFpcnMnOiBwWydpZCddLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHRpY2tlciA9IHRpY2tlcnNbcFsnaWQnXV07XG4gICAgICAgIGxldCB0aW1lc3RhbXAgPSB0aWNrZXJbJ3VwZGF0ZWQnXSAqIDEwMDA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydidXknXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydzZWxsJ10pLFxuICAgICAgICAgICAgJ3Z3YXAnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnb3Blbic6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdjbG9zZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdmaXJzdCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdsYXN0JzogcGFyc2VGbG9hdCAodGlja2VyWydsYXN0J10pLFxuICAgICAgICAgICAgJ2NoYW5nZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdwZXJjZW50YWdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2F2ZXJhZ2UnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2F2ZyddKSxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2xfY3VyJ10pLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2wnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0VHJhZGVzUGFpcnMgKHtcbiAgICAgICAgICAgICdwYWlycyc6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZU9yZGVyIChwcm9kdWN0LCB0eXBlLCBzaWRlLCBhbW91bnQsIHByaWNlID0gdW5kZWZpbmVkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBpZiAodHlwZSA9PSAnbWFya2V0JylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciAodGhpcy5pZCArICcgYWxsb3dzIGxpbWl0IG9yZGVycyBvbmx5Jyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRhcGlQb3N0VHJhZGUgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAncGFpcic6IHRoaXMucHJvZHVjdElkIChwcm9kdWN0KSxcbiAgICAgICAgICAgICd0eXBlJzogc2lkZSxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgICAgICAncmF0ZSc6IHByaWNlLFxuICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgY2FuY2VsT3JkZXIgKGlkLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy50YXBpUG9zdENhbmNlbE9yZGVyICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgJ29yZGVyX2lkJzogaWQsXG4gICAgICAgIH0sIHBhcmFtcykpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0IChwYXRoLCB0eXBlID0gJ2FwaScsIG1ldGhvZCA9ICdHRVQnLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHVuZGVmaW5lZCwgYm9keSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmxzWydhcGknXSArICcvJyArIHR5cGU7XG4gICAgICAgIGlmICh0eXBlID09ICdhcGknKSB7XG4gICAgICAgICAgICB1cmwgKz0gJy8nICsgdGhpcy52ZXJzaW9uICsgJy8nICsgdGhpcy5pbXBsb2RlUGFyYW1zIChwYXRoLCBwYXJhbXMpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5vbWl0IChwYXJhbXMsIHRoaXMuZXh0cmFjdFBhcmFtcyAocGF0aCkpO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzIChxdWVyeSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyB0aGlzLnVybGVuY29kZSAocXVlcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vbmNlID0gdGhpcy5ub25jZSAoKTtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHRoaXMuZXh0ZW5kICh7ICdtZXRob2QnOiBwYXRoLCAnbm9uY2UnOiBub25jZSB9LCBwYXJhbXMpO1xuICAgICAgICAgICAgYm9keSA9IHRoaXMudXJsZW5jb2RlIChxdWVyeSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAna2V5JzogdGhpcy5hcGlLZXksXG4gICAgICAgICAgICAgICAgJ3NpZ24nOiB0aGlzLmhtYWMgKGJvZHksIHRoaXMuc2VjcmV0LCAnc2hhNTEyJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoICh1cmwsIG1ldGhvZCwgaGVhZGVycywgYm9keSk7XG4gICAgfSxcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgemFpZiA9IHtcblxuICAgICdpZCc6ICd6YWlmJyxcbiAgICAnbmFtZSc6ICdaYWlmJyxcbiAgICAnY291bnRyaWVzJzogJ0pQJyxcbiAgICAncmF0ZUxpbWl0JzogMzAwMCxcbiAgICAndmVyc2lvbic6ICcxJyxcbiAgICAndXJscyc6IHtcbiAgICAgICAgJ2xvZ28nOiAnaHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTI5NDQ1NC8yNzc2NjkyNy0zOWNhMmFkYS01ZWViLTExZTctOTcyZi0xYjQxOTk1MThjYTYuanBnJyxcbiAgICAgICAgJ2FwaSc6ICdodHRwczovL2FwaS56YWlmLmpwJyxcbiAgICAgICAgJ3d3dyc6ICdodHRwczovL3phaWYuanAnLFxuICAgICAgICAnZG9jJzogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vY29ycC56YWlmLmpwL2FwaS1kb2NzJyxcbiAgICAgICAgICAgICdodHRwczovL2NvcnAuemFpZi5qcC9hcGktZG9jcy9hcGlfbGlua3MnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3phaWYuanAnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS95b3UyMTk3OS9ub2RlLXphaWYnLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgJ2FwaSc6IHtcbiAgICAgICAgJ2FwaSc6IHtcbiAgICAgICAgICAgICdnZXQnOiBbXG4gICAgICAgICAgICAgICAgJ2RlcHRoL3twYWlyfScsXG4gICAgICAgICAgICAgICAgJ2N1cnJlbmNpZXMve3BhaXJ9JyxcbiAgICAgICAgICAgICAgICAnY3VycmVuY2llcy9hbGwnLFxuICAgICAgICAgICAgICAgICdjdXJyZW5jeV9wYWlycy97cGFpcn0nLFxuICAgICAgICAgICAgICAgICdjdXJyZW5jeV9wYWlycy9hbGwnLFxuICAgICAgICAgICAgICAgICdsYXN0X3ByaWNlL3twYWlyfScsXG4gICAgICAgICAgICAgICAgJ3RpY2tlci97cGFpcn0nLFxuICAgICAgICAgICAgICAgICd0cmFkZXMve3BhaXJ9JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICd0YXBpJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2FjdGl2ZV9vcmRlcnMnLFxuICAgICAgICAgICAgICAgICdjYW5jZWxfb3JkZXInLFxuICAgICAgICAgICAgICAgICdkZXBvc2l0X2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICdnZXRfaWRfaW5mbycsXG4gICAgICAgICAgICAgICAgJ2dldF9pbmZvJyxcbiAgICAgICAgICAgICAgICAnZ2V0X2luZm8yJyxcbiAgICAgICAgICAgICAgICAnZ2V0X3BlcnNvbmFsX2luZm8nLFxuICAgICAgICAgICAgICAgICd0cmFkZScsXG4gICAgICAgICAgICAgICAgJ3RyYWRlX2hpc3RvcnknLFxuICAgICAgICAgICAgICAgICd3aXRoZHJhdycsXG4gICAgICAgICAgICAgICAgJ3dpdGhkcmF3X2hpc3RvcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2VjYXBpJzoge1xuICAgICAgICAgICAgJ3Bvc3QnOiBbXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZUludm9pY2UnLFxuICAgICAgICAgICAgICAgICdnZXRJbnZvaWNlJyxcbiAgICAgICAgICAgICAgICAnZ2V0SW52b2ljZUlkc0J5T3JkZXJOdW1iZXInLFxuICAgICAgICAgICAgICAgICdjYW5jZWxJbnZvaWNlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jIGZldGNoUHJvZHVjdHMgKCkge1xuICAgICAgICBsZXQgcHJvZHVjdHMgPSBhd2FpdCB0aGlzLmFwaUdldEN1cnJlbmN5UGFpcnNBbGwgKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9kdWN0cy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0c1twXTtcbiAgICAgICAgICAgIGxldCBpZCA9IHByb2R1Y3RbJ2N1cnJlbmN5X3BhaXInXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBwcm9kdWN0WyduYW1lJ107XG4gICAgICAgICAgICBsZXQgWyBiYXNlLCBxdW90ZSBdID0gc3ltYm9sLnNwbGl0ICgnLycpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2ggKHtcbiAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAnc3ltYm9sJzogc3ltYm9sLFxuICAgICAgICAgICAgICAgICdiYXNlJzogYmFzZSxcbiAgICAgICAgICAgICAgICAncXVvdGUnOiBxdW90ZSxcbiAgICAgICAgICAgICAgICAnaW5mbyc6IHByb2R1Y3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBmZXRjaEJhbGFuY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50YXBpUG9zdEdldEluZm8gKCk7XG4gICAgfSxcblxuICAgIGZldGNoT3JkZXJCb29rIChwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldERlcHRoUGFpciAgKHtcbiAgICAgICAgICAgICdwYWlyJzogdGhpcy5wcm9kdWN0SWQgKHByb2R1Y3QpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZmV0Y2hUaWNrZXIgKHByb2R1Y3QpIHtcbiAgICAgICAgbGV0IHRpY2tlciA9IGF3YWl0IHRoaXMuYXBpR2V0VGlja2VyUGFpciAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGltZXN0YW1wID0gdGhpcy5taWxsaXNlY29uZHMgKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndGltZXN0YW1wJzogdGltZXN0YW1wLFxuICAgICAgICAgICAgJ2RhdGV0aW1lJzogdGhpcy5pc284NjAxICh0aW1lc3RhbXApLFxuICAgICAgICAgICAgJ2hpZ2gnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2hpZ2gnXSksXG4gICAgICAgICAgICAnbG93JzogcGFyc2VGbG9hdCAodGlja2VyWydsb3cnXSksXG4gICAgICAgICAgICAnYmlkJzogcGFyc2VGbG9hdCAodGlja2VyWydiaWQnXSksXG4gICAgICAgICAgICAnYXNrJzogcGFyc2VGbG9hdCAodGlja2VyWydhc2snXSksXG4gICAgICAgICAgICAndndhcCc6IHBhcnNlRmxvYXQgKHRpY2tlclsndndhcCddKSxcbiAgICAgICAgICAgICdvcGVuJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2Nsb3NlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2ZpcnN0JzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ2xhc3QnOiBwYXJzZUZsb2F0ICh0aWNrZXJbJ2xhc3QnXSksXG4gICAgICAgICAgICAnY2hhbmdlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3BlcmNlbnRhZ2UnOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAnYXZlcmFnZSc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdiYXNlVm9sdW1lJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgJ3F1b3RlVm9sdW1lJzogcGFyc2VGbG9hdCAodGlja2VyWyd2b2x1bWUnXSksXG4gICAgICAgICAgICAnaW5mbyc6IHRpY2tlcixcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmV0Y2hUcmFkZXMgKHByb2R1Y3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0VHJhZGVzUGFpciAoe1xuICAgICAgICAgICAgJ3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVPcmRlciAocHJvZHVjdCwgdHlwZSwgc2lkZSwgYW1vdW50LCBwcmljZSA9IHVuZGVmaW5lZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ21hcmtldCcpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKHRoaXMuaWQgKyAnIGFsbG93cyBsaW1pdCBvcmRlcnMgb25seScpO1xuICAgICAgICByZXR1cm4gdGhpcy50YXBpUG9zdFRyYWRlICh0aGlzLmV4dGVuZCAoe1xuICAgICAgICAgICAgJ2N1cnJlbmN5X3BhaXInOiB0aGlzLnByb2R1Y3RJZCAocHJvZHVjdCksXG4gICAgICAgICAgICAnYWN0aW9uJzogKHNpZGUgPT0gJ2J1eScpID8gJ2JpZCcgOiAnYXNrJyxcbiAgICAgICAgICAgICdhbW91bnQnOiBhbW91bnQsXG4gICAgICAgICAgICAncHJpY2UnOiBwcmljZSxcbiAgICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfSxcblxuICAgIGNhbmNlbE9yZGVyIChpZCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFwaVBvc3RDYW5jZWxPcmRlciAodGhpcy5leHRlbmQgKHtcbiAgICAgICAgICAgICdvcmRlcl9pZCc6IGlkLFxuICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAocGF0aCwgdHlwZSA9ICdhcGknLCBtZXRob2QgPSAnR0VUJywgcGFyYW1zID0ge30sIGhlYWRlcnMgPSB1bmRlZmluZWQsIGJvZHkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsc1snYXBpJ10gKyAnLycgKyB0eXBlO1xuICAgICAgICBpZiAodHlwZSA9PSAnYXBpJykge1xuICAgICAgICAgICAgdXJsICs9ICcvJyArIHRoaXMudmVyc2lvbiArICcvJyArIHRoaXMuaW1wbG9kZVBhcmFtcyAocGF0aCwgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBub25jZSA9IHRoaXMubm9uY2UgKCk7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy51cmxlbmNvZGUgKHRoaXMuZXh0ZW5kICh7XG4gICAgICAgICAgICAgICAgJ21ldGhvZCc6IHBhdGgsXG4gICAgICAgICAgICAgICAgJ25vbmNlJzogbm9uY2UsXG4gICAgICAgICAgICB9LCBwYXJhbXMpKTtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGJvZHkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICdLZXknOiB0aGlzLmFwaUtleSxcbiAgICAgICAgICAgICAgICAnU2lnbic6IHRoaXMuaG1hYyAoYm9keSwgdGhpcy5zZWNyZXQsICdzaGE1MTInKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2ggKHVybCwgbWV0aG9kLCBoZWFkZXJzLCBib2R5KTtcbiAgICB9LFxufVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnZhciBtYXJrZXRzID0ge1xuXG4gICAgJ18xYnJva2VyJzogICAgXzFicm9rZXIsXG4gICAgJ18xYnRjeGUnOiAgICAgXzFidGN4ZSxcbiAgICAnYW54cHJvJzogICAgICBhbnhwcm8sXG4gICAgJ2JpdDJjJzogICAgICAgYml0MmMsXG4gICAgJ2JpdGJheSc6ICAgICAgYml0YmF5LFxuICAgICdiaXRjb2luY29pZCc6IGJpdGNvaW5jb2lkLFxuICAgICdiaXRmaW5leCc6ICAgIGJpdGZpbmV4LFxuICAgICdiaXRsaXNoJzogICAgIGJpdGxpc2gsXG4gICAgJ2JpdG1hcmtldCc6ICAgYml0bWFya2V0LFxuICAgICdiaXRtZXgnOiAgICAgIGJpdG1leCxcbiAgICAnYml0c28nOiAgICAgICBiaXRzbyxcbiAgICAnYml0c3RhbXAnOiAgICBiaXRzdGFtcCxcbiAgICAnYml0dHJleCc6ICAgICBiaXR0cmV4LFxuICAgICdidGNjaGluYSc6ICAgIGJ0Y2NoaW5hLFxuICAgICdidGN4JzogICAgICAgIGJ0Y3gsXG4gICAgJ2J4aW50aCc6ICAgICAgYnhpbnRoLFxuICAgICdjY2V4JzogICAgICAgIGNjZXgsXG4gICAgJ2NleCc6ICAgICAgICAgY2V4LFxuICAgICdjb2luY2hlY2snOiAgIGNvaW5jaGVjayxcbiAgICAnY29pbnNlY3VyZSc6ICBjb2luc2VjdXJlLFxuICAgICdleG1vJzogICAgICAgIGV4bW8sXG4gICAgJ2Z5YnNlJzogICAgICAgZnlic2UsXG4gICAgJ2Z5YnNnJzogICAgICAgZnlic2csXG4gICAgJ2dkYXgnOiAgICAgICAgZ2RheCxcbiAgICAnaGl0YnRjJzogICAgICBoaXRidGMsXG4gICAgJ2h1b2JpJzogICAgICAgaHVvYmksXG4gICAgJ2p1YmknOiAgICAgICAganViaSxcbiAgICAna3Jha2VuJzogICAgICBrcmFrZW4sXG4gICAgJ2x1bm8nOiAgICAgICAgbHVubyxcbiAgICAnb2tjb2luY255JzogICBva2NvaW5jbnksXG4gICAgJ29rY29pbnVzZCc6ICAgb2tjb2ludXNkLFxuICAgICdwb2xvbmlleCc6ICAgIHBvbG9uaWV4LFxuICAgICdxdWFkcmlnYWN4JzogIHF1YWRyaWdhY3gsXG4gICAgJ3F1b2luZSc6ICAgICAgcXVvaW5lLFxuICAgICd0aGVyb2NrJzogICAgIHRoZXJvY2ssXG4gICAgJ3ZhdWx0b3JvJzogICAgdmF1bHRvcm8sXG4gICAgJ3ZpcndveCc6ICAgICAgdmlyd294LFxuICAgICd5b2JpdCc6ICAgICAgIHlvYml0LFxuICAgICd6YWlmJzogICAgICAgIHphaWYsXG59XG5cbmxldCBkZWZpbmVBbGxNYXJrZXRzID0gZnVuY3Rpb24gKG1hcmtldHMpIHtcbiAgICBsZXQgcmVzdWx0ID0ge31cbiAgICBmb3IgKGxldCBpZCBpbiBtYXJrZXRzKVxuICAgICAgICByZXN1bHRbaWRdID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXJrZXQgKGV4dGVuZCAobWFya2V0c1tpZF0sIHBhcmFtcykpXG4gICAgICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmlmIChpc05vZGUpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVBbGxNYXJrZXRzIChtYXJrZXRzKVxuZWxzZVxuICAgIHdpbmRvdy5jY3h0ID0gZGVmaW5lQWxsTWFya2V0cyAobWFya2V0cylcblxufSkgKCkiXX0=