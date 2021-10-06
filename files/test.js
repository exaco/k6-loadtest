// Creator: k6 Browser Recorder 0.6.1

import { sleep, group, check } from "k6";
import { Rate } from 'k6/metrics';
import http from "k6/http";
import { config } from "./config.js";

//Define constant variables 
const test_mode = __ENV.test_mode;
const base_url = config["base_url"];
const stages = config[test_mode]["stages"]
console.log("Configuration", JSON.stringify({ test_mode, base_url, stages }));

// Define option of the k6 test
export let options = {
    stages: stages
};
// Defining error rate
export let errorRate = new Rate('errors');

function make_random_word(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

export default function main() {
    // performing checking on status codes 
    const check_error = (response) => {
        const result = check(response, {
            'status is OK!': (r) => r.status === 200 || r.status === 202 || r.status === 204
        },
            { endpoint: response.url, status: response.status });
        if (!result) { // "If" should be there because errorRate graph in grafana wont work.
            //console.warn(response.request.url, response.status, JSON.stringify(response.body))
            errorRate.add(!result);   //Adding errorRate in case of check failure
        }
    };
    let response;
    const author = make_random_word(5);
    const book = make_random_word(5);
    let id;
    group("Create", function () {
        response = http.post(
          `${base_url}/books`,
          `{"title":"${book}","${author}":"Camos","read":false}`,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "content-type": "application/json; charset=UTF-8",
              "sec-ch-ua":
                '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Linux"',
            },
          }
        );
        check_error(response)
        response = http.options(`${base_url}/books`, null, {
          headers: {
            accept: "*/*",
            "access-control-request-headers": "content-type",
            "access-control-request-method": "POST",
            origin: "http://localhost:8080",
            "sec-fetch-mode": "cors",
          },
        });
        check_error(response)
        response = http.get(`${base_url}/books`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "sec-ch-ua":
              '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
          },
        });
        check_error(response)
        sleep(2);
    });
    group("Update", function () {
        id = JSON.parse(response.body)["books"][0]["id"]
        response = http.put(
          `${base_url}/books/${id}`,
          '{"title":"The Alchemist","author":"Paulo Coelho","read":true}',
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "content-type": "application/json; charset=UTF-8",
              "sec-ch-ua":
                '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Linux"',
            },
          }
        );
        check_error(response)
        response = http.options(
          `${base_url}/books/${id}`,
          null,
          {
            headers: {
              accept: "*/*",
              "access-control-request-headers": "content-type",
              "access-control-request-method": "PUT",
              origin: "http://localhost:8080",
              "sec-fetch-mode": "cors",
            },
          }
        );
        check_error(response)
        response = http.get(`${base_url}/books`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "sec-ch-ua":
              '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
          },
        });
        check_error(response)
        sleep(5);
    });
    group("Delete", function () {
        response = http.del(
          `${base_url}/books/${id}`,
          null,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "sec-ch-ua":
                '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Linux"',
            },
          }
        );
        check_error(response)
        response = http.options(
          `${base_url}/books/${id}`,
          null,
          {
            headers: {
              accept: "*/*",
              "access-control-request-method": "DELETE",
              origin: "http://localhost:8080",
              "sec-fetch-mode": "cors",
            },
          }
        );
        check_error(response)
        response = http.get(`${base_url}/books`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "sec-ch-ua":
              '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
          },
        });
        check_error(response)
      });
    }