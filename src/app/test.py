import http.client

conn = http.client.HTTPSConnection("api.balampay.com")

headers = {
    'Accept': "application/json",
    'x-api-key': "rfa3aMb7Rl6TP09jcG6D23E4yZvmp04s9aw9E4vA"
}

conn.request("GET", "/sandbox/quotes?amount=100&base_currency=USD&quote_currency=COP", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))