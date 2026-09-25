
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "esp_http_client.h"
#include "nvs_flash.h"

#include "driver/i2c_master.h"

#define WIFI_SSID "Bretschnecker"
#define WIFI_PASSWORD "danifraukebertmarten"

static const char *TAG = "wifi";

static void send_test_request(void)
{
    esp_http_client_config_t config = {
        .url = "http://192.168.178.32:3000/test",
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI(
            "http",
            "Request successful, status = %d",
            esp_http_client_get_status_code(client)
        );
    } else {
        ESP_LOGE(
            "http",
            "Request failed: %s",
            esp_err_to_name(err)
        );
    }

    esp_http_client_cleanup(client);
}

static void read_light_task(void *arg)
{
    // Configure I2C bus
    i2c_master_bus_config_t bus_config = {
        .i2c_port = I2C_NUM_0,
        .sda_io_num = GPIO_NUM_8,
        .scl_io_num = GPIO_NUM_9,
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .flags.enable_internal_pullup = true,
    };

    i2c_master_bus_handle_t bus_handle;

    ESP_ERROR_CHECK(
        i2c_new_master_bus(&bus_config, &bus_handle)
    );

    // Add BH1750
    i2c_device_config_t device_config = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = 0x23,
        .scl_speed_hz = 100000,
    };

    i2c_master_dev_handle_t sensor;

    ESP_ERROR_CHECK(
        i2c_master_bus_add_device(
            bus_handle,
            &device_config,
            &sensor
        )
    );

    // Measure continuously
    while (1)
    {
        uint8_t command = 0x20;

        ESP_ERROR_CHECK(
            i2c_master_transmit(
                sensor,
                &command,
                1,
                1000
            )
        );

        // Wait for BH1750 measurement
        vTaskDelay(pdMS_TO_TICKS(200));

        uint8_t data[2];

        ESP_ERROR_CHECK(
            i2c_master_receive(
                sensor,
                data,
                2,
                1000
            )
        );

        uint16_t raw =
            ((uint16_t)data[0] << 8) | data[1];

        float lux = raw / 1.2f;

        ESP_LOGI("bh1750", "Light: %.2f lux", lux);

        // 200ms measurement + 800ms wait ≈ one reading/second
        vTaskDelay(pdMS_TO_TICKS(800));
    }
}

static void wifi_event_handler(
    void *arg,
    esp_event_base_t event_base,
    int32_t event_id,
    void *event_data
)
{
    if (event_base == WIFI_EVENT &&
        event_id == WIFI_EVENT_STA_START) {

        esp_wifi_connect();
    }

    else if (event_base == WIFI_EVENT &&
             event_id == WIFI_EVENT_STA_DISCONNECTED) {

        ESP_LOGI(TAG, "Disconnected. Reconnecting...");
        esp_wifi_connect();
    }

    else if (event_base == IP_EVENT &&
             event_id == IP_EVENT_STA_GOT_IP) {

        ip_event_got_ip_t *event = event_data;

        ESP_LOGI(
            TAG,
            "Connected! IP: " IPSTR,
            IP2STR(&event->ip_info.ip)
        );

        send_test_request();
    }
}

static void wifi_init(void)
{
    ESP_ERROR_CHECK(esp_netif_init());

    ESP_ERROR_CHECK(
        esp_event_loop_create_default()
    );

    esp_netif_create_default_wifi_sta();

    wifi_init_config_t config = WIFI_INIT_CONFIG_DEFAULT();

    ESP_ERROR_CHECK(
        esp_wifi_init(&config)
    );

    ESP_ERROR_CHECK(
        esp_event_handler_register(
            WIFI_EVENT,
            ESP_EVENT_ANY_ID,
            &wifi_event_handler,
            NULL
        )
    );

    ESP_ERROR_CHECK(
        esp_event_handler_register(
            IP_EVENT,
            IP_EVENT_STA_GOT_IP,
            &wifi_event_handler,
            NULL
        )
    );

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = WIFI_SSID,
            .password = WIFI_PASSWORD,
        },
    };

    ESP_ERROR_CHECK(
        esp_wifi_set_mode(WIFI_MODE_STA)
    );

    ESP_ERROR_CHECK(
        esp_wifi_set_config(
            WIFI_IF_STA,
            &wifi_config
        )
    );

    ESP_ERROR_CHECK(
        esp_wifi_start()
    );
}

void app_main(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());
    xTaskCreate(
        read_light_task,    // function to run
        "bh1750_task",      // name
        4096,               // stack size
        NULL,               // argument
        5,                  // priority
        NULL                // task handle
    );
    wifi_init();
}