#include <stdio.h>
#include <string.h>

#include "esp_log.h"
#include "esp_http_client.h"

#include "api.h"

#define API_URL "http://192.168.178.32:3000/readings"

static const char *TAG = "api";

void api_send_reading(
    int64_t device_id,
    float light_lux,
    float temperature,
    float humidity
)
{
    esp_http_client_config_t config = {
        .url = API_URL,
        .method = HTTP_METHOD_POST,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    esp_http_client_set_header(
        client,
        "Content-Type",
        "application/json"
    );

    char json[256];

    snprintf(
        json,
        sizeof(json),
        "{\"device_id\":%lld,\"light_lux\":%.2f,\"temperature\":%.2f,\"humidity\":%.2f}",
        (long long)device_id,
        light_lux,
        temperature,
        humidity
    );

    esp_http_client_set_post_field(
        client,
        json,
        strlen(json)
    );

    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI(
            TAG,
            "HTTP status: %d",
            esp_http_client_get_status_code(client)
        );
    } else {
        ESP_LOGE(
            TAG,
            "Request failed: %s",
            esp_err_to_name(err)
        );
    }

    esp_http_client_cleanup(client);
}