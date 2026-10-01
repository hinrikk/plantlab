#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"
#include "nvs_flash.h"

// Custom modules
#include "wifi.h"
#include "api.h"
#include "light_sensor.h"
#include "environment_sensor.h"

static void read_sensors_task(void *arg)
{
    while (1)
    {
        float lux = light_sensor_read_lux();

        environment_reading_t environment =
            environment_sensor_read();

        ESP_LOGI("sensors",
            "Light: %.2f lux | Temp: %.2f C | Humidity: %.2f %%",
            lux,
            environment.temperature,
            environment.humidity
        );

        // id currently hardcoded, later: make device identity/configuration more robust
        api_send_reading(
            1,
            lux,
            environment.temperature,
            environment.humidity
        );

        vTaskDelay(pdMS_TO_TICKS(2000));
    }
}

void app_main(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());

    wifi_init();
    light_sensor_init();
    environment_sensor_init();

    xTaskCreate(
        read_sensors_task,
        "sensors_task",
        4096,
        NULL,
        5,
        NULL
    );
}